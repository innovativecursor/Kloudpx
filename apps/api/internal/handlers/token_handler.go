package handlers

import (
	//"database/sql"
	"net/http"
	"time"
	"log"
	"os"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// RefreshToken handles token refresh
func RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Refresh token required"})
		return
	}

	var userID int
	var expiresAt time.Time
	err = database.DB.QueryRow(
		"SELECT user_id, expires_at FROM refresh_tokens WHERE token = $1",
		refreshToken,
	).Scan(&userID, &expiresAt)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	if time.Now().After(expiresAt) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token expired"})
		return
	}

	var username, role string
	err = database.DB.QueryRow(
		"SELECT username, CASE WHEN EXISTS (SELECT 1 FROM admins WHERE id = $1) THEN 'admin' WHEN EXISTS (SELECT 1 FROM pharmacists WHERE id = $1) THEN 'pharmacist' ELSE 'user' END FROM users WHERE id = $1",
		userID,
	).Scan(&username, &role)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}

	accessToken, err := auth.GenerateAccessToken(userID, username, role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	newRefreshToken, newExpiresAt, err := auth.GenerateRefreshToken(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	// Delete old refresh token
	_, err = database.DB.Exec("DELETE FROM refresh_tokens WHERE token = $1", refreshToken)
	if err != nil {
		log.Println("Failed to delete old refresh token:", err)
	}

	// Set new refresh token in cookie
	auth.SetRefreshTokenCookie(c, newRefreshToken, newExpiresAt)

	c.JSON(http.StatusOK, models.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
	})
}

// Logout handles user logout
func Logout(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err == nil {
		_, err = database.DB.Exec("DELETE FROM refresh_tokens WHERE token = $1", refreshToken)
		if err != nil {
			log.Println("Failed to delete refresh token:", err)
		}
	}

	// Clear the refresh token cookie
	c.SetCookie("refresh_token", "", -1, "/", os.Getenv("COOKIE_DOMAIN"), os.Getenv("SECURE_COOKIE") == "true", true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

/*package handlers

import (
	"database/sql"
	"net/http"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"
	"time"
	"os"
	"github.com/gin-gonic/gin"
)

// RefreshToken handles token refresh requests
func RefreshToken(c *gin.Context) {
	// Get refresh token from cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Refresh token required"})
		return
	}

	// Validate refresh token
	var token models.RefreshToken
	err = database.DB.QueryRow(
		"SELECT id, user_id, expires_at FROM refresh_tokens WHERE token = $1",
		refreshToken,
	).Scan(&token.ID, &token.UserID, &token.ExpiresAt)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Check if token is expired
	if time.Now().After(token.ExpiresAt) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token expired"})
		return
	}

	// Get user information
	var user models.User
	err = database.DB.QueryRow(
		"SELECT id, username, COALESCE(oauth_provider, '') FROM users WHERE id = $1",
		token.UserID,
	).Scan(&user.ID, &user.Username, &user.OAuthProvider)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	// Determine user role (simplified - in real app, store role in users table)
	role := "user"
	if user.OAuthProvider.String != "" {
		role = "oauth_user"
	}

	// Generate new tokens
	newAccessToken, err := auth.GenerateAccessToken(user.ID, user.Username, role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	newRefreshToken, expiresAt, err := auth.GenerateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	// Update refresh token in database
	_, err = database.DB.Exec(
		"UPDATE refresh_tokens SET token = $1, expires_at = $2 WHERE id = $3",
		newRefreshToken, expiresAt, token.ID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update refresh token"})
		return
	}

	// Set refresh token in HTTP-only cookie
	secure := os.Getenv("SECURE_COOKIE") == "true"
	c.SetCookie("refresh_token", newRefreshToken, int(time.Until(expiresAt).Seconds()), "/", 
		os.Getenv("COOKIE_DOMAIN"), secure, true)

	c.JSON(http.StatusOK, models.TokenPair{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
	})
}

// Logout handles user logout
func Logout(c *gin.Context) {
	// Get refresh token from cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not authenticated"})
		return
	}

	// Delete refresh token from database
	_, err = database.DB.Exec("DELETE FROM refresh_tokens WHERE token = $1", refreshToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to logout"})
		return
	}

	// Clear refresh token cookie
	c.SetCookie("refresh_token", "", -1, "/", os.Getenv("COOKIE_DOMAIN"), 
		os.Getenv("SECURE_COOKIE") == "true", true)

	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}*/