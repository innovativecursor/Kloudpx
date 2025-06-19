package handlers

import (
	"net/http"
	"strconv"

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

// CreateMedicine creates a new medicine
func (h *MedicineHandler) CreateMedicine(c *gin.Context) {
	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if medicine.BrandName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Brand name is required"})
		return
	}
	if medicine.GenericID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Generic medicine ID is required"})
		return
	}
	if medicine.SellingPrice <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Selling price must be positive"})
		return
	}
	if medicine.QuantityInPieces < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity cannot be negative"})
		return
	}

	// Check if generic exists
	var generic models.GenericMedicine
	if err := h.db.First(&generic, medicine.GenericID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Generic medicine not found"})
		return
	}

	// Create medicine
	if err := h.db.Create(&medicine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create medicine"})
		return
	}

	// Create inventory log
	log := models.InventoryLog{
		MedicineID:   medicine.ID,
		ChangeAmount: medicine.QuantityInPieces,
		NewQuantity:  medicine.QuantityInPieces,
		ChangeType:   "initial",
		ChangeReason: "New stock",
	}
	h.db.Create(&log)

	c.JSON(http.StatusCreated, medicine)
}

// GetMedicine retrieves a specific medicine by ID
func (h *MedicineHandler) GetMedicine(c *gin.Context) {
	id := c.Param("id")
	medicineID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.MedicineWithGeneric
	result := h.db.Table("medicines").
		Select("medicines.*, generic_medicines.name as generic_name").
		Joins("JOIN generic_medicines ON generic_medicines.id = medicines.generic_id").
		Where("medicines.id = ?", medicineID).
		Scan(&medicine)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Get inventory history
	var history []models.InventoryLog
	h.db.Where("medicine_id = ?", medicineID).
		Order("created_at DESC").
		Limit(10).
		Find(&history)

	response := struct {
		models.MedicineWithGeneric
		InventoryHistory []models.InventoryLog `json:"inventory_history"`
	}{
		MedicineWithGeneric: medicine,
		InventoryHistory:    history,
	}

	c.JSON(http.StatusOK, response)
}

// UpdateMedicine updates an existing medicine
func (h *MedicineHandler) UpdateMedicine(c *gin.Context) {
	id := c.Param("id")
	medicineID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var updateData struct {
		BrandName            *string  `json:"brand_name"`
		GenericID            *uint    `json:"generic_id"`
		Description          *string  `json:"description"`
		Category             *string  `json:"category"`
		QuantityInPieces     *int     `json:"quantity_in_pieces"`
		Supplier             *string  `json:"supplier"`
		PurchasePrice        *float64 `json:"purchase_price"`
		SellingPrice         *float64 `json:"selling_price"`
		TaxType              *string  `json:"tax_type"`
		TaxVAT               *float64 `json:"tax_vat"`
		MinimumThreshold     *int     `json:"minimum_threshold"`
		MaximumThreshold     *int     `json:"maximum_threshold"`
		EstimatedLeadTime    *int     `json:"estimated_lead_time"`
		PrescriptionRequired *bool    `json:"prescription_required"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var medicine models.Medicine
	if err := h.db.First(&medicine, medicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Update fields if provided
	if updateData.BrandName != nil {
		medicine.BrandName = *updateData.BrandName
	}
	if updateData.GenericID != nil {
		// Validate generic exists
		var generic models.GenericMedicine
		if err := h.db.First(&generic, *updateData.GenericID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Generic medicine not found"})
			return
		}
		medicine.GenericID = *updateData.GenericID
	}
	if updateData.Description != nil {
		medicine.Description = *updateData.Description
	}
	if updateData.Category != nil {
		medicine.Category = *updateData.Category
	}
	if updateData.Supplier != nil {
		medicine.Supplier = *updateData.Supplier
	}
	if updateData.PurchasePrice != nil {
		medicine.PurchasePrice = *updateData.PurchasePrice
	}
	if updateData.SellingPrice != nil {
		if *updateData.SellingPrice <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Selling price must be positive"})
			return
		}
		medicine.SellingPrice = *updateData.SellingPrice
	}
	if updateData.TaxType != nil {
		medicine.TaxType = *updateData.TaxType
	}
	if updateData.TaxVAT != nil {
		medicine.TaxVAT = *updateData.TaxVAT
	}
	if updateData.MinimumThreshold != nil {
		medicine.MinimumThreshold = *updateData.MinimumThreshold
	}
	if updateData.MaximumThreshold != nil {
		medicine.MaximumThreshold = *updateData.MaximumThreshold
	}
	if updateData.EstimatedLeadTime != nil {
		medicine.EstimatedLeadTime = *updateData.EstimatedLeadTime
	}
	if updateData.PrescriptionRequired != nil {
		medicine.PrescriptionRequired = *updateData.PrescriptionRequired
	}

	if err := h.db.Save(&medicine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update medicine"})
		return
	}

	c.JSON(http.StatusOK, medicine)
}

// DeleteMedicine deletes a medicine
func (h *MedicineHandler) DeleteMedicine(c *gin.Context) {
	id := c.Param("id")
	medicineID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	// Check if medicine is in any active cart
	var cartItemCount int64
	h.db.Model(&models.CartItem{}).Where("medicine_id = ?", medicineID).Count(&cartItemCount)
	if cartItemCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":           "Cannot delete medicine that is in active carts",
			"cart_item_count": cartItemCount,
		})
		return
	}

	result := h.db.Delete(&models.Medicine{}, medicineID)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete medicine"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}

// GetMedicines retrieves a list of medicines with filtering and pagination
func (h *MedicineHandler) GetMedicines(c *gin.Context) {
	// Get pagination parameters
	page, pageSize := getPaginationParams(c)
	offset := (page - 1) * pageSize

	// Initialize query
	query := h.db.Model(&models.Medicine{}).
		Select("medicines.*, generic_medicines.name as generic_name").
		Joins("JOIN generic_medicines ON generic_medicines.id = medicines.generic_id")

	// Apply filters
	if category := c.Query("category"); category != "" {
		query = query.Where("medicines.category = ?", category)
	}
	if supplier := c.Query("supplier"); supplier != "" {
		query = query.Where("medicines.supplier = ?", supplier)
	}
	if genericID := c.Query("generic_id"); genericID != "" {
		query = query.Where("medicines.generic_id = ?", genericID)
	}
	if prescriptionRequired := c.Query("prescription_required"); prescriptionRequired != "" {
		val, _ := strconv.ParseBool(prescriptionRequired)
		query = query.Where("medicines.prescription_required = ?", val)
	}

	// Apply low stock filter
	if lowStock := c.Query("low_stock"); lowStock == "true" {
		query = query.Where("medicines.quantity_in_pieces < medicines.minimum_threshold")
	}

	// Apply out of stock filter
	if outOfStock := c.Query("out_of_stock"); outOfStock == "true" {
		query = query.Where("medicines.quantity_in_pieces = 0")
	}

	// Apply sorting
	sortBy := c.DefaultQuery("sort", "brand_name")
	order := c.DefaultQuery("order", "asc")
	query = query.Order(sortBy + " " + order)

	// Execute query
	var medicines []models.MedicineWithGeneric
	if err := query.Offset(offset).Limit(pageSize).Find(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	// Get total count for pagination
	var totalCount int64
	query.Count(&totalCount)

	// Prepare response
	response := struct {
		Medicines  []models.MedicineWithGeneric `json:"medicines"`
		Pagination struct {
			Page       int   `json:"page"`
			PageSize   int   `json:"page_size"`
			Total      int64 `json:"total"`
			TotalPages int64 `json:"total_pages"`
		} `json:"pagination"`
	}{
		Medicines: medicines,
		Pagination: struct {
			Page       int   `json:"page"`
			PageSize   int   `json:"page_size"`
			Total      int64 `json:"total"`
			TotalPages int64 `json:"total_pages"`
		}{
			Page:       page,
			PageSize:   pageSize,
			Total:      totalCount,
			TotalPages: (totalCount + int64(pageSize) - 1) / int64(pageSize),
		},
	}

	c.JSON(http.StatusOK, response)
}

// UpdateInventory updates the inventory for a medicine
func (h *MedicineHandler) UpdateInventory(c *gin.Context) {
	id := c.Param("id")
	medicineID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var req struct {
		ChangeAmount int    `json:"change_amount" binding:"required"`
		Reason       string `json:"reason" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get medicine
	var medicine models.Medicine
	if err := h.db.First(&medicine, medicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Calculate new quantity
	newQuantity := medicine.QuantityInPieces + req.ChangeAmount
	if newQuantity < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Start transaction
	tx := h.db.Begin()

	// Update medicine quantity
	if err := tx.Model(&medicine).Update("quantity_in_pieces", newQuantity).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update inventory"})
		return
	}

	// Create inventory log
	log := models.InventoryLog{
		MedicineID:   uint(medicineID),
		ChangeAmount: req.ChangeAmount,
		NewQuantity:  newQuantity,
		ChangeType:   "manual",
		ChangeReason: req.Reason,
	}

	if err := tx.Create(&log).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create inventory log"})
		return
	}

	// Commit transaction
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message":      "Inventory updated",
		"medicine_id":  medicineID,
		"new_quantity": newQuantity,
	})
}

// SearchMedicines searches medicines by brand name, generic name, or description
func (h *MedicineHandler) SearchMedicines(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query required"})
		return
	}

	// Get pagination parameters
	page, pageSize := getPaginationParams(c)
	offset := (page - 1) * pageSize

	// Build search query
	dbQuery := h.db.Model(&models.Medicine{}).
		Select("medicines.*, generic_medicines.name as generic_name").
		Joins("JOIN generic_medicines ON generic_medicines.id = medicines.generic_id").
		Where("medicines.brand_name ILIKE ? OR generic_medicines.name ILIKE ? OR medicines.description ILIKE ?",
			"%"+query+"%", "%"+query+"%", "%"+query+"%").
		Order("medicines.brand_name ASC")

	// Execute query
	var medicines []models.MedicineWithGeneric
	if err := dbQuery.Offset(offset).Limit(pageSize).Find(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
		return
	}

	// Get total count
	var totalCount int64
	dbQuery.Count(&totalCount)

	// Prepare response
	response := struct {
		Results    []models.MedicineWithGeneric `json:"results"`
		Query      string                       `json:"query"`
		Pagination struct {
			Page       int   `json:"page"`
			PageSize   int   `json:"page_size"`
			Total      int64 `json:"total"`
			TotalPages int64 `json:"total_pages"`
		} `json:"pagination"`
	}{
		Results: medicines,
		Query:   query,
		Pagination: struct {
			Page       int   `json:"page"`
			PageSize   int   `json:"page_size"`
			Total      int64 `json:"total"`
			TotalPages int64 `json:"total_pages"`
		}{
			Page:       page,
			PageSize:   pageSize,
			Total:      totalCount,
			TotalPages: (totalCount + int64(pageSize) - 1) / int64(pageSize),
		},
	}

	c.JSON(http.StatusOK, response)
}

// Helper function to get pagination parameters from query string
func getPaginationParams(c *gin.Context) (int, int) {
	page := 1
	if p := c.Query("page"); p != "" {
		if pInt, err := strconv.Atoi(p); err == nil && pInt > 0 {
			page = pInt
		}
	}

	pageSize := 20
	if ps := c.Query("page_size"); ps != "" {
		if psInt, err := strconv.Atoi(ps); err == nil && psInt > 0 {
			if psInt > 100 {
				psInt = 100
			}
			pageSize = psInt
		}
	}

	return page, pageSize
}
