package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type PharmacistHandler struct {
	db *gorm.DB
}

func NewPharmacistHandler(db *gorm.DB) *PharmacistHandler {
	return &PharmacistHandler{db: db}
}

func (h *PharmacistHandler) CreatePharmacist(c *gin.Context) {
	var pharmacist models.Pharmacist
	if err := c.ShouldBindJSON(&pharmacist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&pharmacist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create pharmacist"})
		return
	}

	c.JSON(http.StatusCreated, pharmacist)
}

func (h *PharmacistHandler) GetPharmacist(c *gin.Context) {
	id := c.Param("id")

	var pharmacist models.Pharmacist
	if err := h.db.First(&pharmacist, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pharmacist not found"})
		return
	}

	c.JSON(http.StatusOK, pharmacist)
}

func (h *PharmacistHandler) UpdatePharmacist(c *gin.Context) {
	id := c.Param("id")

	var updateData models.Pharmacist
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var pharmacist models.Pharmacist
	if err := h.db.First(&pharmacist, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pharmacist not found"})
		return
	}

	// Update fields
	if updateData.Name != "" {
		pharmacist.Name = updateData.Name
	}
	if updateData.Email != nil {
		pharmacist.Email = updateData.Email
	}

	if err := h.db.Save(&pharmacist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update pharmacist"})
		return
	}

	c.JSON(http.StatusOK, pharmacist)
}

func (h *PharmacistHandler) DeletePharmacist(c *gin.Context) {
	id := c.Param("id")

	if err := h.db.Delete(&models.Pharmacist{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete pharmacist"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pharmacist deleted"})
}

func (h *PharmacistHandler) GetPharmacists(c *gin.Context) {
	var pharmacists []models.Pharmacist
	if err := h.db.Find(&pharmacists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pharmacists"})
		return
	}

	c.JSON(http.StatusOK, pharmacists)
}
