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
package handlers

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
}