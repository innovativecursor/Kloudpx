package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

// Medicine represents a medicine entity
type Medicine struct {
	ID          int    `json:"id"`
	BrandName   string `json:"brand_name"`
	GenericName string `json:"generic_name"`
	Description string `json:"description,omitempty"`
}

// ✅ USER-FACING HANDLERS

// SearchMedicines handles medicine search for users
func SearchMedicines(c *gin.Context) {
	query := c.Query("q")

	rows, err := database.DB.Query(`
		SELECT id, brand_name, generic_name 
		FROM medicines 
		WHERE brand_name ILIKE $1 OR generic_name ILIKE $1`, "%"+query+"%")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search medicines"})
		return
	}
	defer rows.Close()

	var medicines []Medicine
	for rows.Next() {
		var med Medicine
		if err := rows.Scan(&med.ID, &med.BrandName, &med.GenericName); err != nil {
			continue
		}
		medicines = append(medicines, med)
	}

	c.JSON(http.StatusOK, gin.H{"medicines": medicines})
}

// GetMedicineDetails fetches detailed information of a medicine
func GetMedicineDetails(c *gin.Context) {
	medicineID := c.Param("id")
	var med Medicine

	err := database.DB.QueryRow(`
		SELECT id, brand_name, generic_name, description 
		FROM medicines 
		WHERE id=$1`, medicineID).
		Scan(&med.ID, &med.BrandName, &med.GenericName, &med.Description)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, med)
}

// ✅ ADMIN-FACING HANDLERS

// ListAllMedicines lists all medicines in the system
func ListAllMedicines(c *gin.Context) {
	rows, err := database.DB.Query(`
		SELECT id, brand_name, generic_name, description 
		FROM medicines`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve medicines"})
		return
	}
	defer rows.Close()

	var medicines []Medicine
	for rows.Next() {
		var med Medicine
		if err := rows.Scan(&med.ID, &med.BrandName, &med.GenericName, &med.Description); err != nil {
			continue
		}
		medicines = append(medicines, med)
	}

	c.JSON(http.StatusOK, gin.H{"medicines": medicines})
}

// ListMedicines is an alias for ListAllMedicines
func ListMedicines(c *gin.Context) {
	ListAllMedicines(c)
}

// GetLowStockMedicines returns medicines with quantity below threshold
func GetLowStockMedicines(c *gin.Context) {
	const threshold = 10

	rows, err := database.DB.Query(`
		SELECT id, brand_name, generic_name, description
		FROM medicines
		WHERE quantity < $1`, threshold)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch low-stock medicines"})
		return
	}
	defer rows.Close()

	var medicines []Medicine
	for rows.Next() {
		var med Medicine
		if err := rows.Scan(&med.ID, &med.BrandName, &med.GenericName, &med.Description); err != nil {
			continue
		}
		medicines = append(medicines, med)
	}

	c.JSON(http.StatusOK, gin.H{"low_stock_medicines": medicines})
}

// AddMedicine allows admin to add a new medicine
func AddMedicine(c *gin.Context) {
	var med Medicine
	if err := c.ShouldBindJSON(&med); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	err := database.DB.QueryRow(`
		INSERT INTO medicines (brand_name, generic_name, description) 
		VALUES ($1, $2, $3) RETURNING id`,
		med.BrandName, med.GenericName, med.Description).Scan(&med.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add medicine"})
		return
	}

	c.JSON(http.StatusCreated, med)
}

// UpdateMedicine allows admin to update an existing medicine
func UpdateMedicine(c *gin.Context) {
	medicineID := c.Param("id")
	var med Medicine
	if err := c.ShouldBindJSON(&med); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := database.DB.Exec(`
		UPDATE medicines 
		SET brand_name=$1, generic_name=$2, description=$3 
		WHERE id=$4`,
		med.BrandName, med.GenericName, med.Description, medicineID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update medicine"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine updated successfully"})
}

// DeleteMedicine allows admin to delete a medicine
func DeleteMedicine(c *gin.Context) {
	medicineID := c.Param("id")
	id, err := strconv.Atoi(medicineID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	_, err = database.DB.Exec(`DELETE FROM medicines WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete medicine"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}
























































































































































