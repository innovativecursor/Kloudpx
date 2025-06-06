package handlers

import (
	"database/sql"
	"net/http"

	"github.com/hashmi846003/online-med.git/internal/models"
	"github.com/gin-gonic/gin"
)

// GenericMedicineHandler struct to hold db connection
type GenericMedicineHandler struct {
	DB *sql.DB
}

// NewGenericMedicineHandler creates a new GenericMedicineHandler
func NewGenericMedicineHandler(db *sql.DB) *GenericMedicineHandler {
	return &GenericMedicineHandler{DB: db}
}

// CreateGenericMedicine creates a new generic medicine
func (h *GenericMedicineHandler) CreateGenericMedicine(c *gin.Context) {
	var generic models.GenericMedicine
	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `INSERT INTO generic_medicines (name, description) VALUES ($1, $2) RETURNING id, created_at, updated_at`
	err := h.DB.QueryRow(query, generic.Name, generic.Description).Scan(&generic.ID, &generic.CreatedAt, &generic.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, generic)
}

// ListGenericMedicines lists all generic medicines
func (h *GenericMedicineHandler) ListGenericMedicines(c *gin.Context) {
	query := `SELECT id, name, description, created_at, updated_at FROM generic_medicines ORDER BY name`
	rows, err := h.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var generics []models.GenericMedicine
	for rows.Next() {
		var g models.GenericMedicine
		if err := rows.Scan(&g.ID, &g.Name, &g.Description, &g.CreatedAt, &g.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		generics = append(generics, g)
	}

	c.JSON(http.StatusOK, generics)
}

// GetGenericMedicine gets a single generic medicine by ID
func (h *GenericMedicineHandler) GetGenericMedicine(c *gin.Context) {
	id := c.Param("id")

	var generic models.GenericMedicine
	query := `SELECT id, name, description, created_at, updated_at FROM generic_medicines WHERE id = $1`
	err := h.DB.QueryRow(query, id).Scan(&generic.ID, &generic.Name, &generic.Description, &generic.CreatedAt, &generic.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, generic)
}

// UpdateGenericMedicine updates a generic medicine
func (h *GenericMedicineHandler) UpdateGenericMedicine(c *gin.Context) {
	id := c.Param("id")

	var generic models.GenericMedicine
	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `UPDATE generic_medicines SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 
	          RETURNING updated_at`
	err := h.DB.QueryRow(query, generic.Name, generic.Description, id).Scan(&generic.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	generic.ID, _ = c.Params.GetInt("id")
	c.JSON(http.StatusOK, generic)
}

// DeleteGenericMedicine deletes a generic medicine
func (h *GenericMedicineHandler) DeleteGenericMedicine(c *gin.Context) {
	id := c.Param("id")

	query := `DELETE FROM generic_medicines WHERE id = $1`
	result, err := h.DB.Exec(query, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Generic medicine deleted successfully"})
}