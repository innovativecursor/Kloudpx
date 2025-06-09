package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// AdminOAuthLogin handles admin OAuth login
func AdminOAuthLogin(c *gin.Context) {
	var credentials struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify token with provider
	userInfo, err := auth.GetUserInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check if this is an admin email domain
	if !isAdminEmail(userInfo.Email) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "OAuth login is restricted to admin accounts",
		})
		return
	}

	// Find or create admin user
	admin, err := findOrCreateAdmin(userInfo)
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
		"admin": gin.H{
			"id":    admin.ID,
			"name":  admin.Name,
			"email": admin.Email,
		},
	})
}

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

func findOrCreateAdmin(info *auth.UserInfo) (*models.Admin, error) {
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
			VALUES ($1, $2, $3, 'google') 
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

// Medicine management handlers
func AddMedicine(c *gin.Context) {
	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.QueryRow(
		`INSERT INTO medicines (name, generic_name, prescription_required, stock, price) 
		VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		medicine.BrandName, medicine.GenericID, medicine.PrescriptionRequired, 
		medicine.QuantityInPieces, medicine.SellingPrice,
	).Scan(&medicine.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not add medicine"})
		return
	}

	c.JSON(http.StatusCreated, medicine)
}

func UpdateMedicine(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	medicine.ID = id

	result, err := database.DB.Exec(
		`UPDATE medicines SET 
			name = $1, 
			generic_name = $2, 
			prescription_required = $3, 
			stock = $4, 
			price = $5 
		WHERE id = $6`,
		medicine.BrandName, medicine.GenericID, medicine.PrescriptionRequired, 
		medicine.QuantityInPieces, medicine.SellingPrice, medicine.ID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, medicine)
}

func DeleteMedicine(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	result, err := database.DB.Exec("DELETE FROM medicines WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}

func ListMedicines(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, name, generic_name, prescription_required, stock, price FROM medicines",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve medicines"})
		return
	}
	defer rows.Close()

	var medicines []models.Medicine
	for rows.Next() {
		var med models.Medicine
		if err := rows.Scan(
			&med.ID, &med.BrandName, &med.GenericID, &med.PrescriptionRequired, 
			&med.QuantityInPieces, &med.SellingPrice,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning medicine"})
			return
		}
		medicines = append(medicines, med)
	}

	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error after scanning medicines"})
		return
	}

	c.JSON(http.StatusOK, medicines)
}
/*package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"
)
*/
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
	userInfo, err := auth.GetUserInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check if this is an admin email domain
	if !isAdminEmail(userInfo.Email) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "OAuth login is restricted to admin accounts",
		})
		return
	}

	// Find or create admin user
	admin, err := findOrCreateAdmin(userInfo)
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
		"admin": gin.H{
			"id":    admin.ID,
			"name":  admin.Name,
			"email": admin.Email,
		},
	})
}
*/
/*func AdminOAuthLogin(c *gin.Context) {
    var credentials struct {
        AccessToken string `json:"access_token"`
        Provider    string `json:"provider,omitempty"` // "google" or others
    }

    if err := c.ShouldBindJSON(&credentials); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Get user info based on provider
    var userInfo *auth.UserInfo
    var err error
    
    switch credentials.Provider {
    case "google":
        userInfo, err = auth.GetUserInfo(credentials.AccessToken)
    default:
        c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported OAuth provider"})
        return
    }

    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
        return
    }

    // Rest of your existing logic...
    if !isAdminEmail(userInfo.Email) {
        c.JSON(http.StatusForbidden, gin.H{"error": "Restricted to admin accounts"})
        return
    }
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

func findOrCreateAdmin(info *auth.UserInfo) (*models.Admin, error) {
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
			VALUES ($1, $2, $3, 'google') 
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

// Medicine management handlers
func AddMedicine(c *gin.Context) {
	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.QueryRow(
		`INSERT INTO medicines (name, generic_name, prescription_required, stock, price) 
		VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		medicine.BrandName, medicine.GenericID, medicine.PrescriptionRequired, 
		medicine.QuantityInPieces, medicine.SellingPrice,
	).Scan(&medicine.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not add medicine"})
		return
	}

	c.JSON(http.StatusCreated, medicine)
}

func UpdateMedicine(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	medicine.ID = id

	result, err := database.DB.Exec(
		`UPDATE medicines SET 
			name = $1, 
			generic_name = $2, 
			prescription_required = $3, 
			stock = $4, 
			price = $5 
		WHERE id = $6`,
		medicine.BrandName, medicine.GenericID, medicine.PrescriptionRequired, 
		medicine.QuantityInPieces, medicine.SellingPrice, medicine.ID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, medicine)
}

func DeleteMedicine(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	result, err := database.DB.Exec("DELETE FROM medicines WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}

func ListMedicines(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, name, generic_name, prescription_required, stock, price FROM medicines",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve medicines"})
		return
	}
	defer rows.Close()

	var medicines []models.Medicine
	for rows.Next() {
		var med models.Medicine
		if err := rows.Scan(
			&med.ID, &med.BrandName, &med.GenericID, &med.PrescriptionRequired, 
			&med.QuantityInPieces, &med.SellingPrice,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning medicine"})
			return
		}
		medicines = append(medicines, med)
	}

	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error after scanning medicines"})
		return
	}

	c.JSON(http.StatusOK, medicines)
}
/*package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// AdminOAuthLogin handles admin OAuth login
/func AdminOAuthLogin(c *gin.Context) {
	var credentials struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify token with provider
	userInfo, err := auth.GetUserInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check if this is an admin email domain
	if !isAdminEmail(userInfo.Email) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "OAuth login is restricted to admin accounts",
		})
		return
	}

	// Find or create admin user
	admin, err := findOrCreateAdmin(userInfo)
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
		"admin": gin.H{
			"id":    admin.ID,
			"name":  admin.Name,
			"email": admin.Email,
		},
	})
}

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

func findOrCreateAdmin(info *auth.UserInfo) (*models.Admin, error) {
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
			VALUES ($1, $2, $3, 'google') 
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

// Medicine management handlers
func AddMedicine(c *gin.Context) {
	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.QueryRow(
		`INSERT INTO medicines (name, generic_name, prescription_required, stock, price) 
		VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		medicine.BrandName, medicine.GenericID, medicine.PrescriptionRequired, 
		medicine.QuantityInPieces, medicine.SellingPrice,
	).Scan(&medicine.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not add medicine"})
		return
	}

	c.JSON(http.StatusCreated, medicine)
}

func UpdateMedicine(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	medicine.ID = id

	result, err := database.DB.Exec(
		`UPDATE medicines SET 
			name = $1, 
			generic_name = $2, 
			prescription_required = $3, 
			stock = $4, 
			price = $5 
		WHERE id = $6`,
		medicine.BrandName, medicine.GenericID, medicine.PrescriptionRequired, 
		medicine.QuantityInPieces, medicine.SellingPrice, medicine.ID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, medicine)
}

func DeleteMedicine(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	result, err := database.DB.Exec("DELETE FROM medicines WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}

func ListMedicines(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, name, generic_name, prescription_required, stock, price FROM medicines",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve medicines"})
		return
	}
	defer rows.Close()

	var medicines []models.Medicine
	for rows.Next() {
		var med models.Medicine
		if err := rows.Scan(
			&med.ID, &med.BrandName, &med.GenericID, &med.PrescriptionRequired, 
			&med.QuantityInPieces, &med.SellingPrice,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning medicine"})
			return
		}
		medicines = append(medicines, med)
	}

	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error after scanning medicines"})
		return
	}

	c.JSON(http.StatusOK, medicines)
}

/*package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"
)

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
	userInfo, err := auth.GetUserInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check if this is an admin email domain
	if !isAdminEmail(userInfo.Email) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "OAuth login is restricted to admin accounts",
		})
		return
	}

	// Find or create admin user
	admin, err := findOrCreateAdmin(userInfo)
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
*//*
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

func findOrCreateAdmin(info *auth.UserInfo) (*models.Admin, error) {
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

// Medicine management handlers (unchanged)
func AddMedicine(c *gin.Context) {
	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.QueryRow(
		`INSERT INTO medicines (name, generic_name, prescription_required, stock, price) 
		VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		medicine.BrandName, medicine.ID, medicine.PrescriptionRequired, 
		medicine.QuantityInPieces, medicine.SellingPrice,
	).Scan(&medicine.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not add medicine"})
		return
	}

	c.JSON(http.StatusCreated, medicine)
}

func UpdateMedicine(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	medicine.ID = id

	result, err := database.DB.Exec(
		`UPDATE medicines SET 
			name = $1, 
			generic_name = $2, 
			prescription_required = $3, 
			stock = $4, 
			price = $5 
		WHERE id = $6`,
		medicine.BrandName, medicine.GenericID, medicine.PrescriptionRequired, 
		medicine.QuantityInPieces, medicine.SellingPrice, medicine.ID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, medicine)
}

func DeleteMedicine(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	result, err := database.DB.Exec("DELETE FROM medicines WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}

func ListMedicines(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, name, generic_name, prescription_required, stock, price FROM medicines",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve medicines"})
		return
	}
	defer rows.Close()

	var medicines []models.Medicine
	for rows.Next() {
		var med models.Medicine
		if err := rows.Scan(
			&med.ID, &med.BrandName, &med.GenericID, &med.PrescriptionRequired, 
			&med.QuantityInPieces, &med.SellingPrice,
		); err == nil {
			medicines = append(medicines, med)
		}
	}

	c.JSON(http.StatusOK, medicines)
}*/

/*func ListUsers(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, username FROM users")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve users"})
		return
	}
	defer rows.Close()

	var users []struct {
		ID       int    `json:"id"`
		Username string `json:"username"`
	}
	for rows.Next() {
		var u struct {
			ID       int    `json:"id"`
			Username string `json:"username"`
		}
		if err := rows.Scan(&u.ID, &u.Username); err == nil {
			users = append(users, u)
		}
	}

	c.JSON(http.StatusOK, users)
}
*/
/*func ListAdmins(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, email FROM admins")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve admins"})
		return
	}
	defer rows.Close()

	var admins []models.Admin
	for rows.Next() {
		var a models.Admin
		if err := rows.Scan(&a.ID, &a.Name, &a.Email); err == nil {
			admins = append(admins, a)
		}
	}

	c.JSON(http.StatusOK, admins)
}
*/
/*func ListPharmacists(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, email FROM pharmacists")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve pharmacists"})
		return
	}
	defer rows.Close()

	var pharmacists []models.Pharmacist
	for rows.Next() {
		var p models.Pharmacist
		if err := rows.Scan(&p.ID, &p.Name, &p.Email); err == nil {
			pharmacists = append(pharmacists, p)
		}
	}

	c.JSON(http.StatusOK, pharmacists)
}
*/
/*func GetUserDetails(c *gin.Context) {
	idStr := c.Param("id")
	userID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user struct {
		ID        int            `json:"id"`
		Username  string         `json:"username"`
		CreatedAt sql.NullString `json:"created_at"`
		LastLogin sql.NullString `json:"last_login"`
	}

	err = database.DB.QueryRow(`
		SELECT id, username, created_at, last_login
		FROM users 
		WHERE id = $1`,
		userID,
	).Scan(&user.ID, &user.Username, &user.CreatedAt, &user.LastLogin)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, user)
}
*/
/*func GetOrderStatistics(c *gin.Context) {
	var stats struct {
		TotalOrders      int     `json:"total_orders"`
		PendingOrders    int     `json:"pending_orders"`
		CompletedOrders  int     `json:"completed_orders"`
		TotalRevenue     float64 `json:"total_revenue"`
		AvgOrderValue    float64 `json:"avg_order_value"`
	}

	err := database.DB.QueryRow(
		"SELECT COUNT(*) FROM carts WHERE status != 'pending'",
	).Scan(&stats.TotalOrders)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get order stats"})
		return
	}

	err = database.DB.QueryRow(
		"SELECT COUNT(*) FROM carts WHERE status = 'submitted' OR status = 'reviewed'",
	).Scan(&stats.PendingOrders)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get pending orders"})
		return
	}

	err = database.DB.QueryRow(
		"SELECT COUNT(*) FROM carts WHERE status = 'completed'",
	).Scan(&stats.CompletedOrders)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get completed orders"})
		return
	}

	err = database.DB.QueryRow(`
		SELECT COALESCE(SUM(ci.quantity * m.price), 0)
		FROM cart_items ci
		JOIN medicines m ON ci.medicine_id = m.id
		JOIN carts c ON ci.cart_id = c.id
		WHERE c.status = 'completed'`,
	).Scan(&stats.TotalRevenue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get total revenue"})
		return
	}

	if stats.CompletedOrders > 0 {
		stats.AvgOrderValue = stats.TotalRevenue / float64(stats.CompletedOrders)
	}

	c.JSON(http.StatusOK, stats)
}
*/
/*func GetLowStockMedicines(c *gin.Context) {
	threshold := 10
	if param := c.Query("threshold"); param != "" {
		if val, err := strconv.Atoi(param); err == nil {
			threshold = val
		}
	}

	rows, err := database.DB.Query(`
		SELECT id, name, generic_name, stock 
		FROM medicines 
		WHERE stock < $1 
		ORDER BY stock ASC`,
		threshold,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve low stock medicines"})
		return
	}
	defer rows.Close()

	type LowStockMedicine struct {
		ID          int    `json:"id"`
		Name        string `json:"name"`
		GenericName string `json:"generic_name"`
		Stock       int    `json:"stock"`
	}

	var medicines []LowStockMedicine
	for rows.Next() {
		var med LowStockMedicine
		if err := rows.Scan(&med.ID, &med.Name, &med.GenericName, &med.Stock); err == nil {
			medicines = append(medicines, med)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"threshold": threshold,
		"medicines": medicines,
	})
}*/