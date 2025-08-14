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
		Email:           &email,
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

func GetRegionInfo(zipCode string) RegionInfo {
	zip, _ := strconv.Atoi(zipCode)
	switch {
	case zip >= 1000 && zip <= 1749:
		return RegionInfo{"NCR", "2-3 days", 800, 85}
	case zip >= 2000 && zip <= 5200:
		return RegionInfo{"Luzon", "3-5 days", 1200, 95}
	case zip >= 5000 && zip <= 6700:
		return RegionInfo{"Visayas", "3-7 days", 1600, 100}
	case zip >= 7000 && zip <= 9800:
		return RegionInfo{"Mindanao", "3-7 days", 2000, 105}
	default:
		return RegionInfo{"Unknown", "Unknown", 1000000, 100}
	}
}
