package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type CartHandler struct {
	DB *gorm.DB
}

type AddToCartRequest struct {
	MedicineID uint `json:"medicine_id" binding:"required"`
	Quantity   int  `json:"quantity" binding:"required,min=1"`
}

type PrescriptionUploadRequest struct {
	ImageData []byte `json:"image_data" binding:"required"`
}

func (h *CartHandler) CreateCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Check if user already has an active cart
	var existingCart models.Cart
	if err := h.DB.Where("user_id = ? AND status = 'active'", userID).First(&existingCart).Error; err == nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Using existing active cart",
			"cart_id": existingCart.ID,
		})
		return
	}

	// Create new cart
	cart := models.Cart{
		UserID: userID.(uint),
		Status: "active",
	}

	if err := h.DB.Create(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Cart created successfully",
		"cart_id": cart.ID,
	})
}

func (h *CartHandler) AddToCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	cartID := c.Param("cartID")
	var cart models.Cart
	if err := h.DB.Where("id = ? AND user_id = ?", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found or doesn't belong to user"})
		return
	}

	if cart.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot add to a non-active cart"})
		return
	}

	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check medicine availability
	var medicine models.Medicine
	if err := h.DB.First(&medicine, req.MedicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	if medicine.QuantityInPieces < req.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Check if item already in cart
	var existingItem models.CartItem
	if err := h.DB.Where("cart_id = ? AND medicine_id = ?", cartID, req.MedicineID).First(&existingItem).Error; err == nil {
		// Update existing item
		newQuantity := existingItem.Quantity + req.Quantity
		if medicine.QuantityInPieces < newQuantity {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for additional quantity"})
			return
		}
		
		if err := h.DB.Model(&existingItem).Update("quantity", newQuantity).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "Cart item updated"})
		return
	}

	// Create new cart item
	item := models.CartItem{
		CartID:             cart.ID,
		MedicineID:         req.MedicineID,
		Quantity:           req.Quantity,
		OriginalMedicineID: req.MedicineID,
		Status:             "added",
	}

	if medicine.PrescriptionRequired {
		item.Status = "pending_prescription"
	}

	if err := h.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Item added to cart",
		"item_id": item.ID,
	})
}

func (h *CartHandler) UploadPrescription(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	cartID := c.Param("cartID")
	itemID := c.Param("itemID")

	// Verify cart ownership
	var cart models.Cart
	if err := h.DB.Where("id = ? AND user_id = ?", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Get cart item
	var item models.CartItem
	if err := h.DB.Where("id = ? AND cart_id = ?", itemID, cartID).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found in cart"})
		return
	}

	// Check if prescription is needed
	var medicine models.Medicine
	if err := h.DB.First(&medicine, item.MedicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	if !medicine.PrescriptionRequired {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Prescription not required for this item"})
		return
	}

	var req PrescriptionUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate a simple hash (in real app, use proper hashing)
	hash := fmt.Sprintf("%x", req.ImageData)

	prescription := models.Prescription{
		CartItemID: item.ID,
		ImageData:  req.ImageData,
		Hash:       hash,
	}

	if err := h.DB.Create(&prescription).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save prescription"})
		return
	}

	// Update cart item status
	if err := h.DB.Model(&item).Update("status", "prescription_uploaded").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item status"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Prescription uploaded successfully",
		"status":  "prescription_uploaded",
	})
}

func (h *CartHandler) CheckoutCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	cartID := c.Param("cartID")

	// Get cart with items
	var cart models.Cart
	if err := h.DB.Preload("Items").Where("id = ? AND user_id = ?", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if cart.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is not active"})
		return
	}

	// Validate cart items
	var totalPrice float64
	var items []models.CartItem
	for _, item := range cart.Items {
		// Get medicine details
		var medicine models.Medicine
		if err := h.DB.First(&medicine, item.MedicineID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found: " + err.Error()})
			return
		}

		// Check prescription requirements
		if medicine.PrescriptionRequired && item.Status != "approved" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Prescription not approved for item: " + medicine.BrandName,
			})
			return
		}

		// Check stock
		if medicine.QuantityInPieces < item.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Insufficient stock for: " + medicine.BrandName,
			})
			return
		}

		// Calculate item total
		itemTotal := medicine.SellingPrice * float64(item.Quantity)
		totalPrice += itemTotal
		items = append(items, item)
	}

	// Get current tax rate
	var tax models.Tax
	if err := h.DB.First(&tax).Error; err != nil {
		// Use default tax if not set
		tax.VAT = 0.18 // 18% VAT
	}

	taxAmount := totalPrice * tax.VAT
	totalWithTax := totalPrice + taxAmount

	// Create order
	order := models.Order{
		UserID:     userID.(uint),
		CartID:     cart.ID,
		TotalPrice: totalWithTax,
		TaxValue:   taxAmount,
		Status:     "pending",
	}

	if err := h.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Update cart status
	if err := h.DB.Model(&cart).Update("status", "checked_out").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart status"})
		return
	}

	// Update stock and create inventory logs
	for _, item := range items {
		var medicine models.Medicine
		h.DB.First(&medicine, item.MedicineID)

		newQuantity := medicine.QuantityInPieces - item.Quantity
		if err := h.DB.Model(&medicine).Update("quantity_in_pieces", newQuantity).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stock"})
			return
		}

		// Create inventory log
		log := models.InventoryLog{
			MedicineID:   medicine.ID,
			ChangeAmount: -item.Quantity,
			NewQuantity:  newQuantity,
			ChangeType:   "SALE",
			ChangeReason: "Order #" + fmt.Sprint(order.ID),
		}
		h.DB.Create(&log)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Order created successfully",
		"order_id":       order.ID,
		"total_price":    totalWithTax,
		"tax_amount":     taxAmount,
		"items_processed": len(items),
	})
}

func (h *CartHandler) GetCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	cartID := c.Param("cartID")

	// Get cart with items
	var cart models.Cart
	if err := h.DB.Preload("Items").Where("id = ? AND user_id = ?", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Get detailed item information
	var cartDetails []models.CartItemDetail
	for _, item := range cart.Items {
		var medicine models.Medicine
		if err := h.DB.First(&medicine, item.MedicineID).Error; err != nil {
			continue // Skip if medicine not found
		}

		var generic models.GenericMedicine
		h.DB.First(&generic, medicine.GenericID)

		hasPrescription := false
		if medicine.PrescriptionRequired {
			var prescription models.Prescription
			if err := h.DB.Where("cart_item_id = ?", item.ID).First(&prescription).Error; err == nil {
				hasPrescription = true
			}
		}

		detail := models.CartItemDetail{
			ID:                   item.ID,
			MedicineID:           item.MedicineID,
			MedicineName:         medicine.BrandName,
			GenericName:          generic.Name,
			PrescriptionRequired: medicine.PrescriptionRequired,
			Quantity:             item.Quantity,
			Price:                medicine.SellingPrice,
			Status:               item.Status,
			HasPrescription:      hasPrescription,
		}

		cartDetails = append(cartDetails, detail)
	}

	// Calculate total
	var total float64
	for _, item := range cartDetails {
		total += item.Price * float64(item.Quantity)
	}

	response := models.CartResponse{
		CartID: cart.ID,
		Status: cart.Status,
		Items:  cartDetails,
		Total:  total,
	}

	c.JSON(http.StatusOK, response)
}

func (h *CartHandler) ConfirmCart(c *gin.Context) {
	// This would typically be called by a pharmacist after reviewing prescriptions
	// For this implementation, we'll assume it's called by the pharmacist role

	cartID := c.Param("cartID")

	// Get cart with items
	var cart models.Cart
	if err := h.DB.Preload("Items").Where("id = ?", cartID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if cart.Status != "prescription_pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is not in prescription pending state"})
		return
	}

	// Approve all prescription items
	for _, item := range cart.Items {
		if item.Status == "prescription_uploaded" {
			// Check if prescription exists
			var prescription models.Prescription
			if err := h.DB.Where("cart_item_id = ?", item.ID).First(&prescription).Error; err != nil {
				continue // Skip if no prescription
			}

			// Update item status to approved
			if err := h.DB.Model(&item).Update("status", "approved").Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve item"})
				return
			}
		}
	}

	// Update cart status
	if err := h.DB.Model(&cart).Update("status", "confirmed").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cart confirmed successfully",
		"cart_id": cart.ID,
	})
}