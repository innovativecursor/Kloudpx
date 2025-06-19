package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type OrderHandler struct {
	db *gorm.DB
}

func NewOrderHandler(db *gorm.DB) *OrderHandler {
	return &OrderHandler{db: db}
}

// CreateOrder creates a new order from a cart (typically called during checkout)
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var req struct {
		CartID uint `json:"cart_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get cart with items
	var cart models.Cart
	if err := h.db.Preload("Items").Where("id = ? AND user_id = ?", req.CartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Process order creation (similar to cart checkout)
	order, err := h.processOrderFromCart(userID, cart)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, order)
}

// GetOrder retrieves order details
func (h *OrderHandler) GetOrder(c *gin.Context) {
	orderID := c.Param("id")
	userID := c.MustGet("userID").(uint)

	var order models.Order
	if err := h.db.Preload("Items").Preload("Items.Medicine").
		Where("id = ? AND user_id = ?", orderID, userID).
		First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Prepare detailed response
	var orderItems []models.OrderItemDetail
	var total float64

	for _, item := range order.Items {
		var medicine models.Medicine
		if err := h.db.First(&medicine, item.MedicineID).Error; err != nil {
			continue // Skip if medicine not found
		}

		// Get generic name
		var generic models.GenericMedicine
		genericName := ""
		if err := h.db.First(&generic, medicine.GenericID).Error; err == nil {
			genericName = generic.Name
		}

		orderItems = append(orderItems, models.OrderItemDetail{
			ID:           item.ID,
			MedicineID:   medicine.ID,
			MedicineName: medicine.BrandName,
			GenericName:  genericName,
			Quantity:     item.Quantity,
			UnitPrice:    item.UnitPrice,
			TotalPrice:   item.TotalPrice,
			Status:       item.Status,
		})

		total += item.TotalPrice
	}

	response := models.OrderDetails{
		OrderID:   order.ID,
		UserID:    order.UserID,
		Status:    order.Status,
		Total:     total,
		CreatedAt: order.CreatedAt,
		UpdatedAt: order.UpdatedAt,
		Items:     orderItems,
	}

	c.JSON(http.StatusOK, response)
}

// UpdateOrderStatus updates the status of an order
func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	orderID := c.Param("id")
	userID := c.MustGet("userID").(uint)

	var req struct {
		Status string `json:"status" binding:"required,oneof=pending processing shipped delivered cancelled"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find order
	var order models.Order
	if err := h.db.Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Validate status transition
	if !isValidStatusTransition(order.Status, req.Status) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":      "Invalid status transition",
			"current":    order.Status,
			"requested":  req.Status,
			"allowed_to": getAllowedTransitions(order.Status),
		})
		return
	}

	// Handle cancellations - restock items
	if req.Status == "cancelled" && order.Status != "cancelled" {
		if err := h.restockOrderItems(order.ID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restock items: " + err.Error()})
			return
		}
	}

	// Update status
	if err := h.db.Model(&order).Update("status", req.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}

	// Update order items status if needed
	if req.Status == "shipped" || req.Status == "delivered" {
		newItemStatus := "shipped"
		if req.Status == "delivered" {
			newItemStatus = "delivered"
		}

		h.db.Model(&models.OrderItem{}).
			Where("order_id = ?", order.ID).
			Update("status", newItemStatus)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Order status updated",
		"order_id":   order.ID,
		"new_status": req.Status,
	})
}

// GetUserOrders retrieves all orders for a specific user
func (h *OrderHandler) GetUserOrders(c *gin.Context) {
	userIDParam := c.Param("userId")
	requestingUserID := c.MustGet("userID").(uint)

	// Convert and validate user ID
	userID, err := strconv.ParseUint(userIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Users can only view their own orders
	if uint(userID) != requestingUserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to view these orders"})
		return
	}

	// Get pagination parameters
	page, pageSize := getPaginationParams(c)
	offset := (page - 1) * pageSize

	// Build query
	query := h.db.Model(&models.Order{}).
		Where("user_id = ?", userID).
		Order("created_at DESC")

	// Apply status filter if provided
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	// Apply date range filter
	if startDate := c.Query("start_date"); startDate != "" {
		if endDate := c.Query("end_date"); endDate != "" {
			query = query.Where("created_at BETWEEN ? AND ?", startDate, endDate)
		}
	}

	// Execute query
	var orders []models.Order
	if err := query.Offset(offset).Limit(pageSize).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	// Get total count
	var totalCount int64
	query.Count(&totalCount)

	// Prepare simplified response
	var orderSummaries []models.OrderSummary
	for _, order := range orders {
		orderSummaries = append(orderSummaries, models.OrderSummary{
			ID:        order.ID,
			Status:    order.Status,
			Total:     order.TotalPrice,
			CreatedAt: order.CreatedAt,
		})
	}

	response := struct {
		Orders     []models.OrderSummary `json:"orders"`
		Pagination struct {
			Page       int   `json:"page"`
			PageSize   int   `json:"page_size"`
			Total      int64 `json:"total"`
			TotalPages int64 `json:"total_pages"`
		} `json:"pagination"`
	}{
		Orders: orderSummaries,
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

// CreateDirectOrder creates an order without going through a cart
func (h *OrderHandler) CreateDirectOrder(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var req struct {
		Items []struct {
			MedicineID uint `json:"medicine_id" binding:"required"`
			Quantity   int  `json:"quantity" binding:"required,min=1"`
		} `json:"items" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Start transaction
	tx := h.db.Begin()

	// Create order
	order := models.Order{
		UserID:     userID,
		Status:     "processing",
		TotalPrice: 0,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Process items
	var orderItems []models.OrderItem
	var orderTotal float64

	for _, item := range req.Items {
		// Get medicine
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
			// In a real system, we would check for prescription here
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Prescription required for " + medicine.BrandName})
			return
		}

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
			ChangeType:   "direct_sale",
			ChangeReason: "Direct order",
		}
		if err := tx.Create(&log).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create inventory log"})
			return
		}

		// Create order item
		orderItem := models.OrderItem{
			OrderID:    order.ID,
			MedicineID: medicine.ID,
			Quantity:   item.Quantity,
			UnitPrice:  medicine.SellingPrice,
			TotalPrice: itemTotal,
			Status:     "processing",
		}
		orderItems = append(orderItems, orderItem)
	}

	// Update order total
	if err := tx.Model(&order).Update("total_price", orderTotal).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order total"})
		return
	}

	// Save order items
	for _, item := range orderItems {
		if err := tx.Create(&item).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order items"})
			return
		}
	}

	// Commit transaction
	tx.Commit()

	// Prepare response
	orderResponse := struct {
		OrderID   uint               `json:"order_id"`
		Status    string             `json:"status"`
		Total     float64            `json:"total"`
		Items     []models.OrderItem `json:"items"`
		CreatedAt time.Time          `json:"created_at"`
	}{
		OrderID:   order.ID,
		Status:    order.Status,
		Total:     orderTotal,
		Items:     orderItems,
		CreatedAt: order.CreatedAt,
	}

	c.JSON(http.StatusCreated, orderResponse)
}

// Helper function to process order from cart (similar to cart checkout)
func (h *OrderHandler) processOrderFromCart(userID uint, cart models.Cart) (*models.Order, error) {
	tx := h.db.Begin()

	// Create order
	order := models.Order{
		UserID:     userID,
		CartID:     &cart.ID,
		Status:     "processing",
		TotalPrice: 0,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Process items
	var orderTotal float64
	var orderItems []models.OrderItem

	for _, cartItem := range cart.Items {
		var medicine models.Medicine
		if err := tx.First(&medicine, cartItem.MedicineID).Error; err != nil {
			tx.Rollback()
			return nil, err
		}

		// Calculate item total
		itemTotal := medicine.SellingPrice * float64(cartItem.Quantity)
		orderTotal += itemTotal

		// Reduce stock
		newQuantity := medicine.QuantityInPieces - cartItem.Quantity
		if err := tx.Model(&medicine).Update("quantity_in_pieces", newQuantity).Error; err != nil {
			tx.Rollback()
			return nil, err
		}

		// Create inventory log
		log := models.InventoryLog{
			MedicineID:   medicine.ID,
			ChangeAmount: -cartItem.Quantity,
			NewQuantity:  newQuantity,
			ChangeType:   "sale",
			ChangeReason: "Order from cart",
		}
		if err := tx.Create(&log).Error; err != nil {
			tx.Rollback()
			return nil, err
		}

		// Create order item
		orderItem := models.OrderItem{
			OrderID:    order.ID,
			MedicineID: medicine.ID,
			Quantity:   cartItem.Quantity,
			UnitPrice:  medicine.SellingPrice,
			TotalPrice: itemTotal,
			Status:     "processing",
		}
		orderItems = append(orderItems, orderItem)
	}

	// Update order total
	order.TotalPrice = orderTotal
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Save order items
	for _, item := range orderItems {
		if err := tx.Create(&item).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	// Update cart status
	if err := tx.Model(&cart).Update("status", "completed").Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()

	// Attach items to order for response
	order.Items = orderItems

	return &order, nil
}

// Helper function to restock items when order is cancelled
func (h *OrderHandler) restockOrderItems(orderID uint) error {
	tx := h.db.Begin()

	// Get order items
	var items []models.OrderItem
	if err := tx.Where("order_id = ?", orderID).Find(&items).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Restock each item
	for _, item := range items {
		// Update medicine stock
		result := tx.Exec(`
			UPDATE medicines 
			SET quantity_in_pieces = quantity_in_pieces + ? 
			WHERE id = ?`,
			item.Quantity, item.MedicineID)

		if result.Error != nil {
			tx.Rollback()
			return result.Error
		}

		// Create inventory log
		log := models.InventoryLog{
			MedicineID:   item.MedicineID,
			ChangeAmount: item.Quantity,
			ChangeType:   "restock",
			ChangeReason: "Order cancellation",
		}

		// Get new quantity
		var medicine models.Medicine
		if err := tx.First(&medicine, item.MedicineID).Error; err != nil {
			tx.Rollback()
			return err
		}
		log.NewQuantity = medicine.QuantityInPieces

		if err := tx.Create(&log).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

// Helper function to validate status transitions
func isValidStatusTransition(current, new string) bool {
	validTransitions := map[string][]string{
		"pending":    {"processing", "cancelled"},
		"processing": {"shipped", "cancelled"},
		"shipped":    {"delivered"},
		"delivered":  {},
		"cancelled":  {},
	}

	for _, validStatus := range validTransitions[current] {
		if validStatus == new {
			return true
		}
	}
	return false
}

// Helper function to get allowed transitions
func getAllowedTransitions(current string) []string {
	return map[string][]string{
		"pending":    {"processing", "cancelled"},
		"processing": {"shipped", "cancelled"},
		"shipped":    {"delivered"},
		"delivered":  {},
		"cancelled":  {},
	}[current]
}

// Helper function for pagination
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
