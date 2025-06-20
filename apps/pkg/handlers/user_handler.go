package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserHandler struct {
	db        *gorm.DB
	jwtSecret string
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	// In production, get this from environment variables
	jwtSecret := "your-strong-secret-key"
	return &UserHandler{db: db, jwtSecret: jwtSecret}
}

func (h *UserHandler) Register(c *gin.Context) {
	var req struct {
		Username string  `json:"username" binding:"required"`
		Password string  `json:"password" binding:"required,min=8"`
		Email    *string `json:"email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if username exists
	var existingUser models.User
	if err := h.db.Where("username = ?", req.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	// Check if email exists
	if req.Email != nil {
		if err := h.db.Where("email = ?", *req.Email).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
			return
		}
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user
	user := models.User{
		Username: req.Username,
		Password: string(hashedPassword),
		Email:    req.Email,
	}

	if err := h.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate tokens
	tokenPair, err := h.generateTokens(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user_id": user.ID,
		"tokens":  tokenPair,
	})
}

func (h *UserHandler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user by username
	var user models.User
	if err := h.db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate tokens
	tokenPair, err := h.generateTokens(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}

	// Update last login
	now := time.Now()
	h.db.Model(&user).Update("last_login", &now)

	c.JSON(http.StatusOK, tokenPair)
}

func (h *UserHandler) RefreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate refresh token
	token, err := jwt.Parse(req.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(h.jwtSecret), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	// Check token type
	if claims["type"] != "refresh" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token type"})
		return
	}

	// Check expiration
	exp, ok := claims["exp"].(float64)
	if !ok || time.Now().Unix() > int64(exp) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
		return
	}

	// Get user ID
	userID, ok := claims["sub"].(float64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user in token"})
		return
	}

	// Verify refresh token exists in DB
	var tokenModel models.RefreshToken
	if err := h.db.Where("token = ? AND user_id = ?", req.RefreshToken, uint(userID)).First(&tokenModel).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	// Generate new access token
	accessToken, err := h.createAccessToken(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": accessToken})
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Sanitize sensitive data
	response := gin.H{
		"id":         user.ID,
		"username":   user.Username,
		"email":      user.Email,
		"created_at": user.CreatedAt,
		"last_login": user.LastLogin,
	}

	c.JSON(http.StatusOK, response)
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req struct {
		Username *string `json:"username"`
		Email    *string `json:"email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update username if provided
	if req.Username != nil {
		// Check if new username is available
		var existingUser models.User
		if err := h.db.Where("username = ?", *req.Username).Not("id = ?", userID).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already taken"})
			return
		}
		user.Username = *req.Username
	}

	// Update email if provided
	if req.Email != nil {
		// Check if new email is available
		var existingUser models.User
		if err := h.db.Where("email = ?", *req.Email).Not("id = ?", userID).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
			return
		}
		user.Email = req.Email
	}

	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

func (h *UserHandler) generateTokens(userID uint) (*models.TokenPair, error) {
	// Create access token
	accessToken, err := h.createAccessToken(userID)
	if err != nil {
		return nil, err
	}

	// Create refresh token
	refreshToken, err := h.createRefreshToken(userID)
	if err != nil {
		return nil, err
	}

	return &models.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (h *UserHandler) createAccessToken(userID uint) (string, error) {
	// Token expires in 15 minutes
	expirationTime := time.Now().Add(15 * time.Minute)

	claims := jwt.MapClaims{
		"sub":  userID,
		"exp":  expirationTime.Unix(),
		"type": "access",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.jwtSecret))
}

func (h *UserHandler) createRefreshToken(userID uint) (string, error) {
	// Token expires in 7 days
	expirationTime := time.Now().Add(7 * 24 * time.Hour)

	claims := jwt.MapClaims{
		"sub":  userID,
		"exp":  expirationTime.Unix(),
		"type": "refresh",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		return "", err
	}

	// Store refresh token in database
	refreshToken := models.RefreshToken{
		UserID:    userID,
		Token:     tokenString,
		ExpiresAt: expirationTime,
	}

	if err := h.db.Create(&refreshToken).Error; err != nil {
		return "", err
	}

	return tokenString, nil
}