package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

type SupplierHandler struct{}

func (s *SupplierHandler) CreateSupplier(c *gin.Context) {
	var req struct {
		Name     string  `json:"name"`
		Cost     float64 `json:"cost"`
		Quantity int     `json:"quantity"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.DB.Exec("INSERT INTO suppliers (name, cost, quantity) VALUES ($1, $2, $3)",
		req.Name, req.Cost, req.Quantity)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add supplier"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier added successfully"})
}

func (s *SupplierHandler) ListSuppliers(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, cost, quantity FROM suppliers")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suppliers"})
		return
	}
	defer rows.Close()

	var suppliers []map[string]interface{}
	for rows.Next() {
		var id int
		var name string
		var cost float64
		var quantity int
		if err := rows.Scan(&id, &name, &cost, &quantity); err != nil {
			continue
		}
		suppliers = append(suppliers, map[string]interface{}{
			"id":       id,
			"name":     name,
			"cost":     cost,
			"quantity": quantity,
		})
	}

	c.JSON(http.StatusOK, gin.H{"suppliers": suppliers})
}

func (s *SupplierHandler) GetSupplier(c *gin.Context) {
	id := c.Param("id")

	var supplierID int
	var name string
	var cost float64
	var quantity int

	err := database.DB.QueryRow("SELECT id, name, cost, quantity FROM suppliers WHERE id=$1", id).
		Scan(&supplierID, &name, &cost, &quantity)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}

	supplier := map[string]interface{}{
		"id":       supplierID,
		"name":     name,
		"cost":     cost,
		"quantity": quantity,
	}

	c.JSON(http.StatusOK, supplier)
}

func (s *SupplierHandler) UpdateSupplier(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		Name     string  `json:"name"`
		Cost     float64 `json:"cost"`
		Quantity int     `json:"quantity"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.DB.Exec("UPDATE suppliers SET name=$1, cost=$2, quantity=$3 WHERE id=$4",
		req.Name, req.Cost, req.Quantity, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update supplier"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier updated successfully"})
}

func (s *SupplierHandler) DeleteSupplier(c *gin.Context) {
	id := c.Param("id")

	_, err := database.DB.Exec("DELETE FROM suppliers WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete supplier"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier deleted successfully"})
}
