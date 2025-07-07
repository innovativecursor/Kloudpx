package userflow

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/itemscalculation"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/userflow/config"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// get all medicine, otc for user publically
func GetMedicinesForUser(c *gin.Context, db *gorm.DB) {
	var uniqueMedicineIDs []uint

	// Subquery: Get the first entry (lowest ID) for each unique brand name
	if err := db.
		Model(&models.Medicine{}).
		Select("MIN(id)").
		Group("brand_name").
		Scan(&uniqueMedicineIDs).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch distinct medicine IDs by brand name")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var medicines []models.Medicine
	if err := db.Preload("Generic").
		Preload("ItemImages").
		Preload("Category").
		Where("id IN ?", uniqueMedicineIDs).
		Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch medicines by ID list")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var imageFilenames []string
		for _, img := range med.ItemImages {
			imageFilenames = append(imageFilenames, img.FileName)
		}

		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}

		response = append(response, config.UserFacingMedicine{
			ID:                   med.ID,
			BrandName:            med.BrandName,
			Power:                med.Power,
			GenericName:          med.Generic.GenericName,
			Category:             med.Category.CategoryName,
			Description:          med.Description,
			Unit:                 med.UnitOfMeasurement,
			MeasurementUnitValue: med.MeasurementUnitValue,
			NumberOfPiecesPerBox: med.NumberOfPiecesPerBox,
			Price:                price,
			TaxType:              med.TaxType,
			Prescription:         med.Prescription,
			Images:               imageFilenames,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Medicines fetched successfully",
		"medicines": response,
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

	var medicine models.Medicine
	if err := db.First(&medicine, req.MedicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	if medicine.Prescription {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Prescription required for this medicine. Please upload a prescription",
		})
		return
	}

	// Check total stock across suppliers
	availableStock, err := itemscalculation.CalculateTotalStockByBrandName(db, medicine.BrandName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate stock"})
		return
	}

	if req.Quantity > availableStock {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":     "Insufficient stock",
			"available": availableStock,
		})
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
	if err := db.
		Preload("Medicine").
		Preload("Medicine.ItemImages").
		Preload("Prescription").
		Preload("Prescription.User").
		Where("user_id = ?", userObj.ID).
		Find(&cart).Error; err != nil {
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

func GetAllCategoriesForUser(c *gin.Context, db *gorm.DB) {
	var categories []models.Category
	if err := db.Preload("CategoryIcon").Find(&categories).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch categories from database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Categories fetched successfully",
		"categories": categories,
	})
}

func GetItemsByCategory(c *gin.Context, db *gorm.DB) {
	categoryIDParam := c.Param("category_id")
	categoryID, err := strconv.Atoi(categoryIDParam)
	if err != nil {
		logrus.WithField("param", categoryIDParam).Warn("Invalid category ID format")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var uniqueMedicineIDs []uint

	// Get the first entry (lowest ID) for each unique brand name in the selected category
	if err := db.
		Model(&models.Medicine{}).
		Select("MIN(id)").
		Where("category_id = ?", categoryID).
		Group("brand_name").
		Scan(&uniqueMedicineIDs).Error; err != nil {
		logrus.WithError(err).Error("Failed to get distinct medicine IDs by category")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var medicines []models.Medicine
	if err := db.Preload("Generic").
		Preload("Supplier").
		Preload("ItemImages").
		Preload("Category").
		Where("id IN ?", uniqueMedicineIDs).
		Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch distinct medicines by category")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var imageFilenames []string
		for _, img := range med.ItemImages {
			imageFilenames = append(imageFilenames, img.FileName)
		}

		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}

		response = append(response, config.UserFacingMedicine{
			ID:                   med.ID,
			BrandName:            med.BrandName,
			Power:                med.Power,
			GenericName:          med.Generic.GenericName,
			Category:             med.Category.CategoryName,
			Description:          med.Description,
			Unit:                 med.UnitOfMeasurement,
			MeasurementUnitValue: med.MeasurementUnitValue,
			NumberOfPiecesPerBox: med.NumberOfPiecesPerBox,
			Price:                price,
			TaxType:              med.TaxType,
			Prescription:         med.Prescription,
			Images:               imageFilenames,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Medicines fetched successfully by category",
		"medicines": response,
	})
}

func GetAllActiveCarouselImages(c *gin.Context, db *gorm.DB) {
	var images []models.CarouselImage

	// Fetch only active images, optionally you can sort by created_at or position
	if err := db.Where("is_active = ?", true).Find(&images).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch carousel images from DB")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch images"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Carousel images fetched successfully",
		"data":    images,
	})
}

func GetAllActiveGalleryImages(c *gin.Context, db *gorm.DB) {
	var images []models.GalleryImage

	if err := db.Where("is_active = ?", true).Find(&images).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch active gallery images"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Active gallery images fetched successfully",
		"data":    images,
	})
}
