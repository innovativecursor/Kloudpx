package oauth

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/admininformation"
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
		Scopes:       []string{"profile", "email"},
		Endpoint:     google.Endpoint,
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

	jwtToken, err := admininformation.AddAdminInfo(c, db, email, firstName, lastName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": jwtToken})
}
