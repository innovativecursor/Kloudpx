// admin_handler.go
package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	//"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/auth"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"
)
func AdminOAuthLogin(c *gin.Context) {
	var credentials struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify token with provider
	adminInfo, err := auth.GetAdminInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check if this is an admin email domain
	if !isAdminEmail(adminInfo.Email) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "OAuth login is restricted to admin accounts",
		})
		return
	}

	// Find or create admin user
	admin, err := findOrCreateAdmin(adminInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin processing failed"})
		return
	}

	// Generate JWT with admin role
	token, err := auth.GenerateAdminAccessToken(admin.ID, admin.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"admin": gin.H{
			"id":    admin.ID,
			"name":  admin.Name,
			"email": admin.Email,
		},
	})
}

// AdminOAuthLogin handles admin OAuth login
/*func AdminOAuthLogin(c *gin.Context) {
	var credentials struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify token with provider
	adminInfo, err := auth.GetAdminInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check if this is an admin email domain
	if !isAdminEmail(adminInfo.Email) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "OAuth login is restricted to admin accounts",
		})
		return
	}

	// Find or create admin user
	admin, err := findOrCreateAdmin(adminInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin processing failed"})
		return
	}

	// Generate JWT with admin role
	token, err := auth.GenerateAccessToken(admin.ID, admin.Name, "admin")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"role":  "admin",
	})
}
*/
func isAdminEmail(email string) bool {
	adminDomains := []string{"admin.yourdomain.com", "youradmin.com"}

	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return false
	}

	domain := parts[1]
	for _, d := range adminDomains {
		if domain == d {
			return true
		}
	}
	return false
}

func findOrCreateAdmin(info *auth.AdminInfo) (*models.Admin, error) {
	var admin models.Admin

	err := database.DB.QueryRow(
		"SELECT id, name, email FROM admins WHERE oauth_id = $1",
		info.ID,
	).Scan(&admin.ID, &admin.Name, &admin.Email)

	if err == nil {
		return &admin, nil
	}

	if errors.Is(err, sql.ErrNoRows) {
		err = database.DB.QueryRow(
			`INSERT INTO admins (name, email, oauth_id, oauth_provider) 
			VALUES ($1, $2, $3, 'oauth') 
			RETURNING id, name, email`,
			info.Name, info.Email, info.ID,
		).Scan(&admin.ID, &admin.Name, &admin.Email)

		if err != nil {
			return nil, err
		}
		return &admin, nil
	}

	return nil, err
}

