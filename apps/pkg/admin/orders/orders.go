package orders

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
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
			"amount_paid":      payment.AmountPaid,
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
