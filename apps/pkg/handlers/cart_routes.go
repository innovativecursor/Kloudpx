package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type CartHandler struct {
	db *gorm.DB
}

func NewCartHandler(db *gorm.DB) *CartHandler {
	return &CartHandler{db: db}
}

// CreateCart creates a new cart for the authenticated user
func (h *CartHandler) CreateCart(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	cart := models.Cart{
		UserID: userID,
		Status: "active",
	}

	if err := h.db.Create(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
		return
	}

	c.JSON(http.StatusCreated, cart)
}

// AddItem adds an item to a cart
func (h *CartHandler) AddItem(c *gin.Context) {
	cartID := c.Param("id")
	userID := c.MustGet("userID").(uint)

	var item struct {
		MedicineID uint `json:"medicine_id" binding:"required"`
		Quantity   int  `json:"quantity" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify cart belongs to user and is active
	var cart models.Cart
	if err := h.db.Where("id = ? AND user_id = ? AND status = 'active'", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found or not active"})
		return
	}

	// Check medicine exists
	var medicine models.Medicine
	if err := h.db.First(&medicine, item.MedicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Check stock
	if medicine.QuantityInPieces < item.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Check if item already exists in cart
	var existingItem models.CartItem
	if err := h.db.Where("cart_id = ? AND medicine_id = ?", cartID, item.MedicineID).First(&existingItem).Error; err == nil {
		// Update existing item quantity
		newQuantity := existingItem.Quantity + item.Quantity
		if medicine.QuantityInPieces < newQuantity {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for additional quantity"})
			return
		}

		if err := h.db.Model(&existingItem).Update("quantity", newQuantity).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
			return
		}

		c.JSON(http.StatusOK, existingItem)
		return
	}

	// Create new cart item
	cartItem := models.CartItem{
		CartID:             cart.ID,
		MedicineID:         item.MedicineID,
		Quantity:           item.Quantity,
		Status:             "pending",
		OriginalMedicineID: item.MedicineID, // Store original medicine ID
	}

	if err := h.db.Create(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
		return
	}

	c.JSON(http.StatusCreated, cartItem)
}

// UpdateItem updates the quantity of a cart item
func (h *CartHandler) UpdateItem(c *gin.Context) {
	itemID := c.Param("itemId")
	userID := c.MustGet("userID").(uint)

	var update struct {
		Quantity int `json:"quantity" binding:"required,min=0"`
	}

	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find cart item
	var cartItem models.CartItem
	if err := h.db.Preload("Cart").First(&cartItem, itemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	// Verify cart belongs to user
	if cartItem.Cart.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to modify this cart"})
		return
	}

	// Verify cart is active
	if cartItem.Cart.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is not active"})
		return
	}

	// If quantity is 0, remove the item
	if update.Quantity == 0 {
		if err := h.db.Delete(&cartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Item removed from cart"})
		return
	}

	// Check medicine stock
	var medicine models.Medicine
	if err := h.db.First(&medicine, cartItem.MedicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	if medicine.QuantityInPieces < update.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Update quantity
	if err := h.db.Model(&cartItem).Update("quantity", update.Quantity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item quantity"})
		return
	}

	c.JSON(http.StatusOK, cartItem)
}

// RemoveItem removes an item from the cart
func (h *CartHandler) RemoveItem(c *gin.Context) {
	itemID := c.Param("itemId")
	userID := c.MustGet("userID").(uint)

	// Find cart item
	var cartItem models.CartItem
	if err := h.db.Preload("Cart").First(&cartItem, itemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	// Verify cart belongs to user
	if cartItem.Cart.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to modify this cart"})
		return
	}

	// Delete item
	if err := h.db.Delete(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed from cart"})
}

// GetCart retrieves cart details with items
func (h *CartHandler) GetCart(c *gin.Context) {
	cartID := c.Param("id")
	userID := c.MustGet("userID").(uint)

	// Get cart with items
	var cart models.Cart
	if err := h.db.Preload("Items").Where("id = ? AND user_id = ?", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Prepare detailed response
	var cartItems []models.CartItemDetail
	var total float64
	var prescriptionRequired bool

	for _, item := range cart.Items {
		var medicine models.Medicine
		if err := h.db.First(&medicine, item.MedicineID).Error; err != nil {
			// If medicine not found, skip it
			continue
		}

		// Check if any item requires prescription
		if medicine.PrescriptionRequired {
			prescriptionRequired = true
		}

		// Check if prescription exists for this item
		var prescription models.Prescription
		hasPrescription := h.db.Where("cart_item_id = ?", item.ID).First(&prescription).Error == nil

		// Get generic name
		var generic models.GenericMedicine
		genericName := ""
		if err := h.db.First(&generic, medicine.GenericID).Error; err == nil {
			genericName = generic.Name
		}

		// Calculate item total
		itemTotal := medicine.SellingPrice * float64(item.Quantity)

		cartItems = append(cartItems, models.CartItemDetail{
			ID:                   item.ID,
			MedicineID:           medicine.ID,
			MedicineName:         medicine.BrandName,
			GenericName:          genericName,
			PrescriptionRequired: medicine.PrescriptionRequired,
			Quantity:             item.Quantity,
			Price:                medicine.SellingPrice,
			Status:               item.Status,
			HasPrescription:      hasPrescription,
			ItemTotal:            itemTotal,
		})

		total += itemTotal
	}

	response := models.CartResponse{
		CartID:               cart.ID,
		Status:               cart.Status,
		Items:                cartItems,
		Total:                total,
		PrescriptionRequired: prescriptionRequired,
	}

	c.JSON(http.StatusOK, response)
}

// CheckoutCart processes the cart and creates an order
func (h *CartHandler) CheckoutCart(c *gin.Context) {
	cartID := c.Param("id")
	userID := c.MustGet("userID").(uint)

	// Get cart with items
	var cart models.Cart
	if err := h.db.Preload("Items").Where("id = ? AND user_id = ? AND status = 'active'", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Active cart not found"})
		return
	}

	// Validate cart can be checked out
	if len(cart.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
		return
	}

	// Start transaction
	tx := h.db.Begin()

	// Verify all items are available and prescriptions are provided
	for _, item := range cart.Items {
		var medicine models.Medicine
		if err := tx.First(&medicine, item.MedicineID).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found: " + strconv.Itoa(int(item.MedicineID))})
			return
		}

		// Check stock
		if medicine.QuantityInPieces < item.Quantity {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for " + medicine.BrandName})
			return
		}

		// Check prescription requirement
		if medicine.PrescriptionRequired {
			var prescription models.Prescription
			if err := tx.Where("cart_item_id = ?", item.ID).First(&prescription).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, gin.H{"error": "Prescription required for " + medicine.BrandName})
				return
			}
		}
	}

	// Create order
	order := models.Order{
		UserID: userID,
		CartID: cart.ID,
		Status: "processing",
	}

	// Calculate total and process items
	var orderTotal float64
	var orderItems []models.OrderItem

	for _, item := range cart.Items {
		var medicine models.Medicine
		tx.First(&medicine, item.MedicineID)

		// Calculate item total
		itemTotal := medicine.SellingPrice * float64(item.Quantity)
		orderTotal += itemTotal

		// Reduce stock
		newQuantity := medicine.QuantityInPieces - item.Quantity
		if err := tx.Model(&medicine).Update("quantity_in_pieces", newQuantity).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update inventory"})
			return
		}

		// Create inventory log
		log := models.InventoryLog{
			MedicineID:   medicine.ID,
			ChangeAmount: -item.Quantity,
			NewQuantity:  newQuantity,
			ChangeType:   "sale",
			ChangeReason: "Order from cart checkout",
		}
		if err := tx.Create(&log).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create inventory log"})
			return
		}

		// Create order item record
		orderItem := models.OrderItem{
			OrderID:    order.ID,
			MedicineID: medicine.ID,
			Quantity:   item.Quantity,
			UnitPrice:  medicine.SellingPrice,
			TotalPrice: itemTotal,
		}
		orderItems = append(orderItems, orderItem)
	}

	// Set order total
	order.TotalPrice = orderTotal

	// Save order
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Save order items
	for _, item := range orderItems {
		item.OrderID = order.ID
		if err := tx.Create(&item).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order items"})
			return
		}
	}

	// Update cart status
	if err := tx.Model(&cart).Update("status", "completed").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart status"})
		return
	}

	// Commit transaction
	tx.Commit()

	// Prepare order response
	orderDetails := struct {
		OrderID   uint               `json:"order_id"`
		Total     float64            `json:"total"`
		Status    string             `json:"status"`
		Items     []models.OrderItem `json:"items"`
		CreatedAt time.Time          `json:"created_at"`
	}{
		OrderID:   order.ID,
		Total:     order.TotalPrice,
		Status:    order.Status,
		Items:     orderItems,
		CreatedAt: order.CreatedAt,
	}

	c.JSON(http.StatusCreated, orderDetails)
}
