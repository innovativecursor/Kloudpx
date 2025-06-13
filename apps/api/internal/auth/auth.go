package auth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	//"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"

	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"
)

var (
	googleOAuthConfig *oauth2.Config
	jwtSecret         []byte
)

func InitAuth() {
	googleOAuthConfig = &oauth2.Config{
		ClientID:     "573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com",
		ClientSecret: "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",
		RedirectURL:  "postmessage",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) < 32 {
		log.Fatal("JWT_SECRET must be at least 32 characters long")
	}
}

type JWTClaims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// Middleware to check if OAuth code is present in query
func OAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Query("code")
		if code == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing authorization code"})
			c.Abort()
			return
		}
		c.Next()
	}
}

// Generates both access and refresh JWTs
func GenerateJWT(userID uint, username string, role string) (string, string, error) {
	accessClaims := &JWTClaims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
		},
	}

	refreshClaims := &JWTClaims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)

	accessString, err := accessToken.SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	refreshString, err := refreshToken.SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	return accessString, refreshString, nil
}

// Handles Google OAuth login for admin role
func HandleAdminLogin(c *gin.Context) {
	state := "admin_oauth_state"
	url := googleOAuthConfig.AuthCodeURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// Handles OAuth callback and issues JWT
func HandleAdminCallback(c *gin.Context) {
	if c.Query("state") != "admin_oauth_state" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid state"})
		return
	}

	code := c.Query("code")
	token, err := googleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "token exchange failed"})
		return
	}

	client := googleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "failed to get user info"})
		return
	}
	defer resp.Body.Close()

	var userInfo struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "failed to decode user info"})
		return
	}

	var admin models.Admin
	result := database.DB.Where("email = ?", userInfo.Email).First(&admin)
	if result.Error == gorm.ErrRecordNotFound {
		admin = models.Admin{
			Name:          userInfo.Name,
			Email:         &userInfo.Email,
			OAuthID:       &userInfo.ID,
			OAuthProvider: ptr("google"),
		}
		if err := database.DB.Create(&admin).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create admin"})
			return
		}
	} else if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	accessToken, refreshToken, err := GenerateJWT(admin.ID, *admin.Email, "admin")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Admin login successful",
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"admin":         admin,
	})
}

// ExtractToken extracts JWT from Authorization header or query
func ExtractToken(c *gin.Context) string {
	authHeader := c.GetHeader("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		return authHeader[7:]
	}
	return c.Query("token")
}

// ValidateToken parses JWT and validates role
func ValidateToken(tokenString string, expectedRole string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return nil, errors.New("invalid claims structure")
	}

	if claims.Role != expectedRole {
		return nil, fmt.Errorf("unauthorized role: expected %s, got %s", expectedRole, claims.Role)
	}

	return claims, nil
}

// Utility to get pointer to string
func ptr(s string) *string {
	return &s
}
