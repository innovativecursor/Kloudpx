package handlers

import (
	"net/http"

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

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var orderData struct {
		CartID uint `json:"cart_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&orderData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify cart belongs to user
	var cart models.Cart
	if err := h.db.Preload("Items").Where("id = ? AND user_id = ?", orderData.CartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Calculate total
	var total float64
	for _, item := range cart.Items {
		var medicine models.Medicine
		h.db.First(&medicine, item.MedicineID)
		total += medicine.SellingPrice * float64(item.Quantity)
	}

	// Create order
	order := models.Order{
		UserID:     userID,
		CartID:     cart.ID,
		TotalPrice: total,
		Status:     "pending",
	}

	if err := h.db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Update cart status
	h.db.Model(&cart).Update("status", "completed")

	c.JSON(http.StatusCreated, order)
}

func (h *OrderHandler) GetOrder(c *gin.Context) {
	orderID := c.Param("id")
	userID := c.MustGet("userID").(uint)

	var order models.Order
	if err := h.db.Preload("Cart").Preload("Cart.Items").
		Where("id = ? AND user_id = ?", orderID, userID).
		First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func (h *OrderHandler) GetUserOrders(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var orders []models.Order
	if err := h.db.Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}
