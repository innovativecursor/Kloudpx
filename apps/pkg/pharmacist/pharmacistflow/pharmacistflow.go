package pharmacistflow

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/itemscalculation"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/pharmacist/pharmacistflow/config"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// get all Prescriptions based on status or username
func GetPrescriptions(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	var prescriptions []models.Prescription
	status := c.Query("status")
	customer := c.Query("customer")

	query := db.Preload("User")

	if status != "" {
		query = query.Where("status = ?", status)
		logrus.Infof("Filtering prescriptions by status: %s", status)
	}

	if customer != "" {
		query = query.Joins("JOIN users ON users.id = prescriptions.user_id").
			Where("users.first_name LIKE ?", "%"+customer+"%")
		logrus.Infof("Filtering prescriptions by customer name: %s", customer)
	}

	if err := query.Find(&prescriptions).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch prescriptions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch prescriptions"})
		return
	}

	c.JSON(http.StatusOK, prescriptions)
}

// get Prescription based on Prescription id
func GetPrescriptionDetails(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	id := c.Param("id")
	var prescription models.Prescription

	if err := db.Preload("User").First(&prescription, id).Error; err != nil {
		logrus.WithField("prescription_id", id).WithError(err).Warn("Prescription not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	c.JSON(http.StatusOK, prescription)
}

// search for medicine related to prescription
func SearchMedicine(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}
	query := c.Query("query")
	var medicines []models.Medicine

	if err := db.Where("brand_name LIKE ?", "%"+query+"%").Find(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search medicines"})
		return
	}
	c.JSON(http.StatusOK, medicines)
}

func AddMedicineToPrescription(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	// Get prescription ID from path param
	prescriptionID := c.Param("id")

	var req config.AddMedicineRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logrus.WithError(err).Warn("Invalid AddMedicineRequest payload")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	// Fetch prescription to get user ID
	var prescription models.Prescription
	if err := db.First(&prescription, prescriptionID).Error; err != nil {
		logrus.WithField("prescription_id", prescriptionID).WithError(err).Warn("Prescription not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	// Fetch medicine to check stock
	var medicine models.Medicine
	if err := db.First(&medicine, req.MedicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
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

	// Parse and get pointer to prescription ID
	id := parseUint(prescriptionID)

	entry := models.Cart{
		PrescriptionID: &id,
		UserID:         prescription.UserID,
		MedicineID:     req.MedicineID,
		Quantity:       req.Quantity,
		IsOTC:          false, // Marked as prescribed
	}

	if err := db.Create(&entry).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add medicine to prescription"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine added to prescription"})
}

// get cart
func GetCart(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	prescriptionID := c.Param("id")
	var cart []models.Cart

	if err := db.
		Preload("Prescription.User").
		Preload("Medicine").
		Preload("Medicine.Generic").
		Preload("Medicine.Supplier").
		Preload("Medicine.Category").
		Preload("Medicine.ItemImages").
		Where("prescription_id = ? AND is_otc = false", prescriptionID). // Only prescribed items
		Find(&cart).Error; err != nil {
		logrus.WithError(err).WithField("prescription_id", prescriptionID).Error("Failed to fetch cart")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart"})
		return
	}

	logrus.WithField("prescription_id", prescriptionID).Infof("Fetched %d prescribed items", len(cart))
	c.JSON(http.StatusOK, cart)
}

func SubmitPrescription(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	id := c.Param("id")

	if err := db.Model(&models.Prescription{}).
		Where("id = ?", id).
		Update("status", "fulfilled").Error; err != nil {
		logrus.WithError(err).WithField("prescription_id", id).Error("Prescription submission failed")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Submission failed"})
		return
	}

	logrus.WithField("prescription_id", id).Info("Prescription marked as fulfilled")
	c.JSON(http.StatusOK, gin.H{"message": "Prescription submitted successfully"})
}
func parseUint(s string) uint {
	id, err := strconv.ParseUint(s, 10, 64)
	if err != nil {
		logrus.WithField("input", s).WithError(err).Warn("Failed to parse uint")
	}
	return uint(id)
}
