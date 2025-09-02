package regionsettings

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/regionsettings/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func UpsertRegionSetting(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req config.RegionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.RegionSetting
	err := db.Where("region_name = ?", req.RegionName).First(&existing).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot create new regions, only edit existing"})
		return
	}

	// Update only
	existing.ZipStart = req.ZipStart
	existing.ZipEnd = req.ZipEnd
	existing.DeliveryTime = req.DeliveryTime
	existing.FreeShippingLimit = req.FreeShippingLimit
	existing.StandardRate = req.StandardRate
	if err := db.Save(&existing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update region"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Region updated successfully"})
}

func GetAllRegionSettings(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.Admin)
	if !ok {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var regions []models.RegionSetting
	if err := db.Order("zip_start ASC").Find(&regions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch regions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"regions": regions,
	})
}
