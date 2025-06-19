package handlers

import (
	"net/http"

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

	// Verify cart belongs to user
	var cart models.Cart
	if err := h.db.Where("id = ? AND user_id = ?", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
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

	cartItem := models.CartItem{
		CartID:     cart.ID,
		MedicineID: item.MedicineID,
		Quantity:   item.Quantity,
		Status:     "pending",
	}

	if err := h.db.Create(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
		return
	}

	c.JSON(http.StatusCreated, cartItem)
}

func (h *CartHandler) GetCart(c *gin.Context) {
	cartID := c.Param("id")
	userID := c.MustGet("userID").(uint)

	var cart models.Cart
	if err := h.db.Preload("Items").
		Where("id = ? AND user_id = ?", cartID, userID).
		First(&cart).Error; err != nil {
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

	c.JSON(http.StatusOK, gin.H{
		"cart":  cart,
		"total": total,
	})
}

func (h *CartHandler) CheckoutCart(c *gin.Context) {
	cartID := c.Param("id")
	userID := c.MustGet("userID").(uint)

	// Verify cart belongs to user
	var cart models.Cart
	if err := h.db.Preload("Items").Where("id = ? AND user_id = ?", cartID, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Process checkout
	// (Implementation would include payment processing, order creation, etc.)
	c.JSON(http.StatusOK, gin.H{"message": "Checkout initiated", "cart_id": cartID})
}
