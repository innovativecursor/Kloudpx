package userflow

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/itemscalculation"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/userflow/config"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// get all medicine, otc for user publically
func GetMedicinesForUser(c *gin.Context, db *gorm.DB) {
	var uniqueMedicineIDs []uint

	// Subquery: Get the first entry (lowest ID) for each unique brand name
	if err := db.
		Model(&models.Medicine{}).
		Select("MIN(id)").
		Group("brand_name, power").
		Scan(&uniqueMedicineIDs).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch distinct medicine IDs by brand name")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var medicines []models.Medicine
	if err := db.Preload("Generic").
		Preload("ItemImages").
		Preload("Category").
		Where("id IN ?", uniqueMedicineIDs).
		Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch medicines by ID list")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var imageFilenames []string
		for _, img := range med.ItemImages {
			imageFilenames = append(imageFilenames, img.FileName)
		}

		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}

		response = append(response, config.UserFacingMedicine{
			ID:                        med.ID,
			BrandName:                 med.BrandName,
			Power:                     med.Power,
			Discount:                  med.Discount,
			GenericName:               med.Generic.GenericName,
			Category:                  med.Category.CategoryName,
			Description:               med.Description,
			Unit:                      med.UnitOfMeasurement,
			MeasurementUnitValue:      med.MeasurementUnitValue,
			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
			Price:                     price,
			TaxType:                   med.TaxType,
			Prescription:              med.Prescription,
			Benefits:                  med.Benefits,
			KeyIngredients:            med.KeyIngredients,
			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
			DirectionsForUse:          med.DirectionsForUse,
			SafetyInformation:         med.SafetyInformation,
			Storage:                   med.Storage,
			Images:                    imageFilenames,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Medicines fetched successfully",
		"medicines": response,
	})
}

func GetAllBrandNames(c *gin.Context, db *gorm.DB) {
	var uniqueMedicineIDs []uint
	var brandNames []string

	if err := db.
		Model(&models.Medicine{}).
		Select("MIN(id)").
		Group("brand_name").
		Scan(&uniqueMedicineIDs).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch distinct medicine IDs by brand name")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch brand names"})
		return
	}
	if err := db.
		Model(&models.Medicine{}).
		Distinct("brand_name").
		Where("id IN ?", uniqueMedicineIDs).
		Order("brand_name ASC").
		Pluck("brand_name", &brandNames).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch brand names")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch brand names"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Brand names fetched successfully",
		"brand_names": brandNames,
	})
}

func GetMedicineDetailsByID(c *gin.Context, db *gorm.DB) {
	medicineIDParam := c.Param("medicine_id")
	medicineID, err := strconv.Atoi(medicineIDParam)
	if err != nil {
		logrus.WithField("param", medicineIDParam).Warn("Invalid medicine ID format")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var med models.Medicine
	if err := db.Preload("Generic").
		Preload("Supplier").
		Preload("ItemImages").
		Preload("Category").
		First(&med, medicineID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		} else {
			logrus.WithError(err).Error("Failed to fetch medicine by ID")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicine"})
		}
		return
	}

	var imageFilenames []string
	for _, img := range med.ItemImages {
		imageFilenames = append(imageFilenames, img.FileName)
	}

	price := med.SellingPricePerBox
	if med.UnitOfMeasurement == "per piece" {
		price = med.SellingPricePerPiece
	}

	response := config.UserFacingMedicine{
		ID:                        med.ID,
		BrandName:                 med.BrandName,
		Power:                     med.Power,
		Discount:                  med.Discount,
		GenericName:               med.Generic.GenericName,
		Category:                  med.Category.CategoryName,
		Description:               med.Description,
		Unit:                      med.UnitOfMeasurement,
		MeasurementUnitValue:      med.MeasurementUnitValue,
		NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
		Price:                     price,
		TaxType:                   med.TaxType,
		Prescription:              med.Prescription,
		Benefits:                  med.Benefits,
		KeyIngredients:            med.KeyIngredients,
		RecommendedDailyAllowance: med.RecommendedDailyAllowance,
		DirectionsForUse:          med.DirectionsForUse,
		SafetyInformation:         med.SafetyInformation,
		Storage:                   med.Storage,
		Images:                    imageFilenames,
	}

	// === Related Medicines Logic ===
	var relatedMedicines []models.Medicine
	if err := db.Preload("Generic").
		Preload("Category").
		Preload("ItemImages").
		Where("category_id = ? AND id != ?", med.CategoryID, med.ID).
		Limit(8).
		Find(&relatedMedicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch related medicines")
	}

	var related []config.UserFacingMedicine
	for _, m := range relatedMedicines {
		var imgs []string
		for _, img := range m.ItemImages {
			imgs = append(imgs, img.FileName)
		}
		p := m.SellingPricePerBox
		if m.UnitOfMeasurement == "per piece" {
			p = m.SellingPricePerPiece
		}
		related = append(related, config.UserFacingMedicine{
			ID:                        m.ID,
			BrandName:                 m.BrandName,
			Power:                     m.Power,
			GenericName:               m.Generic.GenericName,
			Category:                  m.Category.CategoryName,
			Description:               m.Description,
			Discount:                  m.Discount,
			Unit:                      m.UnitOfMeasurement,
			MeasurementUnitValue:      m.MeasurementUnitValue,
			NumberOfPiecesPerBox:      m.NumberOfPiecesPerBox,
			Price:                     p,
			TaxType:                   m.TaxType,
			Prescription:              m.Prescription,
			Benefits:                  m.Benefits,
			KeyIngredients:            m.KeyIngredients,
			RecommendedDailyAllowance: m.RecommendedDailyAllowance,
			DirectionsForUse:          m.DirectionsForUse,
			SafetyInformation:         m.SafetyInformation,
			Storage:                   m.Storage,
			Images:                    imgs,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":           "Medicine details fetched successfully",
		"medicine":          response,
		"related_medicines": related,
	})

}

func GetCurrentUserInfo(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		logrus.Warn("Invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":               userObj.ID,
		"first_name":       userObj.FirstName,
		"last_name":        userObj.LastName,
		"email":            userObj.Email,
		"email_verified":   userObj.EmailVerified,
		"application_role": userObj.ApplicationRole,
		"created_at":       userObj.CreatedAt,
	})
}

func AddToCartOTC(c *gin.Context, db *gorm.DB) {
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

	var req config.AddCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	var medicine models.Medicine
	if err := db.First(&medicine, req.MedicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Reject if the medicine requires a prescription
	if medicine.Prescription {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This medicine requires a prescription. Please upload a prescription before adding to cart."})
		return
	}

	// Check stock
	availableStock, err := itemscalculation.CalculateTotalStockByBrandName(db, medicine.BrandName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Stock check failed"})
		return
	}
	if req.Quantity > availableStock {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock", "available": availableStock})
		return
	}

	// Check for existing OTC cart item
	var existingCart models.Cart
	err = db.Where("user_id = ? AND medicine_id = ? AND is_otc = ?", userObj.ID, req.MedicineID, true).
		First(&existingCart).Error

	if err == nil {
		// Found existing cart entry — update quantity
		existingCart.Quantity += req.Quantity
		if err := db.Save(&existingCart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "OTC medicine quantity updated in cart"})
		return
	}

	entry := models.Cart{
		UserID:     userObj.ID,
		MedicineID: req.MedicineID,
		Quantity:   req.Quantity,
		IsOTC:      true,
	}

	if err := db.Create(&entry).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTC medicine added to cart successfully"})
}

func AddToCartMedicine(c *gin.Context, db *gorm.DB) {
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

	var req config.AddCartRequestMedicine
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Validate medicine
	var medicine models.Medicine
	if err := db.First(&medicine, req.MedicineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Validate prescription
	var prescription models.Prescription
	if err := db.First(&prescription, req.PrescriptionId).Error; err != nil || prescription.UserID != userObj.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or unauthorized prescription ID"})
		return
	}

	// Check stock
	availableStock, err := itemscalculation.CalculateTotalStockByBrandName(db, medicine.BrandName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Stock check failed"})
		return
	}
	if req.Quantity > availableStock {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock", "available": availableStock})
		return
	}

	// Check for existing unsettled cart item for same medicine
	var existingCart models.Cart
	err = db.
		Where("user_id = ? AND medicine_id = ? AND is_otc = ? AND prescription_id IS NOT NULL", userObj.ID, req.MedicineID, false).
		Preload("Prescription").
		First(&existingCart).Error

	if err == nil && existingCart.Prescription != nil && existingCart.Prescription.Status == "unsettled" {
		existingCart.Quantity += req.Quantity
		existingCart.PrescriptionID = &req.PrescriptionId
		if err := db.Save(&existingCart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Cart item updated with new prescription"})
		return
	}

	entry := models.Cart{
		UserID:         userObj.ID,
		MedicineID:     req.MedicineID,
		Quantity:       req.Quantity,
		IsOTC:          !medicine.Prescription,
		PrescriptionID: &req.PrescriptionId,
	}

	if err := db.Create(&entry).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add medicine to cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine added to cart successfully"})
}

func GetUserCart(c *gin.Context, db *gorm.DB) {
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

	var cartItems []models.Cart
	if err := db.
		Preload("Medicine.Generic").
		Preload("Medicine.Category").
		Preload("Medicine.ItemImages").
		Where("user_id = ?", userObj.ID).
		Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart"})
		return
	}

	var response []config.CartResponse
	for _, item := range cartItems {
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

		// Format medicine for user
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

	c.JSON(http.StatusOK, response)
}

func RemoveItemFromCart(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		logrus.Warn("Invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	itemID := c.Param("id")
	var entry models.Cart

	if err := db.Where("id = ? AND user_id = ?", itemID, userObj.ID).First(&entry).Error; err != nil {
		logrus.Warn("Cart item not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	if err := db.Unscoped().Delete(&entry).Error; err != nil {
		logrus.WithError(err).Error("Failed to permanently delete cart item")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item"})
		return
	}

	logrus.Info("Item permanently removed from cart")
	c.JSON(http.StatusOK, gin.H{"message": "Item permanently removed from cart"})
}

func GetAllCategoriesForUser(c *gin.Context, db *gorm.DB) {
	var categories []models.Category
	if err := db.Preload("CategoryIcon").Find(&categories).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch categories from database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Categories fetched successfully",
		"categories": categories,
	})
}

func GetItemsByCategory(c *gin.Context, db *gorm.DB) {
	categoryIDParam := c.Param("category_id")
	categoryID, err := strconv.Atoi(categoryIDParam)
	if err != nil {
		logrus.WithField("param", categoryIDParam).Warn("Invalid category ID format")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var uniqueMedicineIDs []uint

	// Get the first entry (lowest ID) for each unique brand name in the selected category
	if err := db.
		Model(&models.Medicine{}).
		Select("MIN(id)").
		Where("category_id = ?", categoryID).
		Group("brand_name, power").
		Scan(&uniqueMedicineIDs).Error; err != nil {
		logrus.WithError(err).Error("Failed to get distinct medicine IDs by category")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var medicines []models.Medicine
	if err := db.Preload("Generic").
		Preload("Supplier").
		Preload("ItemImages").
		Preload("Category").
		Where("id IN ?", uniqueMedicineIDs).
		Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch distinct medicines by category")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var imageFilenames []string
		for _, img := range med.ItemImages {
			imageFilenames = append(imageFilenames, img.FileName)
		}

		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}

		response = append(response, config.UserFacingMedicine{
			ID:                        med.ID,
			BrandName:                 med.BrandName,
			Power:                     med.Power,
			GenericName:               med.Generic.GenericName,
			Category:                  med.Category.CategoryName,
			Description:               med.Description,
			Discount:                  med.Discount,
			Unit:                      med.UnitOfMeasurement,
			MeasurementUnitValue:      med.MeasurementUnitValue,
			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
			Price:                     price,
			TaxType:                   med.TaxType,
			Prescription:              med.Prescription,
			Benefits:                  med.Benefits,
			KeyIngredients:            med.KeyIngredients,
			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
			DirectionsForUse:          med.DirectionsForUse,
			SafetyInformation:         med.SafetyInformation,
			Storage:                   med.Storage,
			Images:                    imageFilenames,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Medicines fetched successfully by category",
		"medicines": response,
	})
}

func GetAllActiveCarouselImages(c *gin.Context, db *gorm.DB) {
	var images []models.CarouselImage

	// Fetch only active images, optionally you can sort by created_at or position
	if err := db.Where("is_active = ?", true).Find(&images).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch carousel images from DB")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch images"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Carousel images fetched successfully",
		"data":    images,
	})
}

func GetAllActiveGalleryImages(c *gin.Context, db *gorm.DB) {
	var images []models.GalleryImage

	if err := db.Where("is_active = ?", true).Find(&images).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch active gallery images"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Active gallery images fetched successfully",
		"data":    images,
	})
}

func GetBrandedMedicinesForUser(c *gin.Context, db *gorm.DB) {
	var uniqueMedicineIDs []uint

	// Subquery: Get the first entry (lowest ID) for each unique brand name where IsBrand is true
	if err := db.
		Model(&models.Medicine{}).
		Select("MIN(id)").
		Where("is_brand = ?", true).
		Group("brand_name").
		Scan(&uniqueMedicineIDs).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch distinct branded medicine IDs")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch branded medicines"})
		return
	}

	var medicines []models.Medicine
	if err := db.Preload("Generic").
		Preload("ItemImages").
		Preload("Category").
		Where("id IN ?", uniqueMedicineIDs).
		Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch branded medicines by ID list")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch branded medicines"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var imageFilenames []string
		for _, img := range med.ItemImages {
			imageFilenames = append(imageFilenames, img.FileName)
		}

		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}

		response = append(response, config.UserFacingMedicine{
			ID:                        med.ID,
			BrandName:                 med.BrandName,
			Power:                     med.Power,
			GenericName:               med.Generic.GenericName,
			Category:                  med.Category.CategoryName,
			Description:               med.Description,
			Unit:                      med.UnitOfMeasurement,
			MeasurementUnitValue:      med.MeasurementUnitValue,
			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
			Price:                     price,
			TaxType:                   med.TaxType,
			Prescription:              med.Prescription,
			Benefits:                  med.Benefits,
			KeyIngredients:            med.KeyIngredients,
			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
			DirectionsForUse:          med.DirectionsForUse,
			SafetyInformation:         med.SafetyInformation,
			Storage:                   med.Storage,
			Images:                    imageFilenames,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Branded medicines fetched successfully",
		"medicines": response,
	})
}

func GetFeaturedProductForUser(c *gin.Context, db *gorm.DB) {
	var uniqueMedicineIDs []uint

	// Subquery: Get the first (MIN ID) for each unique brand name where IsFeature is true
	if err := db.
		Model(&models.Medicine{}).
		Select("MIN(id)").
		Where("is_feature = ?", true).
		Group("brand_name, power").
		Scan(&uniqueMedicineIDs).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch distinct featured medicine IDs")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch featured medicines"})
		return
	}

	var medicines []models.Medicine
	if err := db.Preload("Generic").
		Preload("ItemImages").
		Preload("Category").
		Where("id IN ?", uniqueMedicineIDs).
		Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch featured medicines by ID list")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch featured medicines"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var imageFilenames []string
		for _, img := range med.ItemImages {
			imageFilenames = append(imageFilenames, img.FileName)
		}

		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}

		response = append(response, config.UserFacingMedicine{
			ID:                        med.ID,
			BrandName:                 med.BrandName,
			Power:                     med.Power,
			GenericName:               med.Generic.GenericName,
			Category:                  med.Category.CategoryName,
			Description:               med.Description,
			Unit:                      med.UnitOfMeasurement,
			MeasurementUnitValue:      med.MeasurementUnitValue,
			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
			Price:                     price,
			TaxType:                   med.TaxType,
			Prescription:              med.Prescription,
			Benefits:                  med.Benefits,
			KeyIngredients:            med.KeyIngredients,
			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
			DirectionsForUse:          med.DirectionsForUse,
			SafetyInformation:         med.SafetyInformation,
			Storage:                   med.Storage,
			Images:                    imageFilenames,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Featured medicines fetched successfully",
		"medicines": response,
	})
}

// two categories
func GetTwoCategoriesWithItems(c *gin.Context, db *gorm.DB) {
	var categories []models.Category
	if err := db.Preload("CategoryIcon").Limit(2).Find(&categories).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch categories")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	var response []config.CategoryWithMedicines

	for _, category := range categories {
		var uniqueMedicineIDs []uint

		err := db.Model(&models.Medicine{}).
			Select("MIN(id)").
			Where("category_id = ?", category.ID).
			Group("brand_name, power").
			Scan(&uniqueMedicineIDs).Error

		if err != nil {
			logrus.WithError(err).Errorf("Failed to fetch medicine IDs for category %d", category.ID)
			continue
		}

		var medicines []models.Medicine
		err = db.Preload("Generic").
			Preload("Supplier").
			Preload("ItemImages").
			Preload("Category").
			Where("id IN ?", uniqueMedicineIDs).
			Find(&medicines).Error

		if err != nil {
			logrus.WithError(err).Errorf("Failed to fetch medicines for category %d", category.ID)
			continue
		}

		var userMedicines []config.UserFacingMedicine
		for _, med := range medicines {
			var imageFilenames []string
			for _, img := range med.ItemImages {
				imageFilenames = append(imageFilenames, img.FileName)
			}

			price := med.SellingPricePerBox
			if med.UnitOfMeasurement == "per piece" {
				price = med.SellingPricePerPiece
			}

			userMedicines = append(userMedicines, config.UserFacingMedicine{
				ID:                        med.ID,
				BrandName:                 med.BrandName,
				Power:                     med.Power,
				GenericName:               med.Generic.GenericName,
				Category:                  med.Category.CategoryName,
				Description:               med.Description,
				Discount:                  med.Discount,
				Unit:                      med.UnitOfMeasurement,
				MeasurementUnitValue:      med.MeasurementUnitValue,
				NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
				Price:                     price,
				TaxType:                   med.TaxType,
				Prescription:              med.Prescription,
				Benefits:                  med.Benefits,
				KeyIngredients:            med.KeyIngredients,
				RecommendedDailyAllowance: med.RecommendedDailyAllowance,
				DirectionsForUse:          med.DirectionsForUse,
				SafetyInformation:         med.SafetyInformation,
				Storage:                   med.Storage,
				Images:                    imageFilenames,
			})
		}

		response = append(response, config.CategoryWithMedicines{
			ID:           category.ID,
			CategoryName: category.CategoryName,
			IconURL:      category.CategoryIcon.Icon,
			Medicines:    userMedicines,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Categories with medicines fetched successfully",
		"categories": response,
	})
}

func SearchMedicinesForUser(c *gin.Context, db *gorm.DB) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	var medicines []models.Medicine
	searchTerm := "%" + query + "%"

	if err := db.Preload("Generic").
		Preload("Category").
		Preload("ItemImages").
		Joins("LEFT JOIN categories ON categories.id = medicines.category_id").
		Joins("LEFT JOIN generics ON generics.id = medicines.generic_id").
		Where(`
			generics.generic_name LIKE ? 
			OR medicines.brand_name LIKE ? 
			OR categories.category_name LIKE ?
		`, searchTerm, searchTerm, searchTerm).
		Order(gorm.Expr(`
			CASE
				WHEN generics.generic_name LIKE ? THEN 1
				WHEN medicines.brand_name LIKE ? THEN 2
				WHEN categories.category_name LIKE ? THEN 3
				ELSE 4
			END
		`, searchTerm, searchTerm, searchTerm)).
		Find(&medicines).Error; err != nil {

		logrus.WithError(err).Error("Failed to search medicines")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search medicines"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var imageFilenames []string
		for _, img := range med.ItemImages {
			imageFilenames = append(imageFilenames, img.FileName)
		}

		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}

		response = append(response, config.UserFacingMedicine{
			ID:                        med.ID,
			BrandName:                 med.BrandName,
			Power:                     med.Power,
			GenericName:               med.Generic.GenericName,
			Category:                  med.Category.CategoryName,
			Description:               med.Description,
			Discount:                  med.Discount,
			Unit:                      med.UnitOfMeasurement,
			MeasurementUnitValue:      med.MeasurementUnitValue,
			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
			Price:                     price,
			TaxType:                   med.TaxType,
			Prescription:              med.Prescription,
			Benefits:                  med.Benefits,
			KeyIngredients:            med.KeyIngredients,
			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
			DirectionsForUse:          med.DirectionsForUse,
			SafetyInformation:         med.SafetyInformation,
			Storage:                   med.Storage,
			Images:                    imageFilenames,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Search results",
		"medicines": response,
	})
}

// trending products
func GetTrendingMedicines(c *gin.Context, db *gorm.DB) {
	var trendingMedicineIDs []uint

	// Top 10 most frequently added medicines to cart in last 7 days
	err := db.
		Model(&models.Cart{}).
		Select("medicine_id").
		Where("created_at >= NOW() - INTERVAL 7 DAY").
		Group("medicine_id").
		Order("COUNT(*) DESC").
		Limit(9).
		Pluck("medicine_id", &trendingMedicineIDs).Error

	if err != nil {
		logrus.WithError(err).Error("Failed to fetch trending medicine IDs")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch trending medicines"})
		return
	}

	if len(trendingMedicineIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message":   "No trending medicines found",
			"medicines": []config.UserFacingMedicine{},
		})
		return
	}

	var medicines []models.Medicine
	err = db.Preload("Generic").
		Preload("ItemImages").
		Preload("Category").
		Where("id IN ?", trendingMedicineIDs).
		Find(&medicines).Error

	if err != nil {
		logrus.WithError(err).Error("Failed to fetch trending medicine details")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicine details"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var images []string
		for _, img := range med.ItemImages {
			images = append(images, img.FileName)
		}
		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}
		response = append(response, config.UserFacingMedicine{
			ID:                        med.ID,
			BrandName:                 med.BrandName,
			Power:                     med.Power,
			GenericName:               med.Generic.GenericName,
			Category:                  med.Category.CategoryName,
			Description:               med.Description,
			Discount:                  med.Discount,
			Unit:                      med.UnitOfMeasurement,
			MeasurementUnitValue:      med.MeasurementUnitValue,
			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
			Price:                     price,
			TaxType:                   med.TaxType,
			Prescription:              med.Prescription,
			Benefits:                  med.Benefits,
			KeyIngredients:            med.KeyIngredients,
			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
			DirectionsForUse:          med.DirectionsForUse,
			SafetyInformation:         med.SafetyInformation,
			Storage:                   med.Storage,
			Images:                    images,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Trending medicines fetched successfully",
		"medicines": response,
	})
}

func GetPopularMedicines(c *gin.Context, db *gorm.DB) {
	var medicines []models.Medicine

	err := db.Preload("Generic").
		Preload("ItemImages").
		Preload("Category").
		Order("created_at DESC").
		Limit(10).
		Find(&medicines).Error

	if err != nil {
		logrus.WithError(err).Error("Failed to fetch latest medicines")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch latest medicines"})
		return
	}

	var response []config.UserFacingMedicine
	for _, med := range medicines {
		var images []string
		for _, img := range med.ItemImages {
			images = append(images, img.FileName)
		}
		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}
		response = append(response, config.UserFacingMedicine{
			ID:                        med.ID,
			BrandName:                 med.BrandName,
			Power:                     med.Power,
			GenericName:               med.Generic.GenericName,
			Category:                  med.Category.CategoryName,
			Description:               med.Description,
			Discount:                  med.Discount,
			Unit:                      med.UnitOfMeasurement,
			MeasurementUnitValue:      med.MeasurementUnitValue,
			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
			Price:                     price,
			TaxType:                   med.TaxType,
			Prescription:              med.Prescription,
			Benefits:                  med.Benefits,
			KeyIngredients:            med.KeyIngredients,
			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
			DirectionsForUse:          med.DirectionsForUse,
			SafetyInformation:         med.SafetyInformation,
			Storage:                   med.Storage,
			Images:                    images,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Latest medicines fetched successfully",
		"medicines": response,
	})
}

// product page filtering
// func GetItemsByCategoryWithSortAndFilter(c *gin.Context, db *gorm.DB) {
// 	categoryIDs := c.QueryArray("category_ids")
// 	if len(categoryIDs) == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "No category IDs provided"})
// 		return
// 	}

// 	sort := c.Query("sort")

// 	var uniqueMedicineIDs []uint
// 	if err := db.
// 		Model(&models.Medicine{}).
// 		Select("MIN(id)").
// 		Where("category_id IN ?", categoryIDs).
// 		Group("brand_name, power").
// 		Scan(&uniqueMedicineIDs).Error; err != nil {
// 		logrus.WithError(err).Error("Failed to get distinct medicine IDs by category")
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
// 		return
// 	}

// 	query := db.Preload("Generic").
// 		Preload("Supplier").
// 		Preload("ItemImages").
// 		Preload("Category").
// 		Where("id IN ?", uniqueMedicineIDs)

// 	switch sort {
// 	case "popular":
// 		query = query.Order("created_at DESC")
// 	case "discount":
// 		query = query.Where("discount > ?", 0).Order("discount DESC")
// 	case "high-to-low":
// 		query = query.Order(`
// 			CASE
// 				WHEN unit_of_measurement = 'per piece' THEN selling_price_per_piece
// 				ELSE selling_price_per_box
// 			END DESC`)
// 	case "low-to-high":
// 		query = query.Order(`
// 			CASE
// 				WHEN unit_of_measurement = 'per piece' THEN selling_price_per_piece
// 				ELSE selling_price_per_box
// 			END ASC`)
// 	default:
// 		// No sort
// 	}

// 	var medicines []models.Medicine
// 	if err := query.Find(&medicines).Error; err != nil {
// 		logrus.WithError(err).Error("Failed to fetch medicines by category")
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
// 		return
// 	}

// 	var response []config.UserFacingMedicine
// 	for _, med := range medicines {
// 		var imageFilenames []string
// 		for _, img := range med.ItemImages {
// 			imageFilenames = append(imageFilenames, img.FileName)
// 		}

// 		price := med.SellingPricePerBox
// 		if med.UnitOfMeasurement == "per piece" {
// 			price = med.SellingPricePerPiece
// 		}

// 		response = append(response, config.UserFacingMedicine{
// 			ID:                        med.ID,
// 			BrandName:                 med.BrandName,
// 			Power:                     med.Power,
// 			GenericName:               med.Generic.GenericName,
// 			Category:                  med.Category.CategoryName,
// 			Description:               med.Description,
// 			Discount:                  med.Discount,
// 			Unit:                      med.UnitOfMeasurement,
// 			MeasurementUnitValue:      med.MeasurementUnitValue,
// 			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
// 			Price:                     price,
// 			TaxType:                   med.TaxType,
// 			Prescription:              med.Prescription,
// 			Benefits:                  med.Benefits,
// 			KeyIngredients:            med.KeyIngredients,
// 			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
// 			DirectionsForUse:          med.DirectionsForUse,
// 			SafetyInformation:         med.SafetyInformation,
// 			Storage:                   med.Storage,
// 			Images:                    imageFilenames,
// 		})
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":   "Medicines fetched successfully by category",
// 		"medicines": response,
// 	})
// }

// product page filtering
func GetFilteredAndSortedMedicines(c *gin.Context, db *gorm.DB) {
	var (
		medicines         []models.Medicine
		uniqueMedicineIDs []uint
		categoryIDs       = c.QueryArray("category_ids")
		brandNames        = c.QueryArray("brands")
		minPriceStr       = c.Query("min_price")
		maxPriceStr       = c.Query("max_price")
		minDiscountStr    = c.Query("min_discount")
		maxDiscountStr    = c.Query("max_discount")
		sort              = c.Query("sort") // "popular", "discount", "high-to-low", "low-to-high"
	)

	// Parse price and discount filters
	var (
		minPrice, maxPrice       float64
		minDiscount, maxDiscount float64
	)
	if minPriceStr != "" {
		minPrice, _ = strconv.ParseFloat(minPriceStr, 64)
	}
	if maxPriceStr != "" {
		maxPrice, _ = strconv.ParseFloat(maxPriceStr, 64)
	}
	if minDiscountStr != "" {
		minDiscount, _ = strconv.ParseFloat(minDiscountStr, 64)
	}
	if maxDiscountStr != "" {
		maxDiscount, _ = strconv.ParseFloat(maxDiscountStr, 64)
	}

	baseQuery := db.Model(&models.Medicine{})
	if len(categoryIDs) > 0 {
		baseQuery = baseQuery.Where("category_id IN ?", categoryIDs)
	}
	if len(brandNames) > 0 {
		baseQuery = baseQuery.Where("brand_name IN ?", brandNames)
	}

	if err := baseQuery.Select("MIN(id)").Group("brand_name, power").Scan(&uniqueMedicineIDs).Error; err != nil {
		logrus.WithError(err).Error("Failed to get distinct medicine IDs")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	query := db.Preload("Generic").
		Preload("Supplier").
		Preload("ItemImages").
		Preload("Category").
		Where("id IN ?", uniqueMedicineIDs)

	if minPrice > 0 {
		query = query.Where(`
			(CASE 
				WHEN unit_of_measurement = 'per piece' THEN selling_price_per_piece 
				ELSE selling_price_per_box 
			END) >= ?`, minPrice)
	}
	if maxPrice > 0 {
		query = query.Where(`
			(CASE 
				WHEN unit_of_measurement = 'per piece' THEN selling_price_per_piece 
				ELSE selling_price_per_box 
			END) <= ?`, maxPrice)
	}

	if minDiscount > 0 {
		query = query.Where("CAST(discount AS FLOAT) >= ?", minDiscount)
	}
	if maxDiscount > 0 {
		query = query.Where("CAST(discount AS FLOAT) <= ?", maxDiscount)
	}

	switch sort {
	case "popular":
		query = query.Order("created_at DESC")
	case "discount":
		query = query.Where("discount > ?", 0).Order("discount DESC")
	case "high-to-low":
		query = query.Order(`
			CASE 
				WHEN unit_of_measurement = 'per piece' THEN selling_price_per_piece 
				ELSE selling_price_per_box 
			END DESC`)
	case "low-to-high":
		query = query.Order(`
			CASE 
				WHEN unit_of_measurement = 'per piece' THEN selling_price_per_piece 
				ELSE selling_price_per_box 
			END ASC`)
	}

	if err := query.Find(&medicines).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch medicines")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	var response []config.UserFacingMedicine
	categoryIDMap := make(map[uint]bool)
	var filteredCategoryIDs []uint

	for _, med := range medicines {
		var imageFilenames []string
		for _, img := range med.ItemImages {
			imageFilenames = append(imageFilenames, img.FileName)
		}

		price := med.SellingPricePerBox
		if med.UnitOfMeasurement == "per piece" {
			price = med.SellingPricePerPiece
		}

		response = append(response, config.UserFacingMedicine{
			ID:                        med.ID,
			BrandName:                 med.BrandName,
			Power:                     med.Power,
			GenericName:               med.Generic.GenericName,
			Category:                  med.Category.CategoryName,
			Description:               med.Description,
			Discount:                  med.Discount,
			Unit:                      med.UnitOfMeasurement,
			MeasurementUnitValue:      med.MeasurementUnitValue,
			NumberOfPiecesPerBox:      med.NumberOfPiecesPerBox,
			Price:                     price,
			TaxType:                   med.TaxType,
			Prescription:              med.Prescription,
			Benefits:                  med.Benefits,
			KeyIngredients:            med.KeyIngredients,
			RecommendedDailyAllowance: med.RecommendedDailyAllowance,
			DirectionsForUse:          med.DirectionsForUse,
			SafetyInformation:         med.SafetyInformation,
			Storage:                   med.Storage,
			Images:                    imageFilenames,
		})

		if _, exists := categoryIDMap[med.CategoryID]; !exists {
			categoryIDMap[med.CategoryID] = true
			filteredCategoryIDs = append(filteredCategoryIDs, med.CategoryID)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Medicines fetched successfully with filters",
		"medicines":    response,
		"category_ids": filteredCategoryIDs,
	})
}
