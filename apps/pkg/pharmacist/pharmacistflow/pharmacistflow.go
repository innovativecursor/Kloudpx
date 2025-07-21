package pharmacistflow

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func GetUsersWithPrescriptionSummary(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok || userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	type Response struct {
		UserID              uint   `json:"userid"`
		Name                string `json:"name"`
		Email               string `json:"email"`
		PrescriptionStatus  string `json:"prescriptionstatus"`
		PastPrescription    int64  `json:"pastprescription"`
		PendingPrescription int64  `json:"pendingprescription"`
	}

	var result []Response

	db.Raw(`
		SELECT u.id as user_id, 
			   CONCAT(u.first_name, ' ', u.last_name) as name,
			   u.email,
			   MAX(p.status) as prescription_status,
			   SUM(CASE WHEN p.status = 'fulfilled' THEN 1 ELSE 0 END) as past_prescription,
			   SUM(CASE WHEN p.status = 'unsettled' THEN 1 ELSE 0 END) as pending_prescription
		FROM prescriptions p
		JOIN users u ON p.user_id = u.id
		GROUP BY u.id, u.first_name, u.last_name, u.email
	`).Scan(&result)

	c.JSON(http.StatusOK, result)
}

func GetUserPrescriptionHistory(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok || userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	userID := c.Param("user_id")

	var past []models.Prescription
	db.Preload("User").Where("user_id = ? AND status = ?", userID, "fulfilled").Find(&past)

	var unsettled []models.Prescription
	db.Preload("User").Where("user_id = ? AND status = ?", userID, "unsettled").Find(&unsettled)

	c.JSON(http.StatusOK, gin.H{
		"past":      past,
		"unsettled": unsettled,
	})
}

func GetPrescriptionCart(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok || userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	prescriptionID := c.Param("id")

	var cartItems []models.Cart
	if err := db.
		Preload("Medicine").
		Preload("Medicine.ItemImages").
		Preload("Medicine.Generic").
		Preload("Medicine.Supplier").
		Preload("Medicine.Category").
		Preload("Medicine.Category.CategoryIcon").
		Where("prescription_id = ?", prescriptionID).
		Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart items"})
		return
	}

	c.JSON(http.StatusOK, cartItems)
}

// approve
func SubmitPrescription(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok || userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	id := c.Param("id")

	if err := db.Model(&models.Prescription{}).
		Where("id = ?", id).
		Update("status", "fulfilled").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Prescription submission failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Prescription submitted successfully"})
}

// reject
func RejectPrescription(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok || userObj.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied: Pharmacist only"})
		return
	}

	id := c.Param("id")

	var prescription models.Prescription
	if err := db.First(&prescription, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	if err := db.Model(&models.Prescription{}).
		Where("id = ?", id).
		Update("status", "rejected").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject prescription"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Prescription rejected successfully"})
}

// pharmacist info
func GetCurrentPharmacistInfo(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Pharmacist)
	if !ok {
		logrus.Warn("Invalid pharmacist object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid pharmacist object"})
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
