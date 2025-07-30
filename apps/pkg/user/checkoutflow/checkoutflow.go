package checkoutflow

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	cfg "github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/getfileextension"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
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

		var response []config.CartResponse
		for _, item := range linkedItems {
			medicine := item.Medicine

			// Collect all image filenames
			var images []string
			for _, img := range medicine.ItemImages {
				images = append(images, img.FileName)
			}

			// Determine prescription status
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
					} else {
						prescriptionStatus = "Prescription Not Uploaded"
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

		c.JSON(http.StatusOK, gin.H{
			"message":             "Existing checkout session in progress",
			"checkout_session_id": existingSession.ID,
			"items":               response,
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

	var response []config.CartResponse
	for _, item := range eligibleItems {
		medicine := item.Medicine

		// Collect all image filenames
		var images []string
		for _, img := range medicine.ItemImages {
			images = append(images, img.FileName)
		}

		// Determine prescription status
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
				} else {
					prescriptionStatus = "Prescription Not Uploaded"
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

	c.JSON(http.StatusOK, gin.H{
		"message":             "Checkout session initiated",
		"checkout_session_id": session.ID,
		"items":               response,
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
		addr.Barangay = req.Barangay
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
		Barangay:      req.Barangay,
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

	deliveryCost := 0
	codFee := 0.0

	switch dataConfig.DeliveryType {
	case "standard":
		deliveryCost = CalculateStandardDelivery(address.ZipCode)
	case "priority":
		deliveryCost = 150
	case "cod":
		deliveryCost = CalculateStandardDelivery(address.ZipCode)
		codFee = totalCost * 0.0275
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid delivery type"})
		return
	}

	session.AddressID = &address.ID
	session.DeliveryType = dataConfig.DeliveryType
	session.DeliveryCost = deliveryCost + int(codFee)

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

	grandTotal := totalCost + float64(deliveryCost) + codFee

	c.JSON(http.StatusOK, gin.H{
		"message":             "Delivery type selected successfully",
		"delivery_cost":       deliveryCost,
		"cod_fee":             codFee,
		"delivery_type":       session.DeliveryType,
		"checkout_session_id": session.ID,
		"address":             address,
		"cart_items":          response,
		"total_price":         totalCost,
		"grand_total":         grandTotal,
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

func SubmitPayment(c *gin.Context, db *gorm.DB) {
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

	var req config.SubmitPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	amountPaid, err := strconv.ParseFloat(req.AmountPaid, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid amount"})
		return
	}

	decodedImage, err := base64.StdEncoding.DecodeString(req.ScreenshotBase64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid base64 image"})
		return
	}

	cfg, err := cfg.Env()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Configuration error"})
		return
	}

	profileType := "payment"
	userType := "user"
	uniqueID := s3helper.GenerateUniqueID().String()
	userID := fmt.Sprintf("%d", userObj.ID)
	imageName := "payment_screenshot"

	err = s3helper.UploadToS3(
		c.Request.Context(),
		profileType,
		userType,
		cfg.S3.BucketName,
		uniqueID,
		userID,
		imageName,
		decodedImage,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
		return
	}

	extension, _ := getfileextension.GetFileExtension(decodedImage)
	screenshotURL := fmt.Sprintf(
		"https://%s.s3.%s.amazonaws.com/%s/%s/%s/%s/%s.%s",
		cfg.S3.BucketName,
		cfg.S3.Region,
		profileType,
		userType,
		uniqueID,
		userID,
		imageName,
		extension,
	)

	sessionID, _ := strconv.Atoi(req.CheckoutSessionID)
	orderNumber := s3helper.GenerateUniqueID().String()
	payment := models.Payment{
		UserID:            userObj.ID,
		CheckoutSessionID: uint(sessionID),
		OrderNumber:       orderNumber,
		PaymentNumber:     req.PaymentNumber,
		ScreenshotURL:     screenshotURL,
		AmountPaid:        amountPaid,
		Status:            "Pending",
	}

	if err := db.Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment submitted successfully",
		"payment": payment,
	})
}

func PreviewPaymentScreenshot(c *gin.Context, db *gorm.DB) {
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
	paymentID := c.Param("id")

	var payment models.Payment
	if err := db.First(&payment, paymentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"screenshot_url": payment.ScreenshotURL,
	})
}
