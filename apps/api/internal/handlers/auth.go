package handlers

import (
	"context"
	"net/http"
	//"/internal/config"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"github.com/innovativecursor/Kloudpx/internal/auth"
//	"github.com/innovativecursor/Kloudpx/internal/config"
)

// OAuth Configuration
var oauthConf = &oauth2.Config{
	ClientID:      "573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com",
	ClientSecret: "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",
	RedirectURL:   "postmessage",
	Scopes:       []string{"email", "profile"},
	Endpoint:     google.Endpoint,
}

// OAuth Login Handler
func OAuthLoginHandler(c *gin.Context) {
	url := oauthConf.AuthCodeURL("state-token")
	c.Redirect(http.StatusFound, url)
}

// OAuth Callback Handler
func OAuthCallbackHandler(c *gin.Context) {
	code := c.Query("code")
	token, err := oauthConf.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": token.AccessToken, "refresh_token": token.RefreshToken})
}

// Admin OAuth Login Handler
func AdminOAuthLogin(c *gin.Context) {
	tokenString := auth.ExtractToken(c)
	adminInfo, err := auth.GetAdminInfo(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OAuth token"})
		return
	}

	// Type assertion to extract values from map
	adminID, ok := adminInfo["ID"].(float64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid admin ID"})
		return
	}

	name, ok := adminInfo["Name"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid name"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"admin_id": int(adminID), "name": name, "role": "admin"})
}

// Pharmacist OAuth Login Handler
func PharmacistOAuthLogin(c *gin.Context) {
	tokenString := auth.ExtractToken(c)
	pharmacistInfo, err := auth.GetPharmacistInfo(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OAuth token"})
		return
	}

	// Type assertion to extract values from map
	pharmacistID, ok := pharmacistInfo["ID"].(float64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid pharmacist ID"})
		return
	}

	name, ok := pharmacistInfo["Name"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid name"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"pharmacist_id": int(pharmacistID), "name": name, "role": "pharmacist"})
}

// Refresh Token Handler
func RefreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	newAccessToken, err := auth.RefreshJWT(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": newAccessToken})
}

// Logout Handler
func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}