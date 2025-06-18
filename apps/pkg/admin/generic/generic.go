package generic

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/generic/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func AddGeneric(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	if userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can add generics"})
		return
	}

	var payload config.GenericData
	if err := c.ShouldBindJSON(&payload); err != nil {
		logrus.WithError(err).Error("Failed to bind generic creation payload")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload", "details": err.Error()})
		return
	}
	newGeneric := models.Generic{
		GenericName: payload.GenericData,
		UpdatedBy:   userObj.ID,
	}
	if err := db.Create(&newGeneric).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add generic", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Generic added successfully",
	})

}

func GetAllGenerics(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can view generics"})
		return
	}

	var generics []models.Generic
	if err := db.Find(&generics).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch generics from database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch generics"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Generics fetched successfully",
		"generics": generics,
	})
}

func DeleteGeneric(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete generics"})
		return
	}

	id := c.Param("id")
	if err := db.Unscoped().Delete(&models.Generic{}, id).Error; err != nil {
		logrus.WithError(err).WithField("id", id).Error("Failed to delete generic")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete generic"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Generic deleted successfully",
	})
}
