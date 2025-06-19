package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type SupplierHandler struct {
	db *gorm.DB
}

func NewSupplierHandler(db *gorm.DB) *SupplierHandler {
	return &SupplierHandler{db: db}
}

func (h *SupplierHandler) CreateSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create supplier"})
		return
	}

	c.JSON(http.StatusCreated, supplier)
}

func (h *SupplierHandler) GetSupplier(c *gin.Context) {
	id := c.Param("id")

	var supplier models.Supplier
	if err := h.db.Preload("Medicines").First(&supplier, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}

	c.JSON(http.StatusOK, supplier)
}

func (h *SupplierHandler) UpdateSupplier(c *gin.Context) {
	id := c.Param("id")

	var updateData models.Supplier
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var supplier models.Supplier
	if err := h.db.First(&supplier, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}

	// Update fields
	if updateData.SupplierName != "" {
		supplier.SupplierName = updateData.SupplierName
	}
	if updateData.Cost > 0 {
		supplier.Cost = updateData.Cost
	}

	if err := h.db.Save(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update supplier"})
		return
	}

	c.JSON(http.StatusOK, supplier)
}

func (h *SupplierHandler) DeleteSupplier(c *gin.Context) {
	id := c.Param("id")

	if err := h.db.Delete(&models.Supplier{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete supplier"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier deleted"})
}

func (h *SupplierHandler) GetSuppliers(c *gin.Context) {
	var suppliers []models.Supplier
	if err := h.db.Find(&suppliers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suppliers"})
		return
	}

	c.JSON(http.StatusOK, suppliers)
}
