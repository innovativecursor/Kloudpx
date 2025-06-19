package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

// SupplierHandler handles supplier-related operations
type SupplierHandler struct {
	db *gorm.DB
}

func NewSupplierHandler(db *gorm.DB) *SupplierHandler {
	return &SupplierHandler{db: db}
}

// CreateSupplier creates a new supplier
func (h *SupplierHandler) CreateSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if supplier.SupplierName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Supplier name is required"})
		return
	}

	// Create supplier
	if err := h.db.Create(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create supplier"})
		return
	}

	c.JSON(http.StatusCreated, supplier)
}

// GetSupplier retrieves a specific supplier by ID
func (h *SupplierHandler) GetSupplier(c *gin.Context) {
	id := c.Param("id")
	supplierID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid supplier ID"})
		return
	}

	var supplier models.Supplier
	if err := h.db.Preload("Medicines").First(&supplier, supplierID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch supplier"})
		return
	}

	// Calculate total value of medicines from this supplier
	var totalValue float64
	for _, medicine := range supplier.Medicines {
		totalValue += medicine.SellingPrice * float64(medicine.QuantityInPieces)
	}

	response := struct {
		models.Supplier
		TotalMedicineValue float64 `json:"total_medicine_value"`
		MedicineCount      int     `json:"medicine_count"`
	}{
		Supplier:           supplier,
		TotalMedicineValue: totalValue,
		MedicineCount:      len(supplier.Medicines),
	}

	c.JSON(http.StatusOK, response)
}

// UpdateSupplier updates an existing supplier
func (h *SupplierHandler) UpdateSupplier(c *gin.Context) {
	id := c.Param("id")
	supplierID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid supplier ID"})
		return
	}

	var updateData struct {
		SupplierName     string  `json:"supplier_name"`
		Cost             float64 `json:"cost"`
		DiscountProvided float64 `json:"discount_provided"`
		CostPrice        float64 `json:"cost_price"`
		Taxes            float64 `json:"taxes"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var supplier models.Supplier
	if err := h.db.First(&supplier, supplierID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch supplier"})
		return
	}

	// Update fields
	if updateData.SupplierName != "" {
		supplier.SupplierName = updateData.SupplierName
	}
	if updateData.Cost > 0 {
		supplier.Cost = updateData.Cost
	}
	if updateData.DiscountProvided >= 0 {
		supplier.DiscountProvided = updateData.DiscountProvided
	}
	if updateData.CostPrice > 0 {
		supplier.CostPrice = updateData.CostPrice
	}
	if updateData.Taxes >= 0 {
		supplier.Taxes = updateData.Taxes
	}

	if err := h.db.Save(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update supplier"})
		return
	}

	c.JSON(http.StatusOK, supplier)
}

// DeleteSupplier deletes a supplier
func (h *SupplierHandler) DeleteSupplier(c *gin.Context) {
	id := c.Param("id")
	supplierID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid supplier ID"})
		return
	}

	// Check if supplier has associated medicines
	var medicineCount int64
	h.db.Model(&models.Medicine{}).Where("supplier_id = ?", supplierID).Count(&medicineCount)
	if medicineCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":          "Cannot delete supplier with associated medicines",
			"medicine_count": medicineCount,
		})
		return
	}

	result := h.db.Delete(&models.Supplier{}, supplierID)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete supplier"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier deleted successfully"})
}

// GetSuppliers retrieves a list of suppliers with pagination and filtering
func (h *SupplierHandler) GetSuppliers(c *gin.Context) {
	// Get pagination parameters
	page, pageSize := getPaginationParams(c)
	offset := (page - 1) * pageSize

	// Initialize query
	query := h.db.Model(&models.Supplier{})

	// Apply name filter if provided
	if name := c.Query("name"); name != "" {
		query = query.Where("supplier_name ILIKE ?", "%"+name+"%")
	}

	// Apply min_discount filter
	if minDiscount := c.Query("min_discount"); minDiscount != "" {
		if minDiscountVal, err := strconv.ParseFloat(minDiscount, 64); err == nil {
			query = query.Where("discount_provided >= ?", minDiscountVal)
		}
	}

	// Apply sorting
	sortBy := c.DefaultQuery("sort", "created_at")
	order := c.DefaultQuery("order", "desc")
	query = query.Order(sortBy + " " + order)

	// Execute query
	var suppliers []models.Supplier
	if err := query.Offset(offset).Limit(pageSize).Find(&suppliers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suppliers"})
		return
	}

	// Get total count for pagination
	var totalCount int64
	query.Count(&totalCount)

	// Calculate total pages
	totalPages := (totalCount + int64(pageSize) - 1) / int64(pageSize)

	// Prepare response
	response := struct {
		Suppliers  []models.Supplier `json:"suppliers"`
		Pagination struct {
			Page       int   `json:"page"`
			PageSize   int   `json:"page_size"`
			Total      int64 `json:"total"`
			TotalPages int64 `json:"total_pages"`
		} `json:"pagination"`
	}{
		Suppliers: suppliers,
		Pagination: struct {
			Page       int   `json:"page"`
			PageSize   int   `json:"page_size"`
			Total      int64 `json:"total"`
			TotalPages int64 `json:"total_pages"`
		}{
			Page:       page,
			PageSize:   pageSize,
			Total:      totalCount,
			TotalPages: totalPages,
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
			// Limit page size to prevent abuse
			if psInt > 100 {
				psInt = 100
			}
			pageSize = psInt
		}
	}

	return page, pageSize
}
