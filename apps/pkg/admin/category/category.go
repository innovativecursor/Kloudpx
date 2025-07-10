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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload", "details": err.Error()})
		return
	}

	var existing models.Category
	err := db.Preload("CategoryIcon").Where("category_name = ?", payload.Category).First(&existing).Error
	if err == nil {
		c.JSON(http.StatusOK, gin.H{
			"message":  "Category already exists",
			"category": existing,
		})
		return
	}

	newCategory := models.Category{
		CategoryName: payload.Category,
	}
	if err := db.Create(&newCategory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Category created successfully",
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
func AssignIconToCategory(c *gin.Context, db *gorm.DB) {
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
	var payload config.AssignIcon
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	var category models.Category
	if err := db.First(&category, payload.CategoryID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	// Check if already assigned
	if category.CategoryIconID != nil && *category.CategoryIconID == payload.IconID {
		c.JSON(http.StatusOK, gin.H{
			"message":  "Category already has this icon",
			"category": category,
		})
		return
	}

	// Assign icon
	category.CategoryIconID = &payload.IconID
	if err := db.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assign icon to category"})
		return
	}

	// Return updated category with icon
	if err := db.Preload("CategoryIcon").First(&category, category.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Icon assigned successfully",
		"category": category,
	})
}
