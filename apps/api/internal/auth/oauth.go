package auth

import (
	"errors"
//	"strings"

//	"github.com/gin-gonic/gin"
)

// Extract Token from Header, Query, or Cookie
/*
func ExtractToken(c *gin.Context) string {
	token := c.GetHeader("Authorization")
	if token == "" {
		token = c.Query("token")
	}
	if token == "" {
		cookie, err := c.Cookie("auth_token")
		if err == nil {
			token = cookie
		}
	}
	return strings.TrimPrefix(token, "Bearer ")
}
*/
// Mock function to get admin info from OAuth provider
func GetAdminInfo(token string) (map[string]interface{}, error) {
	if token == "" {
		return nil, errors.New("invalid token")
	}
	return map[string]interface{}{
		"ID":   1,
		"Name": "Admin User",
	}, nil
}

// Mock function to find or create admin
func FindOrCreateAdmin(info map[string]interface{}) (map[string]interface{}, error) {
	if info == nil {
		return nil, errors.New("invalid admin info")
	}
	return info, nil
}

// Mock function to get pharmacist info from OAuth provider
func GetPharmacistInfo(token string) (map[string]interface{}, error) {
	if token == "" {
		return nil, errors.New("invalid token")
	}
	return map[string]interface{}{
		"ID":   2,
		"Name": "Pharmacist User",
	}, nil
}

// Mock function to find or create pharmacist
func FindOrCreatePharmacist(info map[string]interface{}) (map[string]interface{}, error) {
	if info == nil {
		return nil, errors.New("invalid pharmacist info")
	}
	return info, nil
}