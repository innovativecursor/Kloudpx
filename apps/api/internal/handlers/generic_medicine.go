package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// GenericMedicineHandler handles generic medicine operations
type GenericMedicineHandler struct {
	db *sql.DB
}

func NewGenericMedicineHandler(db *sql.DB) *GenericMedicineHandler {
	return &GenericMedicineHandler{db: db}
}

// CreateGenericMedicine creates a new generic medicine
func (h *GenericMedicineHandler) CreateGenericMedicine(c *gin.Context) {
	var generic models.GenericMedicine
	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err := h.db.QueryRow(
		`INSERT INTO generic_medicines (name, description) 
		VALUES ($1, $2) RETURNING id, created_at, updated_at`,
		generic.Name, generic.Description,
	).Scan(&generic.ID, &generic.CreatedAt, &generic.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create generic medicine"})
		return
	}

	c.JSON(http.StatusCreated, generic)
}

// ListGenericMedicines lists all generic medicines
func (h *GenericMedicineHandler) ListGenericMedicines(c *gin.Context) {
	rows, err := h.db.Query(
		"SELECT id, name, description, created_at, updated_at FROM generic_medicines ORDER BY name",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch generic medicines"})
		return
	}
	defer rows.Close()

	var generics []models.GenericMedicine
	for rows.Next() {
		var g models.GenericMedicine
		if err := rows.Scan(&g.ID, &g.Name, &g.Description, &g.CreatedAt, &g.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read generic medicines"})
			return
		}
		generics = append(generics, g)
	}

	c.JSON(http.StatusOK, generics)
}

// GetGenericMedicine gets a specific generic medicine
func (h *GenericMedicineHandler) GetGenericMedicine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var generic models.GenericMedicine
	err = h.db.QueryRow(
		"SELECT id, name, description, created_at, updated_at FROM generic_medicines WHERE id = $1",
		id,
	).Scan(&generic.ID, &generic.Name, &generic.Description, &generic.CreatedAt, &generic.UpdatedAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch generic medicine"})
		}
		return
	}

	c.JSON(http.StatusOK, generic)
}

// UpdateGenericMedicine updates a generic medicine
func (h *GenericMedicineHandler) UpdateGenericMedicine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var generic models.GenericMedicine
	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err = h.db.QueryRow(
		`UPDATE generic_medicines 
		SET name = $1, description = $2, updated_at = NOW() 
		WHERE id = $3 
		RETURNING created_at, updated_at`,
		generic.Name, generic.Description, id,
	).Scan(&generic.CreatedAt, &generic.UpdatedAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update generic medicine"})
		}
		return
	}

	generic.ID = id
	c.JSON(http.StatusOK, generic)
}

// DeleteGenericMedicine deletes a generic medicine
func (h *GenericMedicineHandler) DeleteGenericMedicine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	result, err := h.db.Exec(
		"DELETE FROM generic_medicines WHERE id = $1",
		id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete generic medicine"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Generic medicine deleted successfully"})
}
/*package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
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

	// Convert the ID from string to int
	idInt, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	generic.ID = idInt
	
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
}*/