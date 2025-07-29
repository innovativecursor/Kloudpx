package oauth

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/admininformation"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/jwthelper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

var googleOauthConfig = &oauth2.Config{}

func init() {
	googleOauthConfig = &oauth2.Config{
		ClientID:     "573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com",
		ClientSecret: "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",
		RedirectURL:  "http://localhost:3004", // backend redirect URL
		// RedirectURL:  "https://admin.kloudpx.com", // backend redirect URL
		Scopes:   []string{"profile", "email"},
		Endpoint: google.Endpoint,
	}
}

func GoogleCallbackHandler(c *gin.Context, db *gorm.DB) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found in query params"})
		return
	}

	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		fmt.Println("Error exchanging code:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userInfo, err := admininformation.GetUserInfo(token.AccessToken)
	if err != nil {
		fmt.Println("Error getting user info:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Extract values from map
	email, _ := userInfo["email"].(string)
	firstName, _ := userInfo["given_name"].(string)
	lastName, _ := userInfo["family_name"].(string)

	var existingAdmin models.Admin
	if err := db.Where("email = ?", email).First(&existingAdmin).Error; err == nil {
		// User exists, generate JWT directly
		jwtToken, err := jwthelper.GenerateJWTToken(email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT generation failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": jwtToken})
		return
	}
	jwtToken, err := admininformation.AddAdminInfo(c, db, email, firstName, lastName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": jwtToken})
}

// func GoogleCallbackHandler(c *gin.Context, db *gorm.DB) {
// 	code := c.Query("code")
// 	if code == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found in query params"})
// 		return
// 	}

// 	token, err := googleOauthConfig.Exchange(context.Background(), code)
// 	if err != nil {
// 		fmt.Println("Error exchanging code:", err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	userInfo, err := admininformation.GetUserInfo(token.AccessToken)
// 	if err != nil {
// 		fmt.Println("Error getting user info:", err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Extract user info
// 	email, _ := userInfo["email"].(string)
// 	firstName, _ := userInfo["given_name"].(string)
// 	lastName, _ := userInfo["family_name"].(string)

// 	whitelistedEmails := map[string]bool{
// 		"jayson.belandres@gmail.com":   true,
// 		"valeriecoronado754@gmail.com": true,
// 		"jm.cabilleterph@gmail.com":    true,
// 	}

// 	if !whitelistedEmails[email] {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: email not whitelisted"})
// 		return
// 	}

// 	// Check if admin exists
// 	var existingAdmin models.Admin
// 	if err := db.Where("email = ?", email).First(&existingAdmin).Error; err == nil {
// 		// User exists — generate JWT
// 		jwtToken, err := jwthelper.GenerateJWTToken(email)
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT generation failed"})
// 			return
// 		}
// 		c.JSON(http.StatusOK, gin.H{"token": jwtToken})
// 		return
// 	}

// 	// Create admin + generate token
// 	jwtToken, err := admininformation.AddAdminInfo(c, db, email, firstName, lastName)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"token": jwtToken})
// }
