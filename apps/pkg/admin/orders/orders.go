package orders

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/orders/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func GetAllOrders(c *gin.Context, db *gorm.DB) {
	// Check if the user is admin
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid or unauthorized user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can access order history"})
		return
	}

	// Fetch all orders with related user and payment
	var orders []models.Order
	if err := db.Preload("User").
		Preload("CheckoutSession").
		Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	// Prepare the response
	var orderHistory []gin.H
	for _, order := range orders {
		var payment models.Payment
		err := db.Where("checkout_session_id = ?", order.CheckoutSessionID).First(&payment).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			logrus.WithError(err).Warn("Error fetching payment for order")
			continue
		}

		var user models.User
		if err := db.First(&user, order.UserID).Error; err != nil {
			logrus.WithError(err).Warn("Error fetching user for order")
			continue
		}

		orderHistory = append(orderHistory, gin.H{
			"order_number":     order.OrderNumber,
			"customer_name":    fmt.Sprintf("%s %s", user.FirstName, user.LastName),
			"payment_number":   payment.PaymentNumber,
			"paid_amount":      order.PaidAmount,
			"shipping_number":  order.ShippingNumber,
			"remark":           payment.Remark,
			"delivery_type":    order.DeliveryType,
			"delivery_address": order.DeliveryAddress,
			"status":           order.Status,
			"created_at":       order.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"orders": orderHistory,
	})
}

func GetOrderDetails(c *gin.Context, db *gorm.DB) {
	// Check if the user is admin
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid or unauthorized user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can access order history"})
		return
	}

	orderNumber := c.Param("order_number")

	// Find the order & preload necessary relations
	var order models.Order
	if err := db.Preload("User").
		Preload("CheckoutSession"). // still preload for audit GrandTotal
		Where("order_number = ?", orderNumber).
		First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Get payment info
	var payment models.Payment
	db.Where("checkout_session_id = ?", order.CheckoutSessionID).First(&payment)

	// Get ordered items from CartHistory
	var cartHistory []models.CartHistory
	if err := db.Preload("Medicine").
		Where("order_number = ?", order.OrderNumber).
		Find(&cartHistory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart history"})
		return
	}

	// Build items response without recalculating total
	items := []gin.H{}
	for _, item := range cartHistory {
		items = append(items, gin.H{
			"medicine_name":     item.Medicine.BrandName,
			"quantity":          item.Quantity,
			"price":             item.Medicine.SellingPricePerPiece, // base price per piece
			"pharmacist_status": item.MedicineStatus,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"order_number":     order.OrderNumber,
		"customer_name":    fmt.Sprintf("%s %s", order.User.FirstName, order.User.LastName),
		"items":            items,
		"grand_total":      order.TotalAmount, // locked at order time
		"order_status":     order.Status,
		"paid_amount":      order.PaidAmount,
		"shipping_number":  order.ShippingNumber,
		"payment_number":   payment.PaymentNumber,
		"remark":           payment.Remark,
		"delivery_type":    order.DeliveryType,
		"delivery_address": order.DeliveryAddress,
		"created_at":       order.CreatedAt.Format("2006-01-02 15:04:05"),
	})
}

func UpdateOrderDetails(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user", user).Warn("Unauthorized access: invalid or unauthorized user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can access order history"})
		return
	}
	orderNumber := c.Param("order_number")

	var req config.UpdateOrderDetailsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var order models.Order
	if err := db.Where("order_number = ?", orderNumber).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Update fields
	if req.Status != "" {
		order.Status = req.Status
	}
	if req.PaidAmount > 0 {
		order.PaidAmount = req.PaidAmount
	}
	if req.ShippingNumber != "" {
		order.ShippingNumber = req.ShippingNumber
	}

	if err := db.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
		return
	}

	fullName := order.User.FirstName + order.User.LastName
	// Send SMS notification
	message := fmt.Sprintf(
		"Dear %s,\n\nYour order #%s is now %s.\n\nThank you for shopping with us!\nKloud P&X",
		fullName,
		order.OrderNumber,
		order.Status,
	)
	if err := s3helper.SendSMS(*order.User.Phone, message); err != nil {
		logrus.WithError(err).Error("Failed to send order status SMS")
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order updated successfully"})
}
