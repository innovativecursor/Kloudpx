package dashboard

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func GetCurrentAdminInfo(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: admin not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	admin, ok := user.(*models.Admin)
	if !ok {
		logrus.Warn("Invalid admin object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid admin object"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":               admin.ID,
		"first_name":       admin.FirstName,
		"last_name":        admin.LastName,
		"email":            admin.Email,
		"email_verified":   admin.EmailVerified,
		"application_role": admin.ApplicationRole,
		"created_at":       admin.CreatedAt,
	})
}

func GetDashboardUserSummary(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user_id", userObj.ID).Warn("Unauthorized dashboard access")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can access dashboard"})
		return
	}

	var users []models.User
	if err := db.Find(&users).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch users")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	// Build response
	var userInfos []gin.H
	for _, u := range users {
		userInfos = append(userInfos, gin.H{
			"id":             u.ID,
			"first_name":     u.FirstName,
			"last_name":      u.LastName,
			"email":          u.Email,
			"email_verified": u.EmailVerified,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"total_users": len(users),
		"users":       userInfos,
	})
}

func GetMedicineCountSummary(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user_id", userObj.ID).Warn("Unauthorized access to medicine count summary")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can access this data"})
		return
	}

	var total int64
	var otc int64

	// Count total medicines
	if err := db.Model(&models.Medicine{}).Count(&total).Error; err != nil {
		logrus.WithError(err).Error("Failed to count total medicines")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch total medicine count"})
		return
	}

	// Count OTC medicines (Prescription == false)
	if err := db.Model(&models.Medicine{}).Where("prescription = ?", false).Count(&otc).Error; err != nil {
		logrus.WithError(err).Error("Failed to count OTC medicines")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch OTC medicine count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total_medicines": total,
		"otc_medicines":   otc,
	})
}
