package checkoutflow

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/checkoutflow/config"
	"gorm.io/gorm"
)

func ToggleSaveForLater(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	cartID := c.Param("id")

	var cart models.Cart
	if err := db.First(&cart, cartID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	cart.IsSavedForLater = !cart.IsSavedForLater
	db.Save(&cart)

	c.JSON(http.StatusOK, gin.H{"message": "Cart item updated", "save_for_later": cart.IsSavedForLater})
}
func InitiateCheckout(c *gin.Context, db *gorm.DB) {
	// Get authenticated user
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// Check if a pending checkout session already exists
	var existingSession models.CheckoutSession
	err := db.Where("user_id = ? AND status = ?", userObj.ID, "pending").First(&existingSession).Error
	sessionExists := err == nil

	// Fetch eligible cart items not saved for later and not yet linked to a session
	var cartItems []models.Cart
	if err := db.Preload("Medicine").
		Preload("Prescription").
		Where("user_id = ? AND is_saved_for_later = ? AND checkout_session_id IS NULL",
			userObj.ID, false).
		Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart items"})
		return
	}

	var eligibleItems []models.Cart
	for _, item := range cartItems {
		if item.Medicine.Prescription {
			if item.Prescription != nil && item.Prescription.Status == "fulfilled" {
				eligibleItems = append(eligibleItems, item)
			}
		} else {
			eligibleItems = append(eligibleItems, item)
		}
	}

	// If no new eligible items but existing session exists, still allow progression
	if len(eligibleItems) == 0 && sessionExists {
		// Fetch already linked items for the existing session
		var linkedItems []models.Cart
		if err := db.Preload("Medicine").
			Where("checkout_session_id = ?", existingSession.ID).
			Find(&linkedItems).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch session items"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":             "Existing checkout session in progress",
			"checkout_session_id": existingSession.ID,
			"items":               linkedItems,
		})
		return
	}

	// If no eligible items at all (first time), block checkout
	if len(eligibleItems) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No eligible items available for checkout"})
		return
	}

	// Create new session if not found
	session := existingSession
	if !sessionExists {
		session = models.CheckoutSession{
			UserID: userObj.ID,
			Status: "pending",
		}
		if err := db.Create(&session).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create checkout session"})
			return
		}
	}

	// Link eligible items to the session
	for i := range eligibleItems {
		eligibleItems[i].CheckoutSessionID = &session.ID
		if err := db.Save(&eligibleItems[i]).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart items"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message":             "Checkout session initiated",
		"checkout_session_id": session.ID,
		"items":               eligibleItems,
	})
}

func AddOrUpdateAddress(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req config.AddressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid address data"})
		return
	}

	// If address ID is provided, update existing
	if req.ID != 0 {
		var addr models.Address
		if err := db.First(&addr, "id = ? AND user_id = ?", req.ID, userObj.ID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
			return
		}
		addr.NameResidency = req.NameResidency
		addr.Region = req.Region
		addr.Province = req.Province
		addr.City = req.City
		addr.ZipCode = req.ZipCode
		addr.IsDefault = req.IsDefault

		if req.IsDefault {
			// Reset other addresses as non-default
			db.Model(&models.Address{}).
				Where("user_id = ? AND id != ?", userObj.ID, req.ID).
				Update("is_default", false)
		}

		db.Save(&addr)
		c.JSON(http.StatusOK, gin.H{"message": "Address updated"})
		return
	}

	// Create new address
	address := models.Address{
		UserID:        userObj.ID,
		NameResidency: req.NameResidency,
		Region:        req.Region,
		Province:      req.Province,
		City:          req.City,
		ZipCode:       req.ZipCode,
		IsDefault:     req.IsDefault,
	}

	if req.IsDefault {
		db.Model(&models.Address{}).
			Where("user_id = ?", userObj.ID).
			Update("is_default", false)
	}

	if err := db.Create(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save address"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Address added successfully"})
}

func GetUserAddresses(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var addresses []models.Address
	if err := db.Where("user_id = ?", userObj.ID).Preload("User").Find(&addresses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve addresses"})
		return
	}

	c.JSON(http.StatusOK, addresses)
}

func SelectAddressForCheckout(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req config.SelectAddress
	if err := c.ShouldBindJSON(&req); err != nil || req.AddressID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid address ID"})
		return
	}

	var address models.Address
	if err := db.First(&address, "id = ? AND user_id = ?", req.AddressID, userObj.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Address selected",
		"addressID": address.ID,
	})
}

func SelectDeliveryType(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var dataConfig config.ReqDelivery
	if err := c.ShouldBindJSON(&dataConfig); err != nil || dataConfig.CheckoutSessionID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Fetch checkout session with cart items
	var session models.CheckoutSession
	if err := db.
		Preload("CartItems.Medicine.Generic").
		Preload("CartItems.Medicine.Supplier").
		Preload("CartItems.Medicine.Category.CategoryIcon").
		Preload("CartItems.Prescription").
		Where("id = ? AND user_id = ?", dataConfig.CheckoutSessionID, userObj.ID).
		First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Checkout session not found"})
		return
	}

	var address models.Address
	if dataConfig.AddressID == 0 {
		// Use default address
		if err := db.Where("user_id = ? AND is_default = ?", userObj.ID, true).First(&address).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No default address found. Please select an address."})
			return
		}
	} else {
		// Use explicitly selected address
		if err := db.First(&address, "id = ? AND user_id = ?", dataConfig.AddressID, userObj.ID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
			return
		}
	}

	// Determine delivery cost
	var deliveryCost int
	switch dataConfig.DeliveryType {
	case "standard":
		deliveryCost = CalculateStandardDelivery(address.ZipCode)
	case "priority":
		// This can be replaced with actual Lalamove API call
		deliveryCost = 150
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid delivery type"})
		return
	}

	// Update session
	session.AddressID = &address.ID
	session.DeliveryType = dataConfig.DeliveryType
	session.DeliveryCost = deliveryCost

	if err := db.Save(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delivery info"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Delivery type selected successfully",
		"delivery_cost": session.DeliveryCost,
		"delivery_type": session.DeliveryType,
		"cart_items":    session.CartItems,
		"checkout_id":   session.ID,
		"address":       address,
	})
}

func CalculateStandardDelivery(zipCode string) int {
	zip, err := strconv.Atoi(zipCode)
	if err != nil {
		return 100 // default fallback
	}
	switch {
	case zip >= 1000 && zip <= 1749:
		return 85
	case zip >= 2000 && zip <= 5200:
		return 95
	case zip >= 5000 && zip <= 6700:
		return 100
	case zip >= 7000 && zip <= 9800:
		return 105
	default:
		return 100
	}
}
