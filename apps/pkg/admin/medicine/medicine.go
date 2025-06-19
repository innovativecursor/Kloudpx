package medicine

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/medicine/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

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

	newMedicine := models.Medicine{
		BrandName:             payload.BrandName,
		GenericID:             payload.GenericID,
		SupplierID:            payload.SupplierID,
		SupplierDiscount:      payload.SupplierDiscount,
		Description:           payload.Description,
		UnitOfMeasurement:     payload.UnitOfMeasurement,
		MeasurementUnitValue:  0, // Default, will override if "per box"
		NumberOfPiecesPerBox:  payload.NumberOfPiecesPerBox,
		SellingPricePerBox:    payload.SellingPricePerBox,
		SellingPricePerPiece:  payload.SellingPricePerPiece,
		CostPricePerBox:       payload.CostPricePerBox,
		CostPricePerPiece:     payload.CostPricePerPiece,
		Category:              payload.Category,
		TaxType:               payload.TaxType,
		MinimumThreshold:      payload.MinimumThreshold,
		MaximumThreshold:      payload.MaximumThreshold,
		EstimatedLeadTimeDays: payload.EstimatedLeadTimeDays,
		Prescription:          payload.Prescription,
		UpdatedBy:             userObj.ID,
	}

	if payload.UnitOfMeasurement == "per box" {
		newMedicine.MeasurementUnitValue = payload.MeasurementUnitValue
	}

	if err := db.Create(&newMedicine).Error; err != nil {
		logrus.WithError(err).Error("Failed to add medicine to database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add medicine"})
		return
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
	if err := db.Preload("Generic").Preload("Supplier").Find(&medicines).Error; err != nil {
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
	if err := db.First(&medicine, medicineID).Error; err != nil {
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

	medicine.BrandName = payload.BrandName
	medicine.GenericID = payload.GenericID
	medicine.SupplierID = payload.SupplierID
	medicine.SupplierDiscount = payload.SupplierDiscount
	medicine.Description = payload.Description
	medicine.UnitOfMeasurement = payload.UnitOfMeasurement

	if payload.UnitOfMeasurement == "per box" {
		medicine.MeasurementUnitValue = payload.MeasurementUnitValue
	} else {
		medicine.MeasurementUnitValue = 0
	}

	medicine.NumberOfPiecesPerBox = payload.NumberOfPiecesPerBox
	medicine.SellingPricePerBox = payload.SellingPricePerBox
	medicine.SellingPricePerPiece = payload.SellingPricePerPiece
	medicine.CostPricePerBox = payload.CostPricePerBox
	medicine.CostPricePerPiece = payload.CostPricePerPiece
	medicine.Category = payload.Category
	medicine.TaxType = payload.TaxType
	medicine.MinimumThreshold = payload.MinimumThreshold
	medicine.MaximumThreshold = payload.MaximumThreshold
	medicine.EstimatedLeadTimeDays = payload.EstimatedLeadTimeDays
	medicine.Prescription = payload.Prescription
	medicine.UpdatedBy = userObj.ID

	if err := db.Save(&medicine).Error; err != nil {
		logrus.WithError(err).Error("Failed to update medicine")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update medicine"})
		return
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
