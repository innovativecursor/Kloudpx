package handlers

import (
	//"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/auth"
)

// AdminOAuthLogin handles admin OAuth login
/*func AdminOAuthLogin(c *gin.Context) {
	// In a real implementation, you would verify admin credentials
	// For this example, we'll simulate a successful login
	userID := 1 // This would come from your auth system
	username := "admin_user"

	if err := auth.LoginWithTokens(userID, username, "admin", c); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}
}
*/
// PharmacistOAuthLogin handles pharmacist OAuth login
func PharmacistOAuthLogin(c *gin.Context) {
	// In a real implementation, you would verify pharmacist credentials
	// For this example, we'll simulate a successful login
	userID := 2 // This would come from your auth system
	username := "pharmacist_user"

	if err := auth.LoginWithTokens(userID, username, "pharmacist", c); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}
}

/*package handlers

import (
	"net/http"
	"github.com/hashmi846003/online-med.git/internal/auth"

	"github.com/gin-gonic/gin"
)

func OAuthLogin(c *gin.Context) {
	var credentials struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify token with provider
	userInfo, err := auth.GetUserInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Find or create user
	user, err := auth.FindOrCreateOAuthUser(userInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User processing failed"})
		return
	}

	// Generate JWT
	token, err := auth.GenerateJWT(user.ID, user.Username, "user")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}*/
/*package handlers

import (
	"net/http"
	"github.com/hashmi846003/online-med.git/internal/auth"

	"github.com/gin-gonic/gin"
)

func OAuthLogin(c *gin.Context) {
	var credentials struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify token with provider
	userInfo, err := auth.GetUserInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Find or create user
	user, err := auth.FindOrCreateOAuthUser(userInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User processing failed"})
		return
	}

	// Generate JWT - FIXED: Changed from GenerateJWT to GenerateAccessToken
	token, err := auth.GenerateAccessToken(user.ID, user.Username, "user")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}*/