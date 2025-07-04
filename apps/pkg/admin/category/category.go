package category

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/category/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func AddCategory(c *gin.Context, db *gorm.DB) {
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can add categories"})
		return
	}

	var payload config.CategoryData
	if err := c.ShouldBindJSON(&payload); err != nil {
		logrus.WithError(err).Error("Failed to bind category creation payload")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload", "details": err.Error()})
		return
	}

	newCategory := models.Category{
		CategoryName:   payload.Category,
		CategoryIconID: payload.IconID,
	}
	if err := db.Create(&newCategory).Error; err != nil {
		logrus.WithError(err).Error("Failed to add category to database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add category"})
		return
	}

	// Reload the category with CategoryIcon populated
	if err := db.Preload("CategoryIcon").First(&newCategory, newCategory.ID).Error; err != nil {
		logrus.WithError(err).Error("Failed to preload category icon")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load category icon"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Category added successfully",
		"category": newCategory,
	})
}

func GetAllCategories(c *gin.Context, db *gorm.DB) {
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can view categories"})
		return
	}

	var categories []models.Category
	if err := db.Find(&categories).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch categories from database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Categories fetched successfully",
		"categories": categories,
	})
}

func DeleteCategory(c *gin.Context, db *gorm.DB) {
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete categories"})
		return
	}

	id := c.Param("id")
	if err := db.Unscoped().Delete(&models.Category{}, id).Error; err != nil {
		logrus.WithError(err).WithField("id", id).Error("Failed to delete category")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Category deleted successfully",
	})
}

// category icons
func AddCategoryIcon(c *gin.Context, db *gorm.DB) {
	var payload config.CategoryIconRequest
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	icon := models.CategoryIcon{
		Icon: payload.Icon,
	}
	if err := db.Create(&icon).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save icon"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Category icon added",
		"icon":    icon,
	})
}

func GetAllCategoryIcons(c *gin.Context, db *gorm.DB) {
	var icons []models.CategoryIcon
	if err := db.Find(&icons).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch icons"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Category icons fetched successfully",
		"icons":   icons,
	})
}
