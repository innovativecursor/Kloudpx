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
		PastPrescription    int64  `json:"pastprescription"`
		PendingPrescription int64  `json:"pendingprescription"`
	}

	var result []Response

	db.Raw(`
		SELECT 
			u.id AS user_id, 
			CONCAT(u.first_name, ' ', u.last_name) AS name,
			u.email,
			SUM(CASE 
					WHEN p.status IN ('fulfilled', 'rejected') 
					THEN 1 
					ELSE 0 
				END) AS past_prescription,
			SUM(CASE 
					WHEN p.status = 'unsettled'
					  AND EXISTS (
						  SELECT 1 FROM cart_histories c 
						  WHERE c.prescription_id = p.id 
						    AND c.medicine_status = 'unsettled'
					  )
					THEN 1 
					ELSE 0 
				END) AS pending_prescription
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
	db.Preload("User").
		Where("user_id = ? AND status IN ?", userID, []string{"fulfilled", "rejected"}).
		Find(&past)

	var unsettled []models.Prescription
	db.Preload("User").
		Joins("JOIN cart_histories ch ON ch.prescription_id = prescriptions.id").
		Where("prescriptions.user_id = ? AND ch.medicine_status = ?", userID, "unsettled").
		Group("prescriptions.id").
		Find(&unsettled)

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

	var cartItems []models.CartHistory
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
func ApproveMedicineInPrescription(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	pharmacist, ok := user.(*models.Pharmacist)
	if !ok || pharmacist.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}

	cartID := c.Param("cart_id")

	var cart models.CartHistory
	if err := db.First(&cart, cartID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	if cart.MedicineStatus != "unsettled" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Already processed"})
		return
	}

	// Approve medicine
	if err := db.Model(&cart).Update("medicine_status", "approved").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve medicine"})
		return
	}

	// Check if all cart items under this prescription are settled
	checkAndUpdatePrescriptionStatus(db, *cart.PrescriptionID)

	c.JSON(http.StatusOK, gin.H{"message": "Medicine approved"})
}

// reject
func RejectMedicineInPrescription(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	pharmacist, ok := user.(*models.Pharmacist)
	if !ok || pharmacist.ApplicationRole != "Pharmacist" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}

	cartID := c.Param("cart_id")

	var cart models.CartHistory
	if err := db.First(&cart, cartID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	if cart.MedicineStatus != "unsettled" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Already processed"})
		return
	}

	// Reject medicine
	if err := db.Model(&cart).Update("medicine_status", "rejected").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject medicine"})
		return
	}

	// Check if all cart items under this prescription are settled
	checkAndUpdatePrescriptionStatus(db, *cart.PrescriptionID)

	c.JSON(http.StatusOK, gin.H{"message": "Medicine rejected"})
}

func checkAndUpdatePrescriptionStatus(db *gorm.DB, prescriptionID uint) {
	var unsettledCount int64
	db.Model(&models.CartHistory{}).
		Where("prescription_id = ? AND medicine_status = ?", prescriptionID, "unsettled").
		Count(&unsettledCount)

	if unsettledCount == 0 {
		// All medicines settled, so mark prescription as fulfilled (or you can do custom logic here)
		db.Model(&models.Prescription{}).
			Where("id = ?", prescriptionID).
			Update("status", "fulfilled")
	}
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
