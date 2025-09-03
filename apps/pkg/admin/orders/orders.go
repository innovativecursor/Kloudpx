package orders

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/orders/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/itemscalculation"
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

		// Fetch address phone number via CheckoutSession.AddressID
		var address models.Address
		if order.CheckoutSession.AddressID != nil {
			_ = db.First(&address, *order.CheckoutSession.AddressID).Error
		}

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
			"phone_number":     address.PhoneNumber,
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
		Preload("CheckoutSession").
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
		Preload("Hospital").
		Preload("Physician").
		Where("order_number = ?", order.OrderNumber).
		Find(&cartHistory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart history"})
		return
	}

	items := make([]gin.H, 0, len(cartHistory))
	// Build items response with safe nil checks
	for _, item := range cartHistory {
		clinicName := "Not selected"
		if item.Hospital != nil {
			clinicName = item.Hospital.Name
		} else if item.CustomHospital != "" {
			clinicName = item.CustomHospital
		}

		doctorName := "Not selected"
		if item.Physician != nil {
			doctorName = fmt.Sprintf("%s %s", item.Physician.FirstName, item.Physician.LastName)
		} else if item.CustomPhysician != "" {
			doctorName = item.CustomPhysician
		}

		itemResp := gin.H{
			"medicine_name": item.Medicine.BrandName,
			"quantity":      item.Quantity,
			"price":         item.Medicine.SellingPricePerPiece,
			//"pharmacist_status": item.MedicineStatus,
			"clinic_name": clinicName,
			"doctor_name": doctorName,
		}
		// only show pharmacist_status if prescription = true
		if item.PrescriptionID != nil {
			itemResp["pharmacist_status"] = item.MedicineStatus
		}

		items = append(items, itemResp)
	}

	// Fetch phone number from Address
	var address models.Address
	if order.CheckoutSession.AddressID != nil {
		_ = db.First(&address, *order.CheckoutSession.AddressID).Error
	}

	// fetching pwd id by user id
	var pwd models.PwdCard
	if err := db.Where("user_id = ?", order.User.ID).First(&pwd).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No default address found. Please select an address."})
	}

	c.JSON(http.StatusOK, gin.H{
		"customer_details": order.User,
		"order_number":     order.OrderNumber,
		"pwd_id":           pwd.ID,
		"items":            items,
		"grand_total":      order.TotalAmount, // locked at order time
		"order_status":     order.Status,
		"paid_amount":      order.PaidAmount,
		"shipping_number":  order.ShippingNumber,
		"payment_number":   payment.PaymentNumber,
		"remark":           payment.Remark,
		"delivery_type":    order.DeliveryType,
		"delivery_address": order.DeliveryAddress,
		"phone_number":     address.PhoneNumber,
		"payment_type":     order.PaymentType,
		"pwd_discount":     order.CheckoutSession.PwdDiscount,
		"senior_discount":  order.CheckoutSession.SeniorDiscount,
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
	if err := db.Preload("User").
		Preload("CheckoutSession").
		Where("order_number = ?", orderNumber).
		First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Update fields
	if req.Status != "" {
		// If order is being canceled, restore stock
		if strings.ToLower(req.Status) == "cancelled" && order.Status != "cancelled" {
			var cartHistory []models.CartHistory
			if err := db.Preload("Medicine").
				Where("order_number = ?", order.OrderNumber).
				Find(&cartHistory).Error; err == nil {

				if err := itemscalculation.RestoreMedicineStock(db, cartHistory); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restore stock: " + err.Error()})
					return
				}
			}
		}
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

	// Fetch address phone number via CheckoutSession.AddressID
	var address models.Address
	if err := db.First(&address, *order.CheckoutSession.AddressID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order address not found"})
	}

	SendOrderUpdateSMS(address.PhoneNumber, order)

	c.JSON(http.StatusOK, gin.H{"message": "Order updated successfully"})
}

// SendOrderUpdateSMS sends an SMS notification to the user whenever an order's status changes.
// It only triggers for specific statuses (processing, shipped, success, cancelled).
// For "success", the status shown to the user is changed to "delivered".
// For "processing" and "shipped", the Delivery ID (ShippingNumber) must be present in the message.
func SendOrderUpdateSMS(phone string, order models.Order) {
	// Allowed SMS statuses
	notifyStatuses := map[string]bool{
		"processing": true,
		"shipped":    true,
		"success":    true,
		"cancelled":  true,
	}
	status := order.Status
	if notifyStatuses[status] {
		fullName := strings.TrimSpace(order.User.FirstName + " " + order.User.LastName)

		orderStatus := order.Status
		if status == "success" {
			orderStatus = "delivered"
		}
		var message string
		if status == "processing" || status == "shipped" {
			message = fmt.Sprintf(
				"Dear %s,\n\nYour order #%s is now %s.\nDelivery ID: %s\n\nThank you for shopping with us!\nKloud P&X",
				fullName,
				order.OrderNumber,
				orderStatus,
				order.ShippingNumber,
			)
		} else {
			message = fmt.Sprintf(
				"Dear %s,\n\nYour order #%s is now %s.\n\nThank you for shopping with us!\nKloud P&X",
				fullName,
				order.OrderNumber,
				orderStatus,
			)
		}

		if err := s3helper.SendSMS(phone, message); err != nil {
			logrus.WithError(err).Error("Failed to send order status SMS")
		}
	}
}
