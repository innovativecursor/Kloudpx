package useraccount

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

func GetUserPrescriptionHistory(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	today := time.Now().Truncate(24 * time.Hour)

	// Fetch all prescriptions of this user
	var allPrescriptions []models.Prescription
	if err := db.Where("user_id = ?", userObj.ID).Order("created_at DESC").Find(&allPrescriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch prescriptions"})
		return
	}

	var todayList []map[string]interface{}
	var pastList []map[string]interface{}

	for _, pres := range allPrescriptions {
		var carts []models.Cart
		if err := db.Preload("Medicine.Generic").
			Preload("Medicine.Category").
			Preload("Medicine.ItemImages").
			Where("prescription_id = ?", pres.ID).
			Find(&carts).Error; err != nil {
			continue // Skip if cart lookup fails for a prescription
		}

		var medicines []map[string]interface{}
		for _, cart := range carts {
			medicine := cart.Medicine
			var imageURLs []string
			for _, img := range medicine.ItemImages {
				imageURLs = append(imageURLs, img.FileName)
			}

			medicines = append(medicines, map[string]interface{}{
				"brand_name":            medicine.BrandName,
				"power":                 medicine.Power,
				"generic_name":          medicine.Generic.GenericName,
				"category":              medicine.Category.CategoryName,
				"description":           medicine.Description,
				"images":                imageURLs,
				"quantity":              cart.Quantity,
				"prescription_required": medicine.Prescription,
			})
		}

		entry := map[string]interface{}{
			"id":         pres.ID,
			"image":      pres.UploadedImage,
			"status":     pres.Status,
			"created_at": pres.CreatedAt,
			"medicines":  medicines,
		}

		if pres.CreatedAt.Truncate(24 * time.Hour).Equal(today) {
			todayList = append(todayList, entry)
		} else {
			pastList = append(pastList, entry)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"todays_prescriptions": todayList,
		"past_prescriptions":   pastList,
	})
}
