package pharmacistinformation

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/jwthelper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

func AddPharmacistInfo(c *gin.Context, db *gorm.DB, email, firstName, lastName string) (string, error) {
	pharmacist := models.Pharmacist{
		Email:           email,
		FirstName:       firstName,
		LastName:        lastName,
		EmailVerified:   true,
		ApplicationRole: "Pharmacist",
	}

	// Save admin to DB
	if err := db.Create(&pharmacist).Error; err != nil {
		return "", err
	}

	// Generate JWT token
	jwtToken, err := jwthelper.GenerateJWTToken(email)
	if err != nil {
		log.Printf("Failed to generate JWT token: %s\n", err)
		return "", err
	}

	return jwtToken, nil
}
