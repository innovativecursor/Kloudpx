package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type MedicineHandler struct {
	db *gorm.DB
}

func NewMedicineHandler(db *gorm.DB) *MedicineHandler {
	return &MedicineHandler{db: db}
}

func (h *MedicineHandler) CreateMedicine(c *gin.Context) {
	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&medicine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create medicine"})
		return
	}

	c.JSON(http.StatusCreated, medicine)
}

func (h *MedicineHandler) GetMedicine(c *gin.Context) {
	id := c.Param("id")

	var medicine models.Medicine
	if err := h.db.Preload("Generic").First(&medicine, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, medicine)
}

func (h *MedicineHandler) UpdateMedicine(c *gin.Context) {
	id := c.Param("id")

	var updateData models.Medicine
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var medicine models.Medicine
	if err := h.db.First(&medicine, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Update fields
	if updateData.BrandName != "" {
		medicine.BrandName = updateData.BrandName
	}
	if updateData.QuantityInPieces > 0 {
		medicine.QuantityInPieces = updateData.QuantityInPieces
	}
	if updateData.SellingPrice > 0 {
		medicine.SellingPrice = updateData.SellingPrice
	}

	if err := h.db.Save(&medicine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update medicine"})
		return
	}

	c.JSON(http.StatusOK, medicine)
}

func (h *MedicineHandler) DeleteMedicine(c *gin.Context) {
	id := c.Param("id")

	if err := h.db.Delete(&models.Medicine{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete medicine"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted"})
}

func (h *MedicineHandler) GetMedicines(c *gin.Context) {
	var medicines []models.Medicine
	if err := h.db.Preload("Generic").Find(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	c.JSON(http.StatusOK, medicines)
}

func (h *MedicineHandler) UpdateInventory(c *gin.Context) {
	id := c.Param("id")

	var inventoryUpdate struct {
		QuantityChange int    `json:"quantity_change" binding:"required"`
		Reason         string `json:"reason"`
	}

	if err := c.ShouldBindJSON(&inventoryUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var medicine models.Medicine
	if err := h.db.First(&medicine, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Update quantity
	newQuantity := medicine.QuantityInPieces + inventoryUpdate.QuantityChange
	if newQuantity < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Create inventory log
	log := models.InventoryLog{
		MedicineID:   medicine.ID,
		ChangeAmount: inventoryUpdate.QuantityChange,
		NewQuantity:  newQuantity,
		ChangeType:   "manual",
		ChangeReason: inventoryUpdate.Reason,
	}

	tx := h.db.Begin()
	if err := tx.Model(&medicine).Update("quantity_in_pieces", newQuantity).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update inventory"})
		return
	}

	if err := tx.Create(&log).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create inventory log"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message":      "Inventory updated",
		"new_quantity": newQuantity,
	})
}

func (h *MedicineHandler) SearchMedicines(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query required"})
		return
	}

	var medicines []models.Medicine
	err := h.db.Where("brand_name ILIKE ?", "%"+query+"%").
		Or("description ILIKE ?", "%"+query+"%").
		Preload("Generic").
		Find(&medicines).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
		return
	}

	c.JSON(http.StatusOK, medicines)
}
