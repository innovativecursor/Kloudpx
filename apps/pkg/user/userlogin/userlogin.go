package userlogin

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/jwthelper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/userlogin/config"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// UserLogin handles user authentication via email or phone number.
// It verifies the credentials, generates a JWT token, and sends a login notification via email or SMS.
func UserLogin(c *gin.Context, db *gorm.DB) {
	var loginRequest config.LoginRequest

	// Bind and validate the incoming JSON request body
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Find user based on email or phone
	var user *models.User
	if loginRequest.Email != "" {
		db.Where("email = ?", loginRequest.Email).First(&user)
	} else if loginRequest.Phone != "" {
		db.Where("phone = ?", loginRequest.Phone).First(&user)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or phone required"})
		return
	}

	// Validate password using bcrypt hash comparison
	if CheckPasswordHash(c, loginRequest.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}

	// Generate JWT token based on email or phone
	token := GenerateJWTTokenForEmailAndPhone(c, loginRequest, user)

	// Send email or SMS login notification
	expireAt := SendEmailSMS(db, loginRequest, user)

	c.JSON(http.StatusOK, gin.H{"token": token, "expireAt": expireAt})
}

// CheckPasswordHash compares a plain password by converting into hash password with a bcrypt hashed password.
// Returns true if they match, false otherwise.
func CheckPasswordHash(c *gin.Context, password, hash string) bool {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(bytes))
	return err == nil
}

// GenerateJWTTokenForEmailAndPhone generates a JWT token based on whether the user logged in with email or phone.
func GenerateJWTTokenForEmailAndPhone(c *gin.Context, loginBody config.LoginRequest, userObj *models.User) (token string) {
	var err error
	if loginBody.Email != "" {
		token, err = jwthelper.GenerateJWTToken(userObj.Email)
	} else {
		token, err = jwthelper.GenerateJWTFromPhone(userObj.Phone)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	return token
}

// SendEmailSMS sends a login notification to the user via email or SMS
// based on the method they used to log in.
func SendEmailSMS(db *gorm.DB, loginRequest config.LoginRequest, user *models.User) (expireAt time.Time) {
	// Send Email or SMS
	if loginRequest.Email != "" {
		// var orderID, status string
		// err := db.Raw("SELECT id, status FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 1", user.ID).
		// 	Row().
		// 	Scan(&orderID, &status)
		// if err != nil {
		// 	log.Printf("Order fetch error: %v", err)
		// }
		userFullName := user.FirstName + user.LastName
		body := fmt.Sprintf("Dear %s,Your order #ORDER_ID is now delivered.\nThank you for shopping with us! \nKloud P&X", userFullName)

		s3helper.SendEmail(user.Email, "Login Notification", body)
		//s3helper.SendEmail(user.Email, "Login Notification", GenerateEmailBody(userFullName, orderID, status))
	} else if loginRequest.Phone != "" {
		expireAt, _ = s3helper.SendSMS(user.Phone)
	}

	// if loginRequest.Phone != "" {
	// 	expireAt, _ = s3helper.SendSMS(userObj.Phone)
	// }

	return expireAt
}

func GenerateEmailBody(customerName, orderID, status string) string {
	return fmt.Sprintf(`
		<html>
		<body>
		<p>Dear %s,</p>
		<p>Your order <b>#%s</b> is now <b>%s</b>.</p>
		<p>Thank you for shopping with us!<br>Kloud P&amp;X</p>
		</body>
		</html>
	`, customerName, orderID, status)
}
