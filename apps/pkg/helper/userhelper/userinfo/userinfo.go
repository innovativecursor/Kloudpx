package userinfo

import (
	"fmt"
	"log"
	"math/rand"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/jwthelper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

func AddUserInfo(c *gin.Context, db *gorm.DB, email, firstName, lastName string) (string, error) {
	user := models.User{
		Email:           email,
		FirstName:       firstName,
		LastName:        lastName,
		EmailVerified:   true,
		ApplicationRole: "user",
	}

	// Save admin to DB
	if err := db.Create(&user).Error; err != nil {
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

func GenerateOrderNumber() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%08d", rand.Intn(1e8))
}

type RegionInfo struct {
	Name              string
	DeliveryTime      string
	FreeShippingLimit float64
	StandardRate      int
}

func GetRegionInfo(db *gorm.DB, zipCode string) models.RegionSetting {
	zip, _ := strconv.Atoi(zipCode)
	var region models.RegionSetting

	// Find matching range
	if err := db.Where("? BETWEEN zip_start AND zip_end", zip).First(&region).Error; err != nil {
		// Default fallback if no region found
		return models.RegionSetting{
			RegionName:        "Unknown",
			DeliveryTime:      "Unknown",
			FreeShippingLimit: 1000000,
			StandardRate:      100,
		}
	}

	return region
}
