package uploadexcel

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
)

func UploadMedicineExcel(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	if userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can upload medicines"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
		return
	}
	defer src.Close()

	xlFile, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read Excel file"})
		return
	}

	sheet := xlFile.GetSheetName(0)
	rows, err := xlFile.GetRows(sheet)
	if err != nil || len(rows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is empty or malformed"})
		return
	}

	for i, row := range rows[1:] {
		getCell := func(index int) string {
			if index < len(row) {
				return strings.TrimSpace(row[index])
			}
			return ""
		}

		// Skip completely empty rows
		isEmptyRow := true
		for _, cell := range row {
			if strings.TrimSpace(cell) != "" {
				isEmptyRow = false
				break
			}
		}
		if isEmptyRow {
			continue
		}

		itemCode := getCell(0)
		if itemCode == "" {
			itemCode = generateItemCode()
		}

		unitOfMeasurement := getCell(9)
		numberOfPiecesStr := getCell(18)
		var numberOfPieces int
		fmt.Sscanf(numberOfPiecesStr, "%d", &numberOfPieces)

		if unitOfMeasurement == "per piece" && numberOfPieces != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d: NumberOfPiecesPerBox must be 0 when unit is 'per piece'", i+2)})
			return
		}

		var measurementUnitValue int
		fmt.Sscanf(getCell(12), "%d", &measurementUnitValue)

		brandName := getCell(1)
		if brandName == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d: BrandName is required", i+2)})
			return
		}
		var prescription bool
		fmt.Sscanf(getCell(22), "%t", &prescription)

		// Prepare new or updated record
		medicine := models.Medicine{
			ItemCode:                  itemCode,
			BrandName:                 brandName,
			Power:                     getCell(2),
			Description:               getCell(3),
			Packaging:                 getCell(4),
			DosageForm:                getCell(5),
			Marketer:                  getCell(6),
			TaxType:                   getCell(7),
			CategorySubClass:          getCell(8),
			UnitOfMeasurement:         unitOfMeasurement,
			Discount:                  getCell(23),
			SupplierDiscount:          getCell(24),
			IsBrand:                   strings.ToLower(getCell(25)) == "true",
			InhouseBrand:              strings.ToLower(getCell(26)) == "true",
			IsFeature:                 strings.ToLower(getCell(27)) == "true",
			NumberOfPiecesPerBox:      0,
			MeasurementUnitValue:      measurementUnitValue,
			Benefits:                  getCell(28),
			KeyIngredients:            getCell(29),
			RecommendedDailyAllowance: getCell(30),
			DirectionsForUse:          getCell(31),
			SafetyInformation:         getCell(32),
			Storage:                   getCell(33),
			UpdatedBy:                 userObj.ID,
			Prescription:              prescription,
		}

		if unitOfMeasurement == "per box" {
			medicine.NumberOfPiecesPerBox = numberOfPieces
		}

		// Generic
		genericName := getCell(10)
		var generic models.Generic
		db.FirstOrCreate(&generic, models.Generic{GenericName: genericName})
		medicine.GenericID = generic.ID

		// Supplier
		supplierName := getCell(11)
		var supplier models.Supplier
		db.FirstOrCreate(&supplier, models.Supplier{SupplierName: supplierName})
		medicine.SupplierID = supplier.ID

		// Category
		categoryName := getCell(13)
		var category models.Category
		db.Where("category_name = ?", categoryName).First(&category)
		if category.ID == 0 {
			category = models.Category{CategoryName: categoryName}
			db.Create(&category)
		}
		medicine.CategoryID = category.ID

		fmt.Sscanf(getCell(14), "%f", &medicine.SellingPricePerBox)
		fmt.Sscanf(getCell(15), "%f", &medicine.SellingPricePerPiece)
		fmt.Sscanf(getCell(16), "%f", &medicine.CostPricePerBox)
		fmt.Sscanf(getCell(17), "%f", &medicine.CostPricePerPiece)
		fmt.Sscanf(getCell(19), "%d", &medicine.MinimumThreshold)
		fmt.Sscanf(getCell(20), "%d", &medicine.MaximumThreshold)
		fmt.Sscanf(getCell(21), "%d", &medicine.EstimatedLeadTimeDays)

		var existing models.Medicine
		err := db.Where("item_code = ?", itemCode).First(&existing).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&medicine).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to create medicine", i+2)})
				return
			}
		} else if err == nil {
			medicine.ID = existing.ID
			if err := db.Model(&existing).Updates(medicine).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to update medicine", i+2)})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: DB error: %v", i+2, err)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Excel data uploaded successfully"})
}

func generateItemCode() string {
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	random := rand.Intn(1000)
	return fmt.Sprintf("ITEM-%d-%03d", timestamp, random)
}

func stripAutoFields(m models.Medicine) models.Medicine {
	m.ID = 0
	m.CreatedAt = time.Time{}
	m.UpdatedAt = time.Time{}
	m.DeletedAt = gorm.DeletedAt{}
	return m
}

func DownloadMedicineExcel(c *gin.Context, db *gorm.DB) {
	f := excelize.NewFile()
	sheet := f.GetSheetName(0)

	// Header row
	headers := []string{
		"ItemCode", "BrandName", "Power", "Description", "Packaging", "DosageForm", "Marketer", "TaxType",
		"CategorySubClass", "UnitOfMeasurement", "Generic", "Supplier", "MeasurementUnitValue", "Category",
		"SellingPricePerBox", "SellingPricePerPiece", "CostPricePerBox", "CostPricePerPiece", "NumberOfPiecesPerBox",
		"MinimumThreshold", "MaximumThreshold", "EstimatedLeadTimeDays", "Prescription", "Discount", "SupplierDiscount",
		"IsBrand", "InhouseBrand", "IsFeature", "Benefits", "KeyIngredients", "RecommendedDailyAllowance",
		"DirectionsForUse", "SafetyInformation", "Storage",
	}

	for i, header := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, header)
	}

	// Load medicines
	var medicines []models.Medicine
	if err := db.Preload("Generic").Preload("Supplier").Preload("Category").Find(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}

	// Write rows
	for i, m := range medicines {
		row := i + 2 // because row 1 is header

		values := []interface{}{
			m.ItemCode, m.BrandName, m.Power, m.Description, m.Packaging, m.DosageForm, m.Marketer, m.TaxType,
			m.CategorySubClass, m.UnitOfMeasurement, m.Generic.GenericName, m.Supplier.SupplierName,
			m.MeasurementUnitValue, m.Category.CategoryName,
			m.SellingPricePerBox, m.SellingPricePerPiece, m.CostPricePerBox, m.CostPricePerPiece,
			m.NumberOfPiecesPerBox, m.MinimumThreshold, m.MaximumThreshold, m.EstimatedLeadTimeDays,
			m.Prescription, m.Discount, m.SupplierDiscount,
			m.IsBrand, m.InhouseBrand, m.IsFeature,
			m.Benefits, m.KeyIngredients, m.RecommendedDailyAllowance,
			m.DirectionsForUse, m.SafetyInformation, m.Storage,
		}

		for j, val := range values {
			cell, _ := excelize.CoordinatesToCellName(j+1, row)
			f.SetCellValue(sheet, cell, val)
		}
	}

	// Set content headers
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", `attachment; filename="medicine_export.xlsx"`)
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Expires", "0")

	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write Excel file"})
	}
}

func UploadMidwivesExcel(c *gin.Context, db *gorm.DB) {
	// Auth check
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can upload midwives data"})
		return
	}

	// File check
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	xlFile, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse Excel"})
		return
	}

	sheet := xlFile.GetSheetName(0)
	rows, err := xlFile.GetRows(sheet)
	if err != nil || len(rows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or empty Excel"})
		return
	}

	for i, row := range rows[1:] {
		getCell := func(index int) string {
			if index < len(row) {
				return strings.TrimSpace(row[index])
			}
			return ""
		}

		// Skip empty rows
		isEmpty := true
		for _, cell := range row {
			if strings.TrimSpace(cell) != "" {
				isEmpty = false
				break
			}
		}
		if isEmpty {
			continue
		}

		// Generate unique code if missing
		midwifeCode := getCell(0)
		if midwifeCode == "" {
			midwifeCode = generateMidwifeCode()
		}

		midwife := models.Midwives{
			MidwifeCode:  midwifeCode,
			LastName:     getCell(1),
			FirstName:    getCell(2),
			MiddleName:   getCell(3),
			Municipality: getCell(4),
			Province:     getCell(5),
		}

		// Check existing record by code
		var existing models.Midwives
		err := db.Where("midwife_code = ?", midwifeCode).First(&existing).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new
			if err := db.Create(&midwife).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to create midwife", i+2)})
				return
			}
		} else if err == nil {
			// Update existing
			midwife.ID = existing.ID
			if err := db.Model(&existing).Updates(midwife).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to update midwife", i+2)})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: DB error: %v", i+2, err)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Midwives uploaded successfully"})
}

func generateMidwifeCode() string {
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	random := rand.Intn(1000)
	return fmt.Sprintf("MWF-%d-%03d", timestamp, random)
}

func UploadHospitalsExcel(c *gin.Context, db *gorm.DB) {
	// Auth check
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can upload hospital data"})
		return
	}

	// File check
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	xlFile, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read Excel file"})
		return
	}

	sheet := xlFile.GetSheetName(0)
	rows, err := xlFile.GetRows(sheet)
	if err != nil || len(rows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or empty Excel"})
		return
	}

	for i, row := range rows[1:] { // Skip header
		getCell := func(index int) string {
			if index < len(row) {
				return strings.TrimSpace(row[index])
			}
			return ""
		}

		// Skip empty rows
		isEmpty := true
		for _, cell := range row {
			if strings.TrimSpace(cell) != "" {
				isEmpty = false
				break
			}
		}
		if isEmpty {
			continue
		}

		// Parse BedCount safely
		beds := 0
		if val := getCell(4); val != "" {
			if n, err := strconv.Atoi(val); err == nil {
				beds = n
			}
		}

		// Unique Hospital Code from column 2 (index 2)
		hospitalCode := getCell(2)
		if hospitalCode == "" {
			hospitalCode = generateHospitalCode()
		}

		hospital := models.Hospital{
			Region:       getCell(0),
			Province:     getCell(1),
			HospitalCode: hospitalCode,
			Name:         getCell(3),
			BedCount:     beds,
			Category:     getCell(5),
			Telephone:    getCell(6),
			Email:        getCell(7),
			Street:       getCell(8),
			Municipality: getCell(9),
			Sector:       getCell(10),
			Head:         getCell(11),
		}

		// Check if hospital exists
		var existing models.Hospital
		err := db.Where("hospital_code = ?", hospitalCode).First(&existing).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&hospital).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to create hospital", i+2)})
				return
			}
		} else if err == nil {
			hospital.ID = existing.ID
			if err := db.Model(&existing).Updates(hospital).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to update hospital", i+2)})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: DB error: %v", i+2, err)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Hospitals uploaded successfully"})
}

func generateHospitalCode() string {
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	random := rand.Intn(1000)
	return fmt.Sprintf("HSP-%d-%03d", timestamp, random)
}

// physician
func UploadPhysiciansExcel(c *gin.Context, db *gorm.DB) {
	// Auth check
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can upload physician data"})
		return
	}

	// File check
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	xlFile, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read Excel file"})
		return
	}

	sheet := xlFile.GetSheetName(0)
	rows, err := xlFile.GetRows(sheet)
	if err != nil || len(rows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or empty Excel"})
		return
	}

	for i, row := range rows[1:] {
		getCell := func(index int) string {
			if index < len(row) {
				return strings.TrimSpace(row[index])
			}
			return ""
		}

		// Skip empty rows
		isEmpty := true
		for _, cell := range row {
			if strings.TrimSpace(cell) != "" {
				isEmpty = false
				break
			}
		}
		if isEmpty {
			continue
		}

		// Unique Physician Code
		physicianCode := getCell(0)
		if physicianCode == "" {
			physicianCode = generatePhysicianCode()
		}

		physician := models.Physician{
			PhysicianCode: physicianCode,
			LastName:      getCell(1),
			FirstName:     getCell(2),
			MiddleName:    getCell(3),
			Specialty:     getCell(4),
			Municipality:  getCell(5),
			Province:      getCell(6),
		}

		// Check if exists
		var existing models.Physician
		err := db.Where("physician_code = ?", physicianCode).First(&existing).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&physician).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to create physician", i+2)})
				return
			}
		} else if err == nil {
			physician.ID = existing.ID
			if err := db.Model(&existing).Updates(physician).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to update physician", i+2)})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: DB error: %v", i+2, err)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Physicians uploaded successfully"})
}

func generatePhysicianCode() string {
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	random := rand.Intn(1000)
	return fmt.Sprintf("PHY-%d-%03d", timestamp, random)
}

func UploadKonsultaProvidersExcel(c *gin.Context, db *gorm.DB) {
	// Auth check
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can upload Konsulta Providers"})
		return
	}

	// File check
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	xlFile, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read Excel file"})
		return
	}

	sheet := xlFile.GetSheetName(0)
	rows, err := xlFile.GetRows(sheet)
	if err != nil || len(rows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or empty Excel"})
		return
	}

	for i, row := range rows[1:] { // Skip header row
		getCell := func(index int) string {
			if index < len(row) {
				return strings.TrimSpace(row[index])
			}
			return ""
		}

		// Skip completely empty rows
		isEmpty := true
		for _, cell := range row {
			if strings.TrimSpace(cell) != "" {
				isEmpty = false
				break
			}
		}
		if isEmpty {
			continue
		}

		// Unique provider code
		providerCode := getCell(2)
		if providerCode == "" {
			providerCode = generateProviderCode()
		}

		provider := models.KonsultaProvider{
			Region:       getCell(0),
			Province:     getCell(1),
			ProviderCode: providerCode,
			FacilityName: getCell(3),
			Telephone:    getCell(4),
			Email:        getCell(5),
			Street:       getCell(6),
			Municipality: getCell(7),
			Sector:       getCell(8),
			Head:         getCell(9),
		}

		// Check if exists → update, else create
		var existing models.KonsultaProvider
		err := db.Where("provider_code = ?", providerCode).First(&existing).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&provider).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to create provider", i+2)})
				return
			}
		} else if err == nil {
			provider.ID = existing.ID
			if err := db.Model(&existing).Updates(provider).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to update provider", i+2)})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: DB error: %v", i+2, err)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Konsulta providers uploaded successfully"})
}

// Generates a unique provider code
func generateProviderCode() string {
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	random := rand.Intn(1000)
	return fmt.Sprintf("PRV-%d-%03d", timestamp, random)
}

func UploadDentists(c *gin.Context, db *gorm.DB) {
	// Auth check
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can upload Dentists"})
		return
	}

	// File check
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	xlFile, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read Excel file"})
		return
	}

	sheet := xlFile.GetSheetName(0)
	rows, err := xlFile.GetRows(sheet)
	if err != nil || len(rows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or empty Excel"})
		return
	}

	for i, row := range rows[1:] { // Skip header row
		getCell := func(index int) string {
			if index < len(row) {
				return strings.TrimSpace(row[index])
			}
			return ""
		}

		// Skip empty rows
		isEmpty := true
		for _, cell := range row {
			if strings.TrimSpace(cell) != "" {
				isEmpty = false
				break
			}
		}
		if isEmpty {
			continue
		}

		// Unique dentist code
		dentistCode := getCell(0)
		if dentistCode == "" {
			dentistCode = generateDentistCode()
		}

		dentist := models.Dentist{
			DentistCode:  dentistCode,
			LastName:     getCell(1),
			FirstName:    getCell(2),
			MiddleName:   getCell(3),
			Municipality: getCell(4),
			Province:     getCell(5),
		}

		// Check if exists → update, else create
		var existing models.Dentist
		err := db.Where("dentist_code = ?", dentistCode).First(&existing).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&dentist).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to create dentist", i+2)})
				return
			}
		} else if err == nil {
			dentist.ID = existing.ID
			if err := db.Model(&existing).Updates(dentist).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to update dentist", i+2)})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: DB error: %v", i+2, err)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dentist data uploaded successfully"})
}

// Generates a unique dentist code
func generateDentistCode() string {
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	random := rand.Intn(1000)
	return fmt.Sprintf("DNT-%d-%03d", timestamp, random)
}
