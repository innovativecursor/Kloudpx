package handlers

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
}