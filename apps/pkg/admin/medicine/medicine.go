package medicine

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/medicine/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func generateItemCode() string {
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	random := rand.Intn(1000)
	return fmt.Sprintf("ITEM-%d-%03d", timestamp, random)
}

func AddMedicine(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	if userObj.ApplicationRole != "admin" {
		logrus.WithField("user_id", userObj.ID).Warn("Unauthorized access: non-admin tried to add medicine")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can add medicine"})
		return
	}

	var payload config.MedicineData
	if err := c.ShouldBindJSON(&payload); err != nil {
		logrus.WithError(err).Error("Failed to bind medicine creation payload")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload", "details": err.Error()})
		return
	}

	// Validation
	if payload.UnitOfMeasurement == "per piece" && payload.NumberOfPiecesPerBox != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "NumberOfPiecesPerBox must be 0 when unit is 'per piece'"})
		return
	}

	itemCode := payload.ItemCode
	if itemCode == "" {
		itemCode = generateItemCode()
	}
	newMedicine := models.Medicine{
		ItemCode:                  itemCode,
		BrandName:                 payload.BrandName,
		IsBrand:                   payload.IsBrand,
		InhouseBrand:              payload.InhouseBrand,
		Discount:                  payload.Discount,
		Power:                     payload.Power,
		GenericID:                 payload.GenericID,
		SupplierID:                payload.SupplierID,
		CategoryID:                payload.CategoryID,
		CategorySubClass:          payload.CategorySubClass,
		DosageForm:                payload.DosageForm,
		Packaging:                 payload.Packaging,
		Marketer:                  payload.Marketer,
		SupplierDiscount:          payload.SupplierDiscount,
		Description:               payload.Description,
		UnitOfMeasurement:         payload.UnitOfMeasurement,
		MeasurementUnitValue:      payload.MeasurementUnitValue,
		NumberOfPiecesPerBox:      0,
		SellingPricePerBox:        payload.SellingPricePerBox,
		SellingPricePerPiece:      payload.SellingPricePerPiece,
		CostPricePerBox:           payload.CostPricePerBox,
		CostPricePerPiece:         payload.CostPricePerPiece,
		TaxType:                   payload.TaxType,
		MinimumThreshold:          payload.MinimumThreshold,
		MaximumThreshold:          payload.MaximumThreshold,
		EstimatedLeadTimeDays:     payload.EstimatedLeadTimeDays,
		Prescription:              payload.Prescription,
		IsFeature:                 payload.IsFeature,
		UpdatedBy:                 userObj.ID,
		Benefits:                  payload.Benefits,
		KeyIngredients:            payload.KeyIngredients,
		RecommendedDailyAllowance: payload.RecommendedDailyAllowance,
		DirectionsForUse:          payload.DirectionsForUse,
		SafetyInformation:         payload.SafetyInformation,
		Storage:                   payload.Storage,
	}

	if payload.UnitOfMeasurement == "per box" {
		newMedicine.NumberOfPiecesPerBox = payload.NumberOfPiecesPerBox
	}

	if err := db.Create(&newMedicine).Error; err != nil {
		logrus.WithError(err).Error("Failed to add medicine to database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add medicine"})
		return
	}

	// Associate uploaded images
	for _, imgID := range payload.ImageIDs {
		if err := db.Model(&models.ItemImage{}).
			Where("id = ?", imgID).
			Update("medicine_id", newMedicine.ID).Error; err != nil {
			logrus.WithError(err).Warnf("Failed to associate image ID %d", imgID)
		}
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Medicine added successfully",
	})
}

func GetAllMedicines(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	if userObj.ApplicationRole != "admin" {
		logrus.WithField("user_id", userObj.ID).Warn("Unauthorized access: non-admin tried to view medicines")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can view medicines"})
		return
	}

	var medicines []models.Medicine
	if err := db.Preload("Generic").Preload("Supplier").Preload("ItemImages").Preload("Category").Preload("Category.CategoryIcon").Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch medicines from database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Medicines fetched successfully",
		"medicines": medicines,
	})
}

func UpdateMedicine(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	if userObj.ApplicationRole != "admin" {
		logrus.WithField("user_id", userObj.ID).Warn("Unauthorized access: non-admin tried to update medicine")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can update medicine"})
		return
	}

	idParam := c.Param("id")
	medicineID, err := strconv.Atoi(idParam)
	if err != nil {
		logrus.WithField("param", idParam).Warn("Invalid medicine ID format")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.Medicine
	if err := db.Preload("ItemImages").First(&medicine, medicineID).Error; err != nil {
		logrus.WithError(err).WithField("id", medicineID).Error("Medicine not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	var payload config.UpdateMedicineData
	if err := c.ShouldBindJSON(&payload); err != nil {
		logrus.WithError(err).Error("Failed to bind update payload")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload", "details": err.Error()})
		return
	}

	// Validation
	if payload.UnitOfMeasurement == "per piece" && payload.NumberOfPiecesPerBox != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "NumberOfPiecesPerBox must be 0 when unit is 'per piece'"})
		return
	}

	// Update fields
	medicine.BrandName = payload.BrandName
	medicine.IsBrand = payload.IsBrand
	medicine.InhouseBrand = payload.InhouseBrand
	medicine.Discount = payload.Discount
	medicine.Power = payload.Power
	medicine.GenericID = payload.GenericID
	medicine.SupplierID = payload.SupplierID
	medicine.CategoryID = payload.CategoryID
	medicine.CategorySubClass = payload.CategorySubClass
	medicine.DosageForm = payload.DosageForm
	medicine.Packaging = payload.Packaging
	medicine.Marketer = payload.Marketer
	medicine.SupplierDiscount = payload.SupplierDiscount
	medicine.Description = payload.Description
	medicine.UnitOfMeasurement = payload.UnitOfMeasurement
	medicine.MeasurementUnitValue = payload.MeasurementUnitValue
	medicine.SellingPricePerBox = payload.SellingPricePerBox
	medicine.SellingPricePerPiece = payload.SellingPricePerPiece
	medicine.CostPricePerBox = payload.CostPricePerBox
	medicine.CostPricePerPiece = payload.CostPricePerPiece
	medicine.TaxType = payload.TaxType
	medicine.MinimumThreshold = payload.MinimumThreshold
	medicine.MaximumThreshold = payload.MaximumThreshold
	medicine.EstimatedLeadTimeDays = payload.EstimatedLeadTimeDays
	medicine.Prescription = payload.Prescription
	medicine.IsFeature = payload.IsFeature
	medicine.UpdatedBy = userObj.ID
	medicine.Benefits = payload.Benefits
	medicine.KeyIngredients = payload.KeyIngredients
	medicine.RecommendedDailyAllowance = payload.RecommendedDailyAllowance
	medicine.DirectionsForUse = payload.DirectionsForUse
	medicine.SafetyInformation = payload.SafetyInformation
	medicine.Storage = payload.Storage

	if payload.UnitOfMeasurement == "per box" {
		medicine.NumberOfPiecesPerBox = payload.NumberOfPiecesPerBox
	} else {
		medicine.NumberOfPiecesPerBox = 0
	}

	// Update images if provided
	if len(payload.ImageIDs) > 0 {
		if err := db.Model(&models.ItemImage{}).
			Where("id IN ?", payload.ImageIDs).
			Update("medicine_id", medicine.ID).Error; err != nil {
			logrus.WithError(err).Error("Failed to associate images with medicine")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update images"})
			return
		}
	}

	if err := db.Save(&medicine).Error; err != nil {
		logrus.WithError(err).Error("Failed to update medicine")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update medicine"})
		return
	}

	// Update category icon if provided
	if payload.CategoryIconID != 0 {
		var category models.Category
		if err := db.First(&category, medicine.CategoryID).Error; err != nil {
			logrus.WithError(err).WithField("category_id", medicine.CategoryID).Error("Failed to find category")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find related category"})
			return
		}

		category.CategoryIconID = &payload.CategoryIconID
		if err := db.Save(&category).Error; err != nil {
			logrus.WithError(err).Error("Failed to update category icon")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category icon"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Medicine updated successfully",
	})
}

func DeleteMedicine(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	if userObj.ApplicationRole != "admin" {
		logrus.WithField("user_id", userObj.ID).Warn("Unauthorized access: non-admin tried to delete medicine")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete medicine"})
		return
	}

	// Extract and validate medicine ID
	idParam := c.Param("id")
	medicineID, err := strconv.Atoi(idParam)
	if err != nil {
		logrus.WithField("param", idParam).Warn("Invalid medicine ID format")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	// Delete associated item images first
	if err := db.Unscoped().Where("medicine_id = ?", medicineID).Delete(&models.ItemImage{}).Error; err != nil {
		logrus.WithError(err).WithField("id", medicineID).Error("Failed to delete associated item images")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete associated item images"})
		return
	}
	// Perform soft delete (or hard delete using Unscoped)
	if err := db.Unscoped().Delete(&models.Medicine{}, medicineID).Error; err != nil {
		logrus.WithError(err).WithField("id", medicineID).Error("Failed to delete medicine")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete medicine"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Medicine deleted successfully",
	})
}

func DeleteAllMedicines(c *gin.Context, db *gorm.DB) {
	// Check if user exists in context
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Assert user type
	userObj, ok := user.(*models.Admin)
	if !ok {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// Check admin role
	if userObj.ApplicationRole != "admin" {
		logrus.WithField("user_id", userObj.ID).Warn("Unauthorized access: non-admin tried to delete all medicines")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete medicines"})
		return
	}

	// Delete all associated item images first
	if err := db.Unscoped().Where("1 = 1").Delete(&models.ItemImage{}).Error; err != nil {
		logrus.WithError(err).Error("Failed to delete all associated item images")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete associated item images"})
		return
	}

	// Delete all medicines (hard delete)
	if err := db.Unscoped().Where("1 = 1").Delete(&models.Medicine{}).Error; err != nil {
		logrus.WithError(err).Error("Failed to delete all medicines")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete medicines"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "All medicines and associated item images deleted successfully",
	})
}

func SearchMedicinesForAdmin(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid or unauthorized user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can search medicines"})
		return
	}

	// Get query string
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	// Fetch matching medicines
	var medicines []models.Medicine
	if err := db.Preload("Generic").
		Preload("Category").
		Preload("Category.CategoryIcon").
		Preload("Supplier").
		Preload("ItemImages").
		Joins("LEFT JOIN categories ON categories.id = medicines.category_id").
		Joins("LEFT JOIN generics ON generics.id = medicines.generic_id").
		Where("medicines.brand_name LIKE ? OR categories.category_name LIKE ? OR generics.generic_name LIKE ?",
			"%"+query+"%", "%"+query+"%", "%"+query+"%").
		Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to search medicines")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search medicines"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Search results",
		"medicines": medicines,
	})
}
