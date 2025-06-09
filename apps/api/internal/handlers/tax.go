package handlers

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// TaxHandler handles tax operations
type TaxHandler struct {
	db *sql.DB
}

func NewTaxHandler(db *sql.DB) *TaxHandler {
	return &TaxHandler{db: db}
}

// GetTax gets the current tax rate
func (h *TaxHandler) GetTax(c *gin.Context) {
	var tax models.Tax
	err := h.db.QueryRow(
		"SELECT vat FROM medicines LIMIT 1",
	).Scan(&tax.VAT)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusOK, models.Tax{VAT: 0})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tax rate"})
		}
		return
	}

	c.JSON(http.StatusOK, tax)
}

// UpdateTax updates the tax rate
func (h *TaxHandler) UpdateTax(c *gin.Context) {
	var tax models.Tax
	if err := c.ShouldBindJSON(&tax); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	_, err := h.db.Exec(
		"UPDATE medicines SET vat = $1",
		tax.VAT,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tax rate"})
		return
	}

	c.JSON(http.StatusOK, tax)
}

/*package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// TaxHandler struct to hold db connection
type TaxHandler struct {
	DB *sql.DB
}

// NewTaxHandler creates a new TaxHandler
func NewTaxHandler(db *sql.DB) *TaxHandler {
	return &TaxHandler{DB: db}
}

// GetTax gets the current tax rate
func (h *TaxHandler) GetTax(c *gin.Context) {
	var vat float64
	query := `SELECT vat FROM medicines LIMIT 1`
	err := h.DB.QueryRow(query).Scan(&vat)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tax information not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	tax := models.Tax{VAT: vat}
	c.JSON(http.StatusOK, tax)
}

// UpdateTax updates the tax rate
func (h *TaxHandler) UpdateTax(c *gin.Context) {
	var tax models.Tax
	if err := c.ShouldBindJSON(&tax); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `UPDATE medicines SET vat = $1`
	_, err := h.DB.Exec(query, tax.VAT)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tax)
}*/