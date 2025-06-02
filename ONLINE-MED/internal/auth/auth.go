package auth

import (
	"crypto/sha256"
	"encoding/base64"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword generates a bcrypt hash of the password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash compares a password with its hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// GenerateJWT creates a new JWT token
func GenerateJWT(userID int, username, role string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// DecodeImage decodes base64 image data
func DecodeImage(encoded string) ([]byte, error) {
	return base64.StdEncoding.DecodeString(encoded)
}

// EncodeImage encodes image data to base64
func EncodeImage(data []byte) string {
	return base64.StdEncoding.EncodeToString(data)
}

// GeneratePrescriptionHash creates a unique hash for prescription
func GeneratePrescriptionHash(userID, medicineID int) string {
	data := []byte(fmt.Sprintf("%d-%d-%d", userID, medicineID, time.Now().UnixNano()))
	hash := sha256.Sum256(data)
	return fmt.Sprintf("%x", hash)
}