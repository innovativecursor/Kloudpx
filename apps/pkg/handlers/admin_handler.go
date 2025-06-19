package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type AdminHandler struct {
	db *gorm.DB
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

func (h *AdminHandler) GetProfile(c *gin.Context) {
	adminID := c.MustGet("adminID").(uint)

	var admin models.Admin
	if err := h.db.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	c.JSON(http.StatusOK, admin)
}

func (h *AdminHandler) UpdateProfile(c *gin.Context) {
	adminID := c.MustGet("adminID").(uint)

	var updateData struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var admin models.Admin
	if err := h.db.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	// Update fields
	if updateData.FirstName != "" {
		admin.FirstName = updateData.FirstName
	}
	if updateData.LastName != "" {
		admin.LastName = updateData.LastName
	}
	if updateData.Email != "" {
		admin.Email = updateData.Email
	}

	if err := h.db.Save(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Admin profile updated"})
}

func (h *AdminHandler) GetDashboard(c *gin.Context) {
	// Get dashboard statistics
	var stats struct {
		TotalMedicines int64 `json:"total_medicines"`
		TotalSuppliers int64 `json:"total_suppliers"`
		TotalOrders    int64 `json:"total_orders"`
		LowStockItems  int64 `json:"low_stock_items"`
	}

	h.db.Model(&models.Medicine{}).Count(&stats.TotalMedicines)
	h.db.Model(&models.Supplier{}).Count(&stats.TotalSuppliers)
	h.db.Model(&models.Order{}).Count(&stats.TotalOrders)

	// Count low stock items (example threshold: < 50)
	h.db.Model(&models.Medicine{}).
		Where("quantity_in_pieces < ?", 50).
		Count(&stats.LowStockItems)

	c.JSON(http.StatusOK, stats)
}
