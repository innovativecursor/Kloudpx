package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/auth"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"
	"gorm.io/gorm"
)

// AdminOAuthLogin handles successful admin OAuth login
func AdminOAuthLogin(c *gin.Context) {
	auth.HandleAdminCallback(c)
}

// UserLogin handles user login with JWT
func UserLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		}
		return
	}

	if user.Password != req.Password { // Replace with hashed comparison in production
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if user.Email == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user email is nil"})
		return
	}

	token, refreshToken, err := auth.GenerateJWT(user.ID, *user.Email, "user")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token":  token,
		"refresh_token": refreshToken,
		"user":          user,
	})
}

// PharmacistLogin handles pharmacist login with JWT
func PharmacistLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var pharmacist models.Pharmacist
	if err := database.DB.Where("email = ?", req.Email).First(&pharmacist).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		}
		return
	}

	if pharmacist.Password == nil || *pharmacist.Password != req.Password { // Replace with hashed comparison in production
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if pharmacist.Email == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "email is nil"})
		return
	}

	token, refreshToken, err := auth.GenerateJWT(pharmacist.ID, *pharmacist.Email, "pharmacist")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token":  token,
		"refresh_token": refreshToken,
		"pharmacist":    pharmacist,
	})
}

// RefreshToken issues a new access token from a valid refresh token
func RefreshToken(c *gin.Context) {
	refreshToken := auth.ExtractToken(c)
	claims, err := auth.ValidateToken(refreshToken, "any")

	//claims, err := auth.ValidateToken(refreshToken)
	if err != nil || claims.Role == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}
	token, _, err := auth.GenerateJWT(claims.UserID, claims.Username, claims.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token generation failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"access_token": token})
}

// Logout clears client-side token (client must delete it)
func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
