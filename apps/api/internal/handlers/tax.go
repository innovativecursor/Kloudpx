package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

type TaxHandler struct{}

func (t *TaxHandler) GetTax(c *gin.Context) {
	var taxRate float64
	err := database.DB.QueryRow("SELECT vat FROM tax LIMIT 1").Scan(&taxRate)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tax rate"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"vat": taxRate})
}

func (t *TaxHandler) UpdateTax(c *gin.Context) {
	var req struct {
		VAT float64 `json:"vat"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.DB.Exec("UPDATE tax SET vat=$1", req.VAT)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tax rate"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tax rate updated successfully"})
}