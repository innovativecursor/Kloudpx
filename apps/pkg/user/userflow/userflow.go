package userflow

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/userflow/config"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// get all medicine, otc for user publically
func GetMedicinesForUser(c *gin.Context, db *gorm.DB) {
	var medicines []models.Medicine
	if err := db.Preload("Generic").Preload("Supplier").Preload("ItemImages").Preload("Category").Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch medicines from database for user")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Medicines fetched successfully",
		"medicines": medicines,
	})
}

func GetCurrentUserInfo(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		logrus.Warn("Invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":               userObj.ID,
		"first_name":       userObj.FirstName,
		"last_name":        userObj.LastName,
		"email":            userObj.Email,
		"email_verified":   userObj.EmailVerified,
		"application_role": userObj.ApplicationRole,
		"created_at":       userObj.CreatedAt,
	})
}

// add to cart
func AddOTCToCart(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		logrus.Warn("Invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req config.AddCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logrus.WithError(err).Warn("Invalid payload while adding OTC to cart")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	entry := models.Cart{
		UserID:     userObj.ID,
		MedicineID: req.MedicineID,
		Quantity:   req.Quantity,
		IsOTC:      true,
	}

	if err := db.Create(&entry).Error; err != nil {
		logrus.WithError(err).Error("Failed to add OTC item to cart")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to cart"})
		return
	}

	logrus.Info("OTC item added to cart")
	c.JSON(http.StatusOK, gin.H{"message": "OTC item added to cart"})
}

func GetUserCart(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		logrus.Warn("Invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var cart []models.Cart
	if err := db.Preload("Medicine").Preload("Medicine.ItemImages").Where("user_id = ?", userObj.ID).Find(&cart).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch user cart")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart"})
		return
	}

	c.JSON(http.StatusOK, cart)
}

func RemoveItemFromCart(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		logrus.Warn("Invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	itemID := c.Param("id")
	var entry models.Cart

	if err := db.Where("id = ? AND user_id = ?", itemID, userObj.ID).First(&entry).Error; err != nil {
		logrus.Warn("Cart item not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	if err := db.Unscoped().Delete(&entry).Error; err != nil {
		logrus.WithError(err).Error("Failed to permanently delete cart item")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item"})
		return
	}

	logrus.Info("Item permanently removed from cart")
	c.JSON(http.StatusOK, gin.H{"message": "Item permanently removed from cart"})
}
