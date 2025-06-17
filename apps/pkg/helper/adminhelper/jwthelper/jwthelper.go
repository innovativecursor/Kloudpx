package jwt

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/innovativecursor/Kloudpx/apps/pkg/config"
)

// GenerateToken creates a JWT token for the given user ID and role (30-day expiry)
func GenerateToken(userID uint, role string) (string, error) {
	cfg, err := config.Env()
	if err != nil {
		return "", fmt.Errorf("failed to load config: %v", err)
	}

	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(30 * 24 * time.Hour).Unix(), // 30 days
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(cfg.JWT.Secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// GenerateTokenWithExpiry returns a token and its expiry timestamp (1-day expiry)
func GenerateTokenWithExpiry(userID uint, role string) (string, int64, error) {
	cfg, err := config.Env()
	if err != nil {
		return "", 0, fmt.Errorf("failed to load config: %v", err)
	}

	expiresAt := time.Now().Add(24 * time.Hour).Unix() // 1 day
	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     expiresAt,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(cfg.JWT.Secret))
	if err != nil {
		return "", 0, err
	}

	return tokenString, expiresAt, nil
}

// ParseToken validates and parses a JWT token
func ParseToken(tokenString string) (jwt.MapClaims, error) {
	cfg, err := config.Env()
	if err != nil {
		return nil, fmt.Errorf("failed to load config: %v", err)
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(cfg.JWT.Secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}

// GenerateRandomString creates a secure random alphanumeric string
func GenerateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)

	for i := range b {
		nBig, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return ""
		}
		b[i] = charset[nBig.Int64()]
	}

	return string(b)
}
