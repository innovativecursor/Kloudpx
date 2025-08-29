package pwd

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/pwd/config"
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
func ListPendingPwdCertificate(c *gin.Context, db *gorm.DB) {
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
	if err := db.Where("status = ?", "pending").Find(&pwds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch documents"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"pwd_certificates": pwds})
}
