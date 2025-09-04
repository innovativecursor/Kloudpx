package oauthpharma

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/admininformation"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/jwthelper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/pharmacisthelper/pharmacistinformation"
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
		// RedirectURL:  "http://localhost:5173", // backend redirect URL
		RedirectURL:  "https://pharmacist.kloudpx.com", // backend redirect URL
		Scopes:       []string{"profile", "email"},
		Endpoint:     google.Endpoint,
	}
}

func GooglePharmacistCallbackHandler(c *gin.Context, db *gorm.DB) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found"})
		return
	}

	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userInfo, err := admininformation.GetUserInfo(token.AccessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	email, _ := userInfo["email"].(string)
	firstName, _ := userInfo["given_name"].(string)
	lastName, _ := userInfo["family_name"].(string)

	// Check if pharmacist already exists
	var existingPharmacist models.Pharmacist
	if err := db.Where("email = ?", email).First(&existingPharmacist).Error; err == nil {
		jwtToken, err := jwthelper.GenerateJWTToken(email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT generation failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": jwtToken})
		return
	}

	// New pharmacist
	jwtToken, err := pharmacistinformation.AddPharmacistInfo(c, db, email, firstName, lastName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": jwtToken})
}
