package userlogin

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/jwthelper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/userlogin/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/usersignup"
	"gorm.io/gorm"
)

// UserLogin handles user authentication via email or phone number.
// It verifies the credentials, generates a JWT token, and sends a login notification via email or SMS.
func UserLogin(c *gin.Context, db *gorm.DB) {
	var loginRequest config.LoginRequest
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.User
	if err := db.Where("phone = ? AND phone_verified = ?", loginRequest.Phone, true).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found or not verified"})
		return
	}

	otpCode := usersignup.GenerateOTP()
	otp := models.OTP{
		Phone:     loginRequest.Phone,
		Code:      otpCode,
		ExpiresAt: time.Now().Add(5 * time.Minute),
	}
	db.Create(&otp)
	message := fmt.Sprintf("Your Kloud P&X OTP is %s.\nValid for 5 mins. Do not share.", otpCode)
	s3helper.SendSMS(loginRequest.Phone, message)
	c.JSON(http.StatusOK, gin.H{"message": "OTP sent"})
}

func VerifyLoginOTP(c *gin.Context, db *gorm.DB) {
	var verifyLoginOTP config.VerifyOTP
	if err := c.ShouldBindJSON(&verifyLoginOTP); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var otp models.OTP
	if err := db.Where("phone = ? AND code = ?", verifyLoginOTP.Phone, verifyLoginOTP.OTP).First(&otp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
		return
	}

	if otp.ExpiresAt.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP expired"})
		return
	}

	var user models.User
	db.Where("phone = ?", verifyLoginOTP.Phone).First(&user)
	token, err := jwthelper.GenerateJWTFromPhone(verifyLoginOTP.Phone)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	session := models.LoginSession{
		UserID:    user.ID,
		JWTToken:  token,
		UserAgent: c.GetHeader("User-Agent"),
		IP:        c.ClientIP(),
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}
	db.Create(&session)

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func VerifyOTP(c *gin.Context, db *gorm.DB) {
	var verifyOTP config.VerifyOTP
	// Bind JSON request
	if err := c.ShouldBindJSON(&verifyOTP); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Validate phone pointer
	if verifyOTP.Phone == "" || verifyOTP.OTP == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Phone and OTP are required"})
		return
	}

	// Find OTP in database
	var otp models.OTP
	if err := db.Where("phone = ? AND code = ?", verifyOTP.Phone, verifyOTP.OTP).First(&otp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
		return
	}

	// Check if OTP is expired
	if otp.ExpiresAt.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP expired"})
		return
	}

	// Mark user as verified if this is for signup
	if err := db.Model(&models.User{}).Where("phone = ?", verifyOTP.Phone).Update("phone_verified", true).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	// Send confirmation SMS
	message := "Your phone number has been successfully verified!"
	if err := s3helper.SendSMS(verifyOTP.Phone, message); err != nil {
		log.Println("Failed to send confirmation SMS:", err)
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
}
