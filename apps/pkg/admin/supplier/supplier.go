package supplier

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/supplier/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func AddSupplier(c *gin.Context, db *gorm.DB) {
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can add suppliers"})
		return
	}

	var payload config.SupplierData
	if err := c.ShouldBindJSON(&payload); err != nil {
		logrus.WithError(err).Error("Failed to bind supplier creation payload")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload", "details": err.Error()})
		return
	}

	newSupplier := models.Supplier{
		SupplierName: payload.SupplierName,
	}
	if err := db.Create(&newSupplier).Error; err != nil {
		logrus.WithError(err).Error("Failed to add supplier to database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add supplier"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Supplier added successfully",
		"supplier": newSupplier,
	})
}

func GetAllSuppliers(c *gin.Context, db *gorm.DB) {
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can view suppliers"})
		return
	}

	var suppliers []models.Supplier
	if err := db.Find(&suppliers).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch suppliers from database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suppliers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Suppliers fetched successfully",
		"suppliers": suppliers,
	})
}

func DeleteSupplier(c *gin.Context, db *gorm.DB) {
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete suppliers"})
		return
	}

	id := c.Param("id")
	if err := db.Unscoped().Delete(&models.Supplier{}, id).Error; err != nil {
		logrus.WithError(err).WithField("id", id).Error("Failed to delete supplier")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete supplier"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Supplier deleted successfully",
	})
}
