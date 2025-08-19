package usersignup

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/usersignup/config"
	"gorm.io/gorm"
)

// UserSignUp handles user registration requests.
// It validates input, hashes the password, and stores the user in the database.
func UserSignUp(c *gin.Context, db *gorm.DB) {
	var req config.Req
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.User
	err := db.Where("phone = ?", req.Phone).First(&user).Error

	if err != nil {
		// User not found → create new
		user = models.User{
			FirstName:       req.FirstName,
			LastName:        req.LastName,
			Phone:           &req.Phone,
			ApplicationRole: "user",
		}
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
	} else {
		// User found
		if user.PhoneVerified {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Phone number already registered. Please login instead.",
			})
			return
		}
		// If not verified → resend OTP
	}

	otpCode := GenerateOTP()
	otp := models.OTP{
		Phone:     req.Phone,
		Code:      otpCode,
		ExpiresAt: time.Now().Add(5 * time.Minute),
	}
	db.Create(&otp)

	message := fmt.Sprintf("Your Kloud P&X OTP is %s.\nValid for 5 mins. Do not share.", otpCode)

	err = s3helper.SendSMS(req.Phone, message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func GenerateOTP() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

// Verify Signup OTP
func VerifySignupOTP(c *gin.Context, db *gorm.DB) {
	var verifyReq config.VerifySignUpReq
	if err := c.ShouldBindJSON(&verifyReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var otp models.OTP
	if err := db.Where("phone = ? AND code = ?", verifyReq.Phone, verifyReq.OTP).First(&otp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
		return
	}

	if otp.ExpiresAt.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP expired"})
		return
	}
	// need to check model
	db.Model(&models.User{}).Where("phone = ?", verifyReq.Phone).Update("phone_verified", true)
	s3helper.SendSMS(verifyReq.Phone, "Signup successful!")
	c.JSON(http.StatusOK, gin.H{"message": "Signup successful"})
}
