package checkoutflow

import (
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/itemscalculation"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/userinfo"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/checkoutflow/config"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func ToggleSaveForLater(c *gin.Context, db *gorm.DB) {
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

	cartID := c.Param("id")
	var cart models.Cart
	if err := db.First(&cart, "id = ? AND user_id = ?", cartID, userObj.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	cart.IsSavedForLater = !cart.IsSavedForLater

	// Clear session link if saving for later
	if cart.IsSavedForLater {
		cart.CheckoutSessionID = nil
	}

	// Re-enable for checkout if marked active again
	// (It will only be picked up in next session if eligible)
	if err := db.Save(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Cart item updated",
		"save_for_later": cart.IsSavedForLater,
	})
}

func SelectClinicAndDoctor(c *gin.Context, db *gorm.DB) {
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

	var req config.SelectClinicDoctorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	updates := map[string]interface{}{}

	// If selecting existing
	if req.HospitalID != nil {
		updates["hospital_id"] = *req.HospitalID
	}
	if req.PhysicianID != nil {
		updates["physician_id"] = *req.PhysicianID
	}

	// If typing new values
	if req.CustomHospital != "" {
		updates["custom_hospital"] = req.CustomHospital
	}
	if req.CustomPhysician != "" {
		updates["custom_physician"] = req.CustomPhysician
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No valid clinic/doctor provided"})
		return
	}

	// Update user cart
	if err := db.Model(&models.Cart{}).
		Where("user_id = ? AND id IN ? AND is_saved_for_later = false", userObj.ID, req.CartIDs).
		Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Clinic/doctor info assigned to cart items",
		"cart_ids": req.CartIDs,
		"updates":  updates,
	})
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

	// Check for existing pending session
	var existingSession models.CheckoutSession
	err := db.Where("user_id = ? AND status = ?", userObj.ID, "pending").First(&existingSession).Error
	sessionExists := err == nil

	// Fetch all active (not saved) cart items — prescription status no longer matters
	var eligibleItems []models.Cart
	if err := db.Preload("Medicine.Generic").
		Preload("Medicine.Category").
		Preload("Medicine.ItemImages").
		Preload("Prescription").
		Where("user_id = ? AND is_saved_for_later = false", userObj.ID).
		Find(&eligibleItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart items"})
		return
	}

	if len(eligibleItems) == 0 && sessionExists {
		// No new items but existing session exists — return session items
		var linkedItems []models.Cart
		if err := db.Preload("Medicine.Generic").
			Preload("Medicine.Category").
			Preload("Medicine.ItemImages").
			Preload("Prescription").
			Where("checkout_session_id = ? AND is_saved_for_later = false", existingSession.ID).
			Find(&linkedItems).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch session items"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message":             "Existing checkout session in progress",
			"checkout_session_id": existingSession.ID,
			"items":               buildCartResponse(linkedItems, db),
		})
		return
	}

	if len(eligibleItems) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No items available for checkout"})
		return
	}

	// Create session if needed
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

	// Link eligible items not already linked
	for i := range eligibleItems {
		if eligibleItems[i].CheckoutSessionID == nil {
			eligibleItems[i].CheckoutSessionID = &session.ID
			if err := db.Save(&eligibleItems[i]).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart items"})
				return
			}
		}
	}

	// Fetch all linked items again
	var finalItems []models.Cart
	if err := db.Preload("Medicine.Generic").
		Preload("Medicine.Category").
		Preload("Medicine.ItemImages").
		Preload("Prescription").
		Where("checkout_session_id = ? AND is_saved_for_later = false", session.ID).
		Find(&finalItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load session cart items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":             "Checkout session initiated",
		"checkout_session_id": session.ID,
		"items":               buildCartResponse(finalItems, db),
	})
}

func buildCartResponse(cartItems []models.Cart, db *gorm.DB) []config.CartResponse {
	var response []config.CartResponse

	for _, item := range cartItems {
		medicine := item.Medicine
		var images []string
		for _, img := range medicine.ItemImages {
			images = append(images, img.FileName)
		}

		prescriptionStatus := "Not Required"
		if medicine.Prescription {
			if item.PrescriptionID == nil {
				prescriptionStatus = "Prescription Not Uploaded"
			} else {
				var pres models.Prescription
				if err := db.First(&pres, *item.PrescriptionID).Error; err == nil {
					switch pres.Status {
					case "fulfilled":
						prescriptionStatus = "Fulfilled"
					case "unsettled":
						prescriptionStatus = "Unsettled"
					case "rejected":
						prescriptionStatus = "Rejected"
					default:
						prescriptionStatus = "Prescription Not Uploaded"
					}
				}
			}
		}

		userMed := config.UserFacingMedicine{
			ID:                        medicine.ID,
			BrandName:                 medicine.BrandName,
			Power:                     medicine.Power,
			GenericName:               medicine.Generic.GenericName,
			Discount:                  medicine.Discount,
			Category:                  medicine.Category.CategoryName,
			Description:               medicine.Description,
			Unit:                      medicine.UnitOfMeasurement,
			MeasurementUnitValue:      medicine.MeasurementUnitValue,
			NumberOfPiecesPerBox:      medicine.NumberOfPiecesPerBox,
			Price:                     medicine.SellingPricePerPiece,
			TaxType:                   medicine.TaxType,
			Prescription:              medicine.Prescription,
			Benefits:                  medicine.Benefits,
			KeyIngredients:            medicine.KeyIngredients,
			RecommendedDailyAllowance: medicine.RecommendedDailyAllowance,
			DirectionsForUse:          medicine.DirectionsForUse,
			SafetyInformation:         medicine.SafetyInformation,
			Storage:                   medicine.Storage,
			Images:                    images,
		}

		response = append(response, config.CartResponse{
			CartID:             item.ID,
			Quantity:           item.Quantity,
			Medicine:           userMed,
			PrescriptionStatus: prescriptionStatus,
		})
	}

	return response
}

func GetAddressTypes(c *gin.Context, db *gorm.DB) {
	var types []models.AddressType
	if err := db.Find(&types).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch address types"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"address_types": types})
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

	// Validate AddressType
	var addrType models.AddressType
	if err := db.First(&addrType, req.AddressTypeID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid address type"})
		return
	}

	// Restrict single instance for Home/School/Office/Partner
	if addrType.TypeName != "Others" {
		var existing models.Address
		if err := db.Where("user_id = ? AND address_type_id = ?", userObj.ID, req.AddressTypeID).First(&existing).Error; err == nil {
			// Already exists
			if req.ID == 0 { // trying to create new
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("%s address already exists. Delete it first before adding new.", addrType.TypeName)})
				return
			}
		}
	}

	// If update
	if req.ID != 0 {
		var addr models.Address
		if err := db.First(&addr, "id = ? AND user_id = ?", req.ID, userObj.ID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
			return
		}
		addr.NameResidency = req.NameResidency
		addr.Region = req.Region
		addr.Province = req.Province
		addr.Barangay = req.Barangay
		addr.City = req.City
		addr.ZipCode = req.ZipCode
		addr.PhoneNumber = req.PhoneNumber
		addr.IsDefault = req.IsDefault
		addr.AddressTypeID = req.AddressTypeID

		if req.IsDefault {
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
		Barangay:      req.Barangay,
		City:          req.City,
		ZipCode:       req.ZipCode,
		PhoneNumber:   req.PhoneNumber,
		IsDefault:     req.IsDefault,
		AddressTypeID: req.AddressTypeID,
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

	phoneMessage := UpdateUserPhoneFromAddress(db, userObj, req.PhoneNumber)

	resp := gin.H{"message": "Address added successfully"}
	if phoneMessage != "" {
		resp["phone_message"] = phoneMessage
	}
	c.JSON(http.StatusOK, resp)
}

func UpdateUserPhoneFromAddress(db *gorm.DB, userObj *models.User, payloadPhone string) (phoneMessage string) {
	if userObj.Phone == nil && payloadPhone != "" {
		var existingUser models.User
		if err := db.Where("phone = ?", payloadPhone).First(&existingUser).Error; err == nil {
			// Phone already exists with another account
			return "Phone number already registered with another account"
		}

		// Safe to update since no duplicate found
		if err := db.Model(&models.User{}).
			Where("id = ?", userObj.ID).
			Updates(map[string]interface{}{"phone": payloadPhone, "phone_verified": true}).Error; err != nil {
			return "Failed to update user phone"
		}
	}
	return ""
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
	if err := db.Where("user_id = ?", userObj.ID).
		Preload("AddressType").
		Find(&addresses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve addresses"})
		return
	}

	// Group addresses by type
	response := gin.H{}
	for _, addr := range addresses {
		switch addr.AddressType.TypeName {
		case "Home":
			response["home_address"] = addr
		case "Office":
			response["office_address"] = addr
		case "School":
			response["school_address"] = addr
		case "Partner":
			response["partner_address"] = addr
		case "Others":
			// allow multiple "Others"
			if _, ok := response["other_addresses"]; !ok {
				response["other_addresses"] = []models.Address{}
			}
			response["other_addresses"] = append(response["other_addresses"].([]models.Address), addr)
		}
	}

	c.JSON(http.StatusOK, response)
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
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	var address models.Address

	if req.AddressID == 0 {
		// Try to fetch default address
		err := db.Where("user_id = ? AND is_default = ?", userObj.ID, true).First(&address).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No default address found. Please select an address manually."})
			return
		}
	} else {
		// Use user-selected address
		err := db.First(&address, "id = ? AND user_id = ?", req.AddressID, userObj.ID).Error
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Selected address not found"})
			return
		}
	}
	var session models.CheckoutSession
	if err := db.Where("user_id = ? AND status = ?", userObj.ID, "pending").
		First(&session).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No active checkout session found"})
		return
	}

	session.AddressID = &address.ID
	if err := db.Save(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update checkout session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Address selected",
		"addressID": address.ID,
	})
}

func DeleteAddress(c *gin.Context, db *gorm.DB) {
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

	// Get address ID from request param
	addressID := c.Param("id")
	if addressID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Address ID is required"})
		return
	}

	var address models.Address
	if err := db.First(&address, "id = ? AND user_id = ?", addressID, userObj.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}

	// Hard delete (permanent)
	if err := db.Unscoped().Delete(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete address"})
		return
	}

	// If deleted address was default, assign another one as default (if any exist)
	if address.IsDefault {
		var newDefault models.Address
		if err := db.Where("user_id = ?", userObj.ID).First(&newDefault).Error; err == nil {
			db.Model(&newDefault).Update("is_default", true)
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Address deleted successfully"})
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

	var session models.CheckoutSession
	if err := db.
		Preload("CartItems.Medicine.Generic").
		Preload("CartItems.Medicine.Supplier").
		Preload("CartItems.Medicine.Category.CategoryIcon").
		Preload("CartItems.Medicine.ItemImages").
		Preload("CartItems.Prescription").
		Where("id = ? AND user_id = ?", dataConfig.CheckoutSessionID, userObj.ID).
		First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Checkout session not found"})
		return
	}

	var address models.Address
	if dataConfig.AddressID == 0 {
		if err := db.Where("user_id = ? AND is_default = ?", userObj.ID, true).First(&address).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No default address found. Please select an address."})
			return
		}
	} else {
		if err := db.First(&address, "id = ? AND user_id = ?", dataConfig.AddressID, userObj.ID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
			return
		}
	}

	region := userinfo.GetRegionInfo(db, address.ZipCode)

	var totalCost float64
	for _, item := range session.CartItems {
		medicine := item.Medicine
		price := medicine.SellingPricePerPiece * float64(item.Quantity)

		if medicine.Discount != "" {
			discountStr := strings.TrimSuffix(medicine.Discount, "%")
			discountVal, err := strconv.ParseFloat(discountStr, 64)
			if err == nil {
				price -= price * discountVal / 100
			}
		}
		totalCost += price
	}

	var pwd models.PwdCard
	pwdFound := true
	pwdMessage := "PWD record found"

	if err := db.Where("user_id = ?", userObj.ID).First(&pwd).Error; err != nil {
		pwdFound = false
		pwdMessage = "No PWD record found"
	}

	deliveryCost := 0
	codFee := 0.0
	pwdDiscount := 0.0
	seniorDiscount := 0.0

	// Apply PWD discount if approved
	if pwdFound && pwd.Status == "approved" {
		pwdDiscount = roundTo2Dec(totalCost * 0.20)
	}

	// Apply senior discount if age >= 60
	if userObj.Age >= 60 {
		seniorDiscount = roundTo2Dec(totalCost * 0.20)
	}

	finalTotal := totalCost - pwdDiscount - seniorDiscount

	switch dataConfig.DeliveryType {
	case "standard":
		if totalCost >= region.FreeShippingLimit {
			// Free delivery
			deliveryCost = 0
			codFee = 0
		} else {
			// Apply standard rate only
			deliveryCost = region.StandardRate
			codFee = 0
		}

	case "priority":
		deliveryCost = 150
		codFee = 0 // No COD fee for priority unless you want to apply it

	case "cod":
		if totalCost >= region.FreeShippingLimit {
			// Fully free if threshold surpassed
			deliveryCost = 0
			codFee = 0
		} else {
			// Apply delivery rate + COD fee
			deliveryCost = region.StandardRate
			codFee = totalCost * 0.0275
		}

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid delivery type"})
		return
	}

	session.AddressID = &address.ID
	session.DeliveryType = dataConfig.DeliveryType
	session.DeliveryCost = deliveryCost + int(codFee)
	session.PwdDiscount = pwdDiscount
	session.SeniorDiscount = seniorDiscount
	session.TotalCost = totalCost
	session.GrandTotal = roundTo2Dec(finalTotal + float64(deliveryCost) + codFee)

	//session.GrandTotal = totalCost + float64(deliveryCost) + codFee

	if err := db.Save(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delivery info"})
		return
	}

	var response []config.CartResponse
	for _, item := range session.CartItems {
		medicine := item.Medicine

		var images []string
		for _, img := range medicine.ItemImages {
			images = append(images, img.FileName)
		}

		prescriptionStatus := "Not Required"
		if medicine.Prescription {
			if item.PrescriptionID == nil {
				prescriptionStatus = "Prescription Not Uploaded"
			} else {
				var pres models.Prescription
				if err := db.First(&pres, *item.PrescriptionID).Error; err == nil {
					switch pres.Status {
					case "fulfilled":
						prescriptionStatus = "Fulfilled"
					case "unsettled":
						prescriptionStatus = "Unsettled"
					case "rejected":
						prescriptionStatus = "Rejected"
					default:
						prescriptionStatus = "Prescription Not Uploaded"
					}
				}
			}
		}

		userMed := config.UserFacingMedicine{
			ID:                        medicine.ID,
			BrandName:                 medicine.BrandName,
			Power:                     medicine.Power,
			GenericName:               medicine.Generic.GenericName,
			Discount:                  medicine.Discount,
			Category:                  medicine.Category.CategoryName,
			Description:               medicine.Description,
			Unit:                      medicine.UnitOfMeasurement,
			MeasurementUnitValue:      medicine.MeasurementUnitValue,
			NumberOfPiecesPerBox:      medicine.NumberOfPiecesPerBox,
			Price:                     medicine.SellingPricePerPiece,
			TaxType:                   medicine.TaxType,
			Prescription:              medicine.Prescription,
			Benefits:                  medicine.Benefits,
			KeyIngredients:            medicine.KeyIngredients,
			RecommendedDailyAllowance: medicine.RecommendedDailyAllowance,
			DirectionsForUse:          medicine.DirectionsForUse,
			SafetyInformation:         medicine.SafetyInformation,
			Storage:                   medicine.Storage,
			Images:                    images,
		}

		response = append(response, config.CartResponse{
			CartID:             item.ID,
			Quantity:           item.Quantity,
			Medicine:           userMed,
			PrescriptionStatus: prescriptionStatus,
		})
	}

	grandTotal := roundTo2Dec(finalTotal + float64(deliveryCost) + codFee)

	c.JSON(http.StatusOK, gin.H{
		"message":             "Delivery type selected successfully",
		"pwd_message":         pwdMessage,
		"delivery_cost":       deliveryCost,
		"cod_fee":             codFee,
		"delivery_type":       session.DeliveryType,
		"delivery_time":       region.DeliveryTime,
		"checkout_session_id": session.ID,
		"address":             address,
		"cart_items":          response,
		"total_price":         totalCost,
		"pwd_discount":        pwdDiscount,
		"senior_discount":     seniorDiscount,
		"grand_total":         grandTotal,
	})
}

// helper to round float to 2 decimals
func roundTo2Dec(val float64) float64 {
	return math.Round(val*100) / 100
}

func SelectPaymentType(c *gin.Context, db *gorm.DB) {
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

	var req config.ReqPaymentType
	if err := c.ShouldBindJSON(&req); err != nil || req.CheckoutSessionID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Fetch checkout session
	var session models.CheckoutSession
	if err := db.
		Preload("CartItems.Medicine").
		Where("id = ? AND user_id = ?", req.CheckoutSessionID, userObj.ID).
		First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Checkout session not found"})
		return
	}

	// Fetch delivery address
	var address models.Address
	if err := db.First(&address, session.AddressID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch delivery address"})
		return
	}
	fullAddress := fmt.Sprintf("%s, %s, %s, %s, %s",
		address.NameResidency, address.Barangay, address.City, address.Province, address.ZipCode)

	//grandTotal := session.TotalCost + float64(session.DeliveryCost)
	grandTotal := session.GrandTotal

	// Fetch cart items
	var orderedItems []models.Cart
	if err := db.Preload("Medicine").
		Where("checkout_session_id = ? AND is_saved_for_later = false", session.ID).
		Find(&orderedItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart items"})
		return
	}

	// Deduct stock
	if err := itemscalculation.DeductMedicineStock(db, orderedItems); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to deduct stock: " + err.Error()})
		return
	}

	// Generate order number
	orderNumber := userinfo.GenerateOrderNumber()

	// Create order
	order := models.Order{
		UserID:            userObj.ID,
		CheckoutSessionID: session.ID,
		OrderNumber:       orderNumber,
		TotalAmount:       grandTotal,
		DeliveryAddress:   fullAddress,
		PaymentType:       req.PaymentType,
		DeliveryType:      session.DeliveryType,
		Status:            "processing",
	}
	if err := db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order summary"})
		return
	}

	// Update session
	session.Status = "completed"
	db.Save(&session)

	// Move cart items to history
	for _, item := range orderedItems {
		historyItem := models.CartHistory{
			UserID:            item.UserID,
			PrescriptionID:    item.PrescriptionID,
			MedicineID:        item.MedicineID,
			Quantity:          item.Quantity,
			IsOTC:             item.IsOTC,
			CheckoutSessionID: session.ID,
			IsSavedForLater:   item.IsSavedForLater,
			MedicineStatus:    item.MedicineStatus,
			OrderNumber:       orderNumber,
			HospitalID:        item.HospitalID,
			PhysicianID:       item.PhysicianID,
			CustomHospital:    item.CustomHospital,
			CustomPhysician:   item.CustomPhysician,
		}
		db.Create(&historyItem)
	}

	if err := db.Preload("User").
		Where("order_number = ?", orderNumber).
		First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Build the SMS message for order placement confirmation
	message := fmt.Sprintf(
		"Dear %s,\n\nYour order #%s has been placed successfully.\n\nThank you for shopping with us!\nKloud P&X",
		strings.TrimSpace(order.User.FirstName+" "+order.User.LastName), // customer full name
		order.OrderNumber,
	)
	if err := s3helper.SendSMS(address.PhoneNumber, message); err != nil {
		logrus.WithError(err).Error("Failed to send order status SMS")
	}

	// Clear cart
	db.Where("checkout_session_id = ? AND is_saved_for_later = false", session.ID).
		Delete(&models.Cart{})

	c.JSON(http.StatusOK, gin.H{
		"message":       "Order placed successfully",
		"order_number":  orderNumber,
		"payment_type":  req.PaymentType,
		"grand_total":   grandTotal,
		"order_summary": order,
	})
}

// func SubmitPayment(c *gin.Context, db *gorm.DB) {
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
// 		return
// 	}
// 	userObj, ok := user.(*models.User)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}

// 	var req config.SubmitPaymentRequest
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
// 		return
// 	}

// 	sessionID, _ := strconv.Atoi(req.CheckoutSessionID)
// 	var session models.CheckoutSession
// 	if err := db.First(&session, sessionID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Checkout session not found"})
// 		return
// 	}

// 	// Use stored totals — no recalculation
// 	grandTotal := session.GrandTotal

// 	// Fetch ordered items first
// 	var orderedItems []models.Cart
// 	if err := db.Preload("Medicine").
// 		Where("checkout_session_id = ? AND is_saved_for_later = false", session.ID).
// 		Find(&orderedItems).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart items"})
// 		return
// 	}

// 	// COD payment
// 	if session.DeliveryType == "cod" {
// 		var address models.Address
// 		if err := db.First(&address, session.AddressID).Error; err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch delivery address"})
// 			return
// 		}
// 		fullAddress := fmt.Sprintf("%s, %s, %s, %s, %s",
// 			address.NameResidency, address.Barangay, address.City, address.Province, address.ZipCode)

// 		orderNumber := userinfo.GenerateOrderNumber()

// 		// Deduct stock before creating order
// 		if err := itemscalculation.DeductMedicineStock(db, orderedItems); err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to deduct stock: " + err.Error()})
// 			return
// 		}

// 		order := models.Order{
// 			UserID:            userObj.ID,
// 			CheckoutSessionID: session.ID,
// 			OrderNumber:       orderNumber,
// 			TotalAmount:       grandTotal,
// 			DeliveryAddress:   fullAddress,
// 			DeliveryType:      session.DeliveryType,
// 			Status:            "processing",
// 		}
// 		if err := db.Create(&order).Error; err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order summary"})
// 			return
// 		}

// 		session.Status = "completed"
// 		db.Save(&session)

// 		// Move cart items to history
// 		for _, item := range orderedItems {
// 			historyItem := models.CartHistory{
// 				UserID:            item.UserID,
// 				PrescriptionID:    item.PrescriptionID,
// 				MedicineID:        item.MedicineID,
// 				Quantity:          item.Quantity,
// 				IsOTC:             item.IsOTC,
// 				CheckoutSessionID: session.ID,
// 				IsSavedForLater:   item.IsSavedForLater,
// 				MedicineStatus:    item.MedicineStatus,
// 				OrderNumber:       orderNumber,
// 			}
// 			db.Create(&historyItem)
// 		}

// 		// Clear cart
// 		db.Where("checkout_session_id = ? AND is_saved_for_later = false", session.ID).
// 			Delete(&models.Cart{})

// 		c.JSON(http.StatusOK, gin.H{
// 			"message":      "COD order placed successfully",
// 			"order_number": orderNumber,
// 			"order":        order,
// 		})
// 		return
// 	}

// 	// Online Payment
// 	if req.PaymentNumber == "" && req.ScreenshotBase64 == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Either payment_number or screenshot_base64 must be provided"})
// 		return
// 	}

// 	remark, err := strconv.ParseFloat(req.Remark, 64)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid remark amount"})
// 		return
// 	}

// 	var screenshotURL string
// 	if req.ScreenshotBase64 != "" {
// 		decodedImage, err := base64.StdEncoding.DecodeString(req.ScreenshotBase64)
// 		if err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid base64 image"})
// 			return
// 		}

// 		cfg, _ := cfg.Env()
// 		profileType := "payment"
// 		userType := "user"
// 		uniqueID := s3helper.GenerateUniqueID().String()
// 		userID := fmt.Sprintf("%d", userObj.ID)
// 		imageName := "payment_screenshot"

// 		if err := s3helper.UploadToS3(
// 			c.Request.Context(),
// 			profileType, userType,
// 			cfg.S3.BucketName, uniqueID, userID,
// 			imageName, decodedImage,
// 		); err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
// 			return
// 		}

// 		extension, _ := getfileextension.GetFileExtension(decodedImage)
// 		screenshotURL = fmt.Sprintf(
// 			"https://%s.s3.%s.amazonaws.com/%s/%s/%s/%s/%s.%s",
// 			cfg.S3.BucketName,
// 			cfg.S3.Region,
// 			profileType,
// 			userType,
// 			uniqueID,
// 			userID,
// 			imageName,
// 			extension,
// 		)
// 	}

// 	orderNumber := userinfo.GenerateOrderNumber()

// 	// Deduct stock before creating payment/order
// 	if err := itemscalculation.DeductMedicineStock(db, orderedItems); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to deduct stock: " + err.Error()})
// 		return
// 	}

// 	payment := models.Payment{
// 		UserID:            userObj.ID,
// 		CheckoutSessionID: uint(sessionID),
// 		OrderNumber:       orderNumber,
// 		PaymentNumber:     req.PaymentNumber,
// 		ScreenshotURL:     screenshotURL,
// 		Remark:            remark,
// 		Status:            "Pending",
// 	}
// 	if err := db.Create(&payment).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment"})
// 		return
// 	}

// 	session.Status = "completed"
// 	db.Save(&session)

// 	var address models.Address
// 	if err := db.First(&address, session.AddressID).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch delivery address"})
// 		return
// 	}
// 	fullAddress := fmt.Sprintf("%s, %s, %s, %s, %s",
// 		address.NameResidency, address.Barangay, address.City, address.Province, address.ZipCode)

// 	order := models.Order{
// 		UserID:            userObj.ID,
// 		CheckoutSessionID: session.ID,
// 		OrderNumber:       orderNumber,
// 		TotalAmount:       grandTotal,
// 		DeliveryAddress:   fullAddress,
// 		DeliveryType:      session.DeliveryType,
// 		Status:            "processing",
// 	}
// 	if err := db.Create(&order).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order summary"})
// 		return
// 	}

// 	// Move cart items to history
// 	for _, item := range orderedItems {
// 		historyItem := models.CartHistory{
// 			UserID:            item.UserID,
// 			PrescriptionID:    item.PrescriptionID,
// 			MedicineID:        item.MedicineID,
// 			Quantity:          item.Quantity,
// 			IsOTC:             item.IsOTC,
// 			CheckoutSessionID: session.ID,
// 			IsSavedForLater:   item.IsSavedForLater,
// 			MedicineStatus:    item.MedicineStatus,
// 			OrderNumber:       orderNumber,
// 		}
// 		db.Create(&historyItem)
// 	}

// 	// Clear cart
// 	db.Where("checkout_session_id = ? AND is_saved_for_later = false", session.ID).
// 		Delete(&models.Cart{})

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":       "Payment submitted successfully",
// 		"payment":       payment,
// 		"order_number":  orderNumber,
// 		"order_summary": order,
// 	})
// }

// func PreviewPaymentScreenshot(c *gin.Context, db *gorm.DB) {
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
// 		return
// 	}
// 	_, ok := user.(*models.User)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}
// 	paymentID := c.Param("id")

// 	var payment models.Payment
// 	if err := db.First(&payment, paymentID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"screenshot_url": payment.ScreenshotURL,
// 	})
// }
//done
//done
