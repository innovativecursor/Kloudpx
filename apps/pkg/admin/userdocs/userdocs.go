package userdocs

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/userdocs/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

// VerifyUserPwdCertificate allows an admin to approve or reject a user document.
func VerifyUserPwdCertificate(c *gin.Context, db *gorm.DB) {
	// Extract user from context (must be admin)
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

	var payload config.VerifyPwdPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// Fetch document
	var pwd models.PwdCard
	if err := db.First(&pwd, payload.PwdID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		}
		return
	}

	// Update document status
	pwd.Status = payload.Status
	pwd.VerifiedBy = &userObj.ID
	pwd.VerifiedAt = time.Now()

	if err := db.Save(&pwd).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "PWD status updated",
		"pwd_id":      pwd.ID,
		"status":      pwd.Status,
		"verified_by": userObj.ID,
		"verified_at": pwd.VerifiedAt,
	})
}

// Fetching pwd certificate by pwd id.
func GetPwdCertificateByID(c *gin.Context, db *gorm.DB) {
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

	id := c.Param("id")
	var pwd models.PwdCard
	if err := db.First(&pwd, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Pwd certificate not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"pwd": pwd})
}

// Fetching all pwd certificates with pending status.
func PendingAndApprovedPwdCertificate(c *gin.Context, db *gorm.DB) {
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

	var pwds []models.PwdCard
	if err := db.Where("status IN ?", []string{"pending", "approved"}).Find(&pwds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch documents"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"pwd_certificates": pwds})
}

// Fetching Senior Citizen ID by ID (admin only)
func GetSeniorCitizenIDByID(c *gin.Context, db *gorm.DB) {
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can fetch Senior Citizen IDs"})
		return
	}

	id := c.Param("id")
	var senior models.SeniorCitizenCard
	if err := db.First(&senior, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Senior Citizen ID not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"senior": senior})
}

// Fetch all Senior Citizen IDs
func GetAllSeniorCitizenIDs(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Ensure only admins can access
	userObj, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can fetch Senior Citizen IDs"})
		return
	}

	var seniors []models.SeniorCitizenCard
	if err := db.Find(&seniors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Senior Citizen IDs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"senior_citizens_detail": seniors})
}

// UsersWithPrescriptionSummary provides a summary of prescriptions for each user.
// Only accessible by admins.
func UsersWithPrescriptionSummary(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Ensure only admins can access
	userObj, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can fetch Senior Citizen IDs"})
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

	//  Raw SQL query to calculate prescription counts per user
	// - past_prescription = fulfilled or rejected prescriptions
	// - pending_prescription = unsettled prescriptions with unsettled medicines
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

// UserPrescriptionHistory fetches a user's prescription.
func UserPrescriptionHistory(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Ensure only admins can access
	userObj, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can fetch Senior Citizen IDs"})
		return
	}

	userID := c.Param("user_id")

	var userInfo models.User
	if err := db.First(&userInfo, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

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
		"user": gin.H{
			"id":    userInfo.ID,
			"name":  userInfo.FirstName + " " + userInfo.LastName,
			"email": userInfo.Email,
		},
		"past":      past,
		"unsettled": unsettled,
	})
}
