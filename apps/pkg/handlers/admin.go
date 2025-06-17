package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type AdminHandler struct {
	DB *gorm.DB
}

func (h *AdminHandler) CreateGenericMedicine(c *gin.Context) {
	var generic models.GenericMedicine
	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Create(&generic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, generic)
}

func (h *AdminHandler) ListGenericMedicines(c *gin.Context) {
	var generics []models.GenericMedicine
	if err := h.DB.Find(&generics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, generics)
}

func (h *AdminHandler) GetGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	var generic models.GenericMedicine
	if err := h.DB.First(&generic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
		return
	}
	c.JSON(http.StatusOK, generic)
}

func (h *AdminHandler) UpdateGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	var generic models.GenericMedicine
	if err := h.DB.First(&generic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
		return
	}

	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Save(&generic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, generic)
}

func (h *AdminHandler) DeleteGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.GenericMedicine{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Generic medicine deleted"})
}

func (h *AdminHandler) CreateSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Create(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, supplier)
}

func (h *AdminHandler) ListSuppliers(c *gin.Context) {
	var suppliers []models.Supplier
	if err := h.DB.Find(&suppliers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, suppliers)
}

func (h *AdminHandler) GetSupplier(c *gin.Context) {
	id := c.Param("id")
	var supplier models.Supplier
	if err := h.DB.First(&supplier, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}
	c.JSON(http.StatusOK, supplier)
}

func (h *AdminHandler) UpdateSupplier(c *gin.Context) {
	id := c.Param("id")
	var supplier models.Supplier
	if err := h.DB.First(&supplier, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}

	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Save(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, supplier)
}

func (h *AdminHandler) DeleteSupplier(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.Supplier{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Supplier deleted"})
}

func (h *AdminHandler) GetTax(c *gin.Context) {
	var tax models.Tax
	if err := h.DB.First(&tax).Error; err != nil {
		// Return default tax if not set
		c.JSON(http.StatusOK, models.Tax{VAT: 0.18}) // 18% default VAT
		return
	}
	c.JSON(http.StatusOK, tax)
}

func (h *AdminHandler) UpdateTax(c *gin.Context) {
	var tax models.Tax
	if err := c.ShouldBindJSON(&tax); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure only one tax record exists
	h.DB.Where("1=1").Delete(&models.Tax{})
	
	if err := h.DB.Create(&tax).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tax)
}

func (h *AdminHandler) AddMedicine(c *gin.Context) {
	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate existence of generic medicine
	var generic models.GenericMedicine
	if err := h.DB.First(&generic, medicine.GenericID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid generic medicine ID"})
		return
	}

	// Validate existence of supplier
	var supplier models.Supplier
	if err := h.DB.First(&supplier, medicine.SupplierID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid supplier ID"})
		return
	}

	if err := h.DB.Create(&medicine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create inventory log
	inventoryLog := models.InventoryLog{
		MedicineID:   medicine.ID,
		ChangeAmount: medicine.QuantityInPieces,
		NewQuantity:  medicine.QuantityInPieces,
		ChangeType:   "STOCK_ADD",
		ChangeReason: "Initial stock",
	}
	h.DB.Create(&inventoryLog)

	c.JSON(http.StatusCreated, medicine)
}

func (h *AdminHandler) ListMedicines(c *gin.Context) {
	var medicines []models.Medicine
	query := h.DB.Preload("Generic").Preload("Supplier")
	
	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}
	
	if err := query.Find(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, medicines)
}

func (h *AdminHandler) UpdateMedicine(c *gin.Context) {
	id := c.Param("id")
	var medicine models.Medicine
	if err := h.DB.Preload("Generic").First(&medicine, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Capture old quantity for inventory log
	oldQuantity := medicine.QuantityInPieces

	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Calculate quantity change
	quantityChange := medicine.QuantityInPieces - oldQuantity

	if err := h.DB.Save(&medicine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create inventory log if quantity changed
	if quantityChange != 0 {
		inventoryLog := models.InventoryLog{
			MedicineID:   medicine.ID,
			ChangeAmount: quantityChange,
			NewQuantity:  medicine.QuantityInPieces,
			ChangeType:   "STOCK_ADJUST",
			ChangeReason: "Manual adjustment",
		}
		h.DB.Create(&inventoryLog)
	}

	c.JSON(http.StatusOK, medicine)
}

func (h *AdminHandler) DeleteMedicine(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.Medicine{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted"})
}

func (h *AdminHandler) GetLowStockMedicines(c *gin.Context) {
	var medicines []models.Medicine
	if err := h.DB.Where("quantity_in_pieces < minimum_threshold").Find(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, medicines)
}

func (h *AdminHandler) ListUsers(c *gin.Context) {
	var users []models.User
	if err := h.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (h *AdminHandler) ListAdmins(c *gin.Context) {
	var admins []models.Admin
	if err := h.DB.Find(&admins).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, admins)
}

func (h *AdminHandler) ListPharmacists(c *gin.Context) {
	var pharmacists []models.Pharmacist
	if err := h.DB.Find(&pharmacists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pharmacists)
}

func (h *AdminHandler) GetUserDetails(c *gin.Context) {
	id := c.Param("id")
	userType := c.Query("type") // "user", "admin", or "pharmacist"

	var result interface{}
	var err error

	switch userType {
	case "user":
		var user models.User
		err = h.DB.First(&user, id).Error
		result = user
	case "admin":
		var admin models.Admin
		err = h.DB.First(&admin, id).Error
		result = admin
	case "pharmacist":
		var pharmacist models.Pharmacist
		err = h.DB.First(&pharmacist, id).Error
		result = pharmacist
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type"})
		return
	}

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *AdminHandler) GetOrderStatistics(c *gin.Context) {
	// Get time range from query params
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	// Base query
	query := h.DB.Model(&models.Order{})

	// Apply date filter if provided
	if startDate != "" && endDate != "" {
		query = query.Where("created_at BETWEEN ? AND ?", startDate, endDate)
	}

	// Get total orders
	var totalOrders int64
	query.Count(&totalOrders)

	// Get total revenue
	var totalRevenue float64
	query.Select("SUM(total_price)").Scan(&totalRevenue)

	// Get orders by status
	var statusStats []struct {
		Status string
		Count  int64
	}
	query.Select("status, COUNT(*) as count").Group("status").Scan(&statusStats)

	// Get top selling medicines
	var topMedicines []struct {
		MedicineID uint
		Name       string
		Quantity   int
	}
	h.DB.Table("cart_items").
		Select("medicine_id, medicines.brand_name as name, SUM(quantity) as quantity").
		Joins("JOIN medicines ON cart_items.medicine_id = medicines.id").
		Group("medicine_id, name").
		Order("quantity DESC").
		Limit(10).
		Scan(&topMedicines)

	c.JSON(http.StatusOK, gin.H{
		"total_orders":   totalOrders,
		"total_revenue":  totalRevenue,
		"orders_by_status": statusStats,
		"top_selling_medicines": topMedicines,
	})
}
