package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

// AdminHandler handles admin-specific operations
type AdminHandler struct {
	db *gorm.DB
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

// GetProfile returns the admin's profile information
func (h *AdminHandler) GetProfile(c *gin.Context) {
	adminID := c.MustGet("adminID").(uint)

	var admin models.Admin
	if err := h.db.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	// Sanitize sensitive data
	response := struct {
		ID            uint       `json:"id"`
		FirstName     string     `json:"first_name"`
		LastName      string     `json:"last_name"`
		Email         string     `json:"email"`
		EmailVerified bool       `json:"email_verified"`
		LastLogin     *time.Time `json:"last_login,omitempty"`
		CreatedAt     time.Time  `json:"created_at"`
	}{
		ID:            admin.ID,
		FirstName:     admin.FirstName,
		LastName:      admin.LastName,
		Email:         admin.Email,
		EmailVerified: admin.EmailVerified,
		LastLogin:     admin.LastLogin,
		CreatedAt:     admin.CreatedAt,
	}

	c.JSON(http.StatusOK, response)
}

// UpdateProfile updates the admin's profile information
func (h *AdminHandler) UpdateProfile(c *gin.Context) {
	adminID := c.MustGet("adminID").(uint)

	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email" binding:"email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var admin models.Admin
	if err := h.db.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	// Check if email is being changed
	if req.Email != admin.Email {
		// Verify new email is not already in use
		var existingAdmin models.Admin
		if err := h.db.Where("email = ?", req.Email).Not("id = ?", adminID).First(&existingAdmin).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
			return
		}
		admin.Email = req.Email
		admin.EmailVerified = false // Reset verification status if email changes
	}

	// Update other fields
	if req.FirstName != "" {
		admin.FirstName = req.FirstName
	}
	if req.LastName != "" {
		admin.LastName = req.LastName
	}

	if err := h.db.Save(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Profile updated successfully",
		"email_verified": admin.EmailVerified,
	})
}

// GetDashboard returns admin dashboard statistics
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

// GetSuppliers returns a list of all suppliers
func (h *AdminHandler) GetSuppliers(c *gin.Context) {
	var suppliers []models.Supplier

	// Apply pagination
	page, pageSize := getPaginationParams(c)
	offset := (page - 1) * pageSize

	// Apply sorting
	sortBy := c.DefaultQuery("sort", "created_at")
	order := c.DefaultQuery("order", "desc")

	// Build query
	query := h.db.Model(&models.Supplier{})

	// Apply search if provided
	if search := c.Query("q"); search != "" {
		query = query.Where("supplier_name ILIKE ?", "%"+search+"%")
	}

	// Execute query
	if err := query.
		Order(sortBy + " " + order).
		Offset(offset).
		Limit(pageSize).
		Find(&suppliers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suppliers"})
		return
	}

	// Get total count for pagination
	var totalCount int64
	query.Count(&totalCount)

	c.JSON(http.StatusOK, gin.H{
		"suppliers": suppliers,
		"pagination": gin.H{
			"page":        page,
			"page_size":   pageSize,
			"total":       totalCount,
			"total_pages": (totalCount + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// GetMedicines returns a list of all medicines with inventory information
func (h *AdminHandler) GetMedicines(c *gin.Context) {
	var medicines []models.MedicineWithGeneric

	// Apply pagination
	page, pageSize := getPaginationParams(c)
	offset := (page - 1) * pageSize

	// Apply sorting
	sortBy := c.DefaultQuery("sort", "created_at")
	order := c.DefaultQuery("order", "desc")

	// Build query
	query := h.db.Model(&models.Medicine{}).
		Joins("JOIN generic_medicines ON generic_medicines.id = medicines.generic_id").
		Select("medicines.*, generic_medicines.name as generic_name")

	// Apply filters
	if category := c.Query("category"); category != "" {
		query = query.Where("medicines.category = ?", category)
	}
	if supplier := c.Query("supplier"); supplier != "" {
		query = query.Where("medicines.supplier = ?", supplier)
	}
	if lowStock := c.Query("low_stock"); lowStock == "true" {
		query = query.Where("medicines.quantity_in_pieces < medicines.minimum_threshold")
	}

	// Apply search if provided
	if search := c.Query("q"); search != "" {
		query = query.Where("medicines.brand_name ILIKE ? OR generic_medicines.name ILIKE ?",
			"%"+search+"%", "%"+search+"%")
	}

	// Execute query
	if err := query.
		Order("medicines." + sortBy + " " + order).
		Offset(offset).
		Limit(pageSize).
		Scan(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	// Get total count for pagination
	var totalCount int64
	query.Count(&totalCount)

	c.JSON(http.StatusOK, gin.H{
		"medicines": medicines,
		"pagination": gin.H{
			"page":        page,
			"page_size":   pageSize,
			"total":       totalCount,
			"total_pages": (totalCount + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// GetInventory returns inventory insights and low stock alerts
func (h *AdminHandler) GetInventory(c *gin.Context) {
	// Get inventory summary
	var summary struct {
		TotalMedicines     int64   `json:"total_medicines"`
		TotalValue         float64 `json:"total_value"`
		OutOfStockCount    int64   `json:"out_of_stock_count"`
		LowStockCount      int64   `json:"low_stock_count"`
		NeedReorderCount   int64   `json:"need_reorder_count"`
		HighInventoryCount int64   `json:"high_inventory_count"`
	}

	// Calculate total medicines
	h.db.Model(&models.Medicine{}).Count(&summary.TotalMedicines)

	// Calculate total inventory value
	h.db.Model(&models.Medicine{}).
		Select("SUM(selling_price * quantity_in_pieces)").
		Scan(&summary.TotalValue)

	// Count out-of-stock items
	h.db.Model(&models.Medicine{}).
		Where("quantity_in_pieces = 0").
		Count(&summary.OutOfStockCount)

	// Count low-stock items (below minimum threshold)
	h.db.Model(&models.Medicine{}).
		Where("quantity_in_pieces > 0 AND quantity_in_pieces < minimum_threshold").
		Count(&summary.LowStockCount)

	// Count items that need reordering (below reorder level)
	h.db.Model(&models.Medicine{}).
		Where("quantity_in_pieces < maximum_threshold * 0.3"). // 30% of max threshold
		Count(&summary.NeedReorderCount)

	// Count high inventory items (above max threshold)
	h.db.Model(&models.Medicine{}).
		Where("quantity_in_pieces > maximum_threshold").
		Count(&summary.HighInventoryCount)

	// Get low stock alerts
	var lowStockItems []models.Medicine
	h.db.Where("quantity_in_pieces < minimum_threshold").
		Order("quantity_in_pieces ASC").
		Limit(20).
		Find(&lowStockItems)

	// Get recent inventory changes
	var recentChanges []models.InventoryLog
	h.db.Order("created_at DESC").
		Limit(20).
		Find(&recentChanges)

	c.JSON(http.StatusOK, gin.H{
		"summary":         summary,
		"low_stock_items": lowStockItems,
		"recent_changes":  recentChanges,
	})
}

// Helper function to get pagination parameters from query string
func getPaginationParams(c *gin.Context) (int, int) {
	page := 1
	if p := c.Query("page"); p != "" {
		if pInt, err := toInt(p); err == nil && pInt > 0 {
			page = pInt
		}
	}

	pageSize := 20
	if ps := c.Query("page_size"); ps != "" {
		if psInt, err := toInt(ps); err == nil && psInt > 0 {
			if psInt > 100 {
				psInt = 100
			}
			pageSize = psInt
		}
	}

	return page, pageSize
}

// Helper function to convert string to int
func toInt(s string) (int, error) {
	var i int
	_, err := fmt.Sscanf(s, "%d", &i)
	return i, err
}