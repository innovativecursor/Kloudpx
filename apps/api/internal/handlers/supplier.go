package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// SupplierHandler struct to hold db connection
type SupplierHandler struct {
	DB *sql.DB
}

// NewSupplierHandler creates a new SupplierHandler
func NewSupplierHandler(db *sql.DB) *SupplierHandler {
	return &SupplierHandler{DB: db}
}

// CreateSupplier creates a new supplier
func (h *SupplierHandler) CreateSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get admin ID from context (set by auth middleware)
	adminID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	supplier.AdminID = adminID.(int)

	query := `INSERT INTO suppliers (
		admin_id, supplier_name, cost, discount_provided, quantity_in_piece, 
		quantity_in_box, cost_price, taxes
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
	RETURNING id, created_at, updated_at`

	err := h.DB.QueryRow(
		query,
		supplier.AdminID,
		supplier.SupplierName,
		supplier.Cost,
		supplier.DiscountProvided,
		supplier.QuantityInPiece,
		supplier.QuantityInBox,
		supplier.CostPrice,
		supplier.Taxes,
	).Scan(&supplier.ID, &supplier.CreatedAt, &supplier.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, supplier)
}

// ListSuppliers lists all suppliers
func (h *SupplierHandler) ListSuppliers(c *gin.Context) {
	query := `SELECT id, admin_id, supplier_name, cost, discount_provided, quantity_in_piece, 
	          quantity_in_box, cost_price, taxes, created_at, updated_at 
	          FROM suppliers ORDER BY supplier_name`
	rows, err := h.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var suppliers []models.Supplier
	for rows.Next() {
		var s models.Supplier
		err := rows.Scan(
			&s.ID,
			&s.AdminID,
			&s.SupplierName,
			&s.Cost,
			&s.DiscountProvided,
			&s.QuantityInPiece,
			&s.QuantityInBox,
			&s.CostPrice,
			&s.Taxes,
			&s.CreatedAt,
			&s.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		suppliers = append(suppliers, s)
	}

	c.JSON(http.StatusOK, suppliers)
}

// GetSupplier gets a single supplier by ID
func (h *SupplierHandler) GetSupplier(c *gin.Context) {
	id := c.Param("id")

	var supplier models.Supplier
	query := `SELECT id, admin_id, supplier_name, cost, discount_provided, quantity_in_piece, 
	          quantity_in_box, cost_price, taxes, created_at, updated_at 
	          FROM suppliers WHERE id = $1`
	err := h.DB.QueryRow(query, id).Scan(
		&supplier.ID,
		&supplier.AdminID,
		&supplier.SupplierName,
		&supplier.Cost,
		&supplier.DiscountProvided,
		&supplier.QuantityInPiece,
		&supplier.QuantityInBox,
		&supplier.CostPrice,
		&supplier.Taxes,
		&supplier.CreatedAt,
		&supplier.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, supplier)
}

// UpdateSupplier updates a supplier
func (h *SupplierHandler) UpdateSupplier(c *gin.Context) {
	id := c.Param("id")

	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get admin ID from context (set by auth middleware)
	adminID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `UPDATE suppliers SET 
		supplier_name = $1, 
		cost = $2, 
		discount_provided = $3, 
		quantity_in_piece = $4, 
		quantity_in_box = $5, 
		cost_price = $6, 
		taxes = $7, 
		updated_at = CURRENT_TIMESTAMP 
		WHERE id = $8 AND admin_id = $9
		RETURNING updated_at`

	err := h.DB.QueryRow(
		query,
		supplier.SupplierName,
		supplier.Cost,
		supplier.DiscountProvided,
		supplier.QuantityInPiece,
		supplier.QuantityInBox,
		supplier.CostPrice,
		supplier.Taxes,
		id,
		adminID,
	).Scan(&supplier.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found or you don't have permission to update it"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	supplier.ID, _ = c.Params.GetInt("id")
	supplier.AdminID = adminID.(int)
	c.JSON(http.StatusOK, supplier)
}

// DeleteSupplier deletes a supplier
func (h *SupplierHandler) DeleteSupplier(c *gin.Context) {
	id := c.Param("id")

	// Get admin ID from context (set by auth middleware)
	adminID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `DELETE FROM suppliers WHERE id = $1 AND admin_id = $2`
	result, err := h.DB.Exec(query, id, adminID)
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
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found or you don't have permission to delete it"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier deleted successfully"})
}