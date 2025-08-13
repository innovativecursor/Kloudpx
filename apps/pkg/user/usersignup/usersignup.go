package usersignup

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/usersignup/config"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// UserSignUp handles user registration requests.
// It validates input, hashes the password, and stores the user in the database.
func UserSignUp(c *gin.Context, db *gorm.DB) {
	var signUpBody config.SignupRequest

	if err := c.ShouldBindJSON(&signUpBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Hash the user's password before storing it in the database
	hashedPassword, err := HashPassword(signUpBody.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}

	// Create a new user model instance
	user := models.User{
		Email:     signUpBody.Email,
		Password:  hashedPassword,
		Phone:     signUpBody.Phone,
		FirstName: signUpBody.FirstName,
		LastName:  signUpBody.LastName,
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

// HashPassword takes a plain-text password and returns its bcrypt hash.
// The cost factor 14 makes it slower for brute-force attacks but more CPU intensive.
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
