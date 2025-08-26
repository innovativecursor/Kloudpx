package useraccount

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/useraccount/config"
	"gorm.io/gorm"
)

// Updating user's profile by user id.
func UpdateUserProfile(c *gin.Context, db *gorm.DB) {
	var updateProfileData config.UpdateProfileInput
	if err := c.ShouldBindJSON(&updateProfileData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDStr := c.Param("id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// split full name into first and last
	names := strings.Fields(updateProfileData.FullName)
	if len(names) > 0 {
		user.FirstName = names[0]
	}
	if len(names) > 1 {
		user.LastName = strings.Join(names[1:], " ")
	}

	// update other fields
	if updateProfileData.Phone != nil {
		user.Phone = updateProfileData.Phone
	}

	// Parse DOB and calculate Age
	dob, err := time.Parse("2006-01-02", updateProfileData.DOB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid DOB format. Use YYYY-MM-DD"})
		return
	}
	user.DOB = updateProfileData.DOB
	user.Age = calculateAge(dob)
	user.Gender = updateProfileData.Gender

	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully", "user": user})
}

// Calculates age from DOB
func calculateAge(dob time.Time) int {
	now := time.Now()
	age := now.Year() - dob.Year()
	if now.YearDay() < dob.YearDay() {
		age--
	}
	return age
}

// Get User current and past prescription history.
func GetUserPrescriptionHistory(c *gin.Context, db *gorm.DB) {
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

	today := time.Now().Truncate(24 * time.Hour)

	// Fetch all prescriptions of this user
	var allPrescriptions []models.Prescription
	if err := db.Where("user_id = ?", userObj.ID).Order("created_at DESC").Find(&allPrescriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch prescriptions"})
		return
	}

	var todayList []map[string]interface{}
	var pastList []map[string]interface{}

	for _, pres := range allPrescriptions {
		var carts []models.Cart
		if err := db.Preload("Medicine.Generic").
			Preload("Medicine.Category").
			Preload("Medicine.ItemImages").
			Where("prescription_id = ?", pres.ID).
			Find(&carts).Error; err != nil {
			continue // Skip if cart lookup fails for a prescription
		}

		var medicines []map[string]interface{}
		for _, cart := range carts {
			medicine := cart.Medicine
			var imageURLs []string
			for _, img := range medicine.ItemImages {
				imageURLs = append(imageURLs, img.FileName)
			}

			medicines = append(medicines, map[string]interface{}{
				"brand_name":            medicine.BrandName,
				"power":                 medicine.Power,
				"generic_name":          medicine.Generic.GenericName,
				"category":              medicine.Category.CategoryName,
				"description":           medicine.Description,
				"images":                imageURLs,
				"quantity":              cart.Quantity,
				"prescription_required": medicine.Prescription,
			})
		}

		entry := map[string]interface{}{
			"id":         pres.ID,
			"image":      pres.UploadedImage,
			"status":     pres.Status,
			"created_at": pres.CreatedAt,
			"medicines":  medicines,
		}

		if pres.CreatedAt.Truncate(24 * time.Hour).Equal(today) {
			todayList = append(todayList, entry)
		} else {
			pastList = append(pastList, entry)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"todays_prescriptions": todayList,
		"past_prescriptions":   pastList,
	})
}

func GetUserOrders(c *gin.Context, db *gorm.DB) {
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

	// Fetch all orders for that user
	var orders []models.Order
	if err := db.Where("user_id = ?", userObj.ID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Prepare the response
	var orderHistory []gin.H
	for _, order := range orders {
		orderHistory = append(orderHistory, gin.H{
			"order_number":    order.OrderNumber,
			"customer_name":   fmt.Sprintf("%s %s", userObj.FirstName, userObj.LastName),
			"shipping_number": order.ShippingNumber,
			"status":          order.Status,
			"created_at":      order.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"orders": orderHistory,
	})
}

func GetUserOrderDetails(c *gin.Context, db *gorm.DB) {
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

	orderNumber := c.Param("order_number")
	// Fetch order with relations
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
		}

		doctorName := "Not selected"
		if item.Physician != nil {
			doctorName = fmt.Sprintf("%s %s", item.Physician.FirstName, item.Physician.LastName)
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
		"phone_number":     address.PhoneNumber,
		"payment_type":     order.PaymentType,
		"created_at":       order.CreatedAt.Format("2006-01-02 15:04:05"),
	})
}
