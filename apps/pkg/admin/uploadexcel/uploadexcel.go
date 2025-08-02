package uploadexcel

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
)

// func UploadMedicineExcel(c *gin.Context, db *gorm.DB) {
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 		return
// 	}
// 	userObj, ok := user.(*models.Admin)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}
// 	if userObj.ApplicationRole != "admin" {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can upload medicines"})
// 		return
// 	}

// 	file, err := c.FormFile("file")
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is required"})
// 		return
// 	}

// 	src, err := file.Open()
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
// 		return
// 	}
// 	defer src.Close()

// 	xlFile, err := excelize.OpenReader(src)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read Excel file"})
// 		return
// 	}

// 	sheet := xlFile.GetSheetName(0)
// 	rows, err := xlFile.GetRows(sheet)
// 	if err != nil || len(rows) < 2 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is empty or malformed"})
// 		return
// 	}

// 	for i, row := range rows[1:] {
// 		getCell := func(index int) string {
// 			if index < len(row) {
// 				return strings.TrimSpace(row[index])
// 			}
// 			return ""
// 		}

// 		// Skip completely empty rows
// 		isEmptyRow := true
// 		for _, cell := range row {
// 			if strings.TrimSpace(cell) != "" {
// 				isEmptyRow = false
// 				break
// 			}
// 		}
// 		if isEmptyRow {
// 			continue
// 		}

// 		unitOfMeasurement := getCell(8)
// 		numberOfPiecesStr := getCell(17)
// 		var numberOfPieces int
// 		fmt.Sscanf(numberOfPiecesStr, "%d", &numberOfPieces)

// 		if unitOfMeasurement == "per piece" && numberOfPieces != 0 {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d: NumberOfPiecesPerBox must be 0 when unit is 'per piece'", i+2)})
// 			return
// 		}

// 		var measurementUnitValue int
// 		fmt.Sscanf(getCell(11), "%d", &measurementUnitValue)

// 		// Required fields check
// 		brandName := getCell(0)
// 		if brandName == "" {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d: BrandName is required", i+2)})
// 			return
// 		}
// 		var prescription bool
// 		fmt.Sscanf(getCell(21), "%t", &prescription)

// 		medicine := models.Medicine{
// 			BrandName:                 brandName,
// 			Power:                     getCell(1),
// 			Description:               getCell(2),
// 			Packaging:                 getCell(3),
// 			DosageForm:                getCell(4),
// 			Marketer:                  getCell(5),
// 			TaxType:                   getCell(6),
// 			CategorySubClass:          getCell(7),
// 			UnitOfMeasurement:         unitOfMeasurement,
// 			Discount:                  getCell(22),
// 			SupplierDiscount:          getCell(23),
// 			IsBrand:                   strings.ToLower(getCell(24)) == "true",
// 			InhouseBrand:              strings.ToLower(getCell(25)) == "true",
// 			IsFeature:                 strings.ToLower(getCell(26)) == "true",
// 			NumberOfPiecesPerBox:      0,
// 			MeasurementUnitValue:      measurementUnitValue,
// 			Benefits:                  getCell(27),
// 			KeyIngredients:            getCell(28),
// 			RecommendedDailyAllowance: getCell(29),
// 			DirectionsForUse:          getCell(30),
// 			SafetyInformation:         getCell(31),
// 			Storage:                   getCell(32),
// 			UpdatedBy:                 userObj.ID,
// 			Prescription:              prescription,
// 		}

// 		if unitOfMeasurement == "per box" {
// 			medicine.NumberOfPiecesPerBox = numberOfPieces
// 		}

// 		// Generic
// 		genericName := getCell(9)
// 		var generic models.Generic
// 		db.FirstOrCreate(&generic, models.Generic{GenericName: genericName})
// 		medicine.GenericID = generic.ID

// 		// Supplier
// 		supplierName := getCell(10)
// 		var supplier models.Supplier
// 		db.FirstOrCreate(&supplier, models.Supplier{SupplierName: supplierName})
// 		medicine.SupplierID = supplier.ID

// 		// Category
// 		categoryName := getCell(12)
// 		var category models.Category
// 		db.Where("category_name = ?", categoryName).First(&category)
// 		if category.ID == 0 {
// 			category = models.Category{CategoryName: categoryName}
// 			db.Create(&category)
// 		}
// 		medicine.CategoryID = category.ID

// 		// Prices and thresholds
// 		fmt.Sscanf(getCell(13), "%f", &medicine.SellingPricePerBox)
// 		fmt.Sscanf(getCell(14), "%f", &medicine.SellingPricePerPiece)
// 		fmt.Sscanf(getCell(15), "%f", &medicine.CostPricePerBox)
// 		fmt.Sscanf(getCell(16), "%f", &medicine.CostPricePerPiece)
// 		fmt.Sscanf(getCell(18), "%d", &medicine.MinimumThreshold)
// 		fmt.Sscanf(getCell(19), "%d", &medicine.MaximumThreshold)
// 		fmt.Sscanf(getCell(20), "%d", &medicine.EstimatedLeadTimeDays)

// 		var existingMedicines []models.Medicine
// 		err := db.Where(
// 			"brand_name = ? AND generic_id = ? AND supplier_id = ? AND power = ? AND unit_of_measurement = ? AND measurement_unit_value = ?",
// 			medicine.BrandName, medicine.GenericID, medicine.SupplierID,
// 			medicine.Power, medicine.UnitOfMeasurement, medicine.MeasurementUnitValue,
// 		).Find(&existingMedicines).Error

// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: DB error: %v", i+2, err)})
// 			return
// 		}

// 		exactMatchFound := false
// 		for _, m := range existingMedicines {
// 			if reflect.DeepEqual(stripAutoFields(m), stripAutoFields(medicine)) {
// 				exactMatchFound = true
// 				break
// 			}
// 		}

// 		if !exactMatchFound {
// 			if err := db.Create(&medicine).Error; err != nil {
// 				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to create medicine", i+2)})
// 				return
// 			}
// 		}

// 	}

//		c.JSON(http.StatusOK, gin.H{"message": "Excel data uploaded successfully"})
//	}
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
		if len(row) < 6 {
			continue
		}

		midwife := models.Midwives{
			LastName:     strings.TrimSpace(row[1]),
			FirstName:    strings.TrimSpace(row[2]),
			MiddleName:   strings.TrimSpace(row[3]),
			Municipality: strings.TrimSpace(row[4]),
			Province:     strings.TrimSpace(row[5]),
		}

		if err := db.Create(&midwife).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to save midwife", i+2)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Midwives uploaded successfully"})
}

// hospital list
func UploadHospitalsExcel(c *gin.Context, db *gorm.DB) {
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

	for i, row := range rows[2:] { // Skip header + 1 blank
		if len(row) < 12 {
			continue
		}

		hospital := models.Hospital{
			Region:   strings.TrimSpace(row[0]),
			Province: strings.TrimSpace(row[1]),
			Name:     strings.TrimSpace(row[3]),
		}

		// Optional and parsed fields
		fmt.Sscanf(strings.TrimSpace(row[4]), "%d", &hospital.BedCount)
		hospital.Category = strings.TrimSpace(row[5])
		hospital.Telephone = strings.TrimSpace(row[6])
		hospital.Email = strings.TrimSpace(row[7])
		hospital.Street = strings.TrimSpace(row[8])
		hospital.Municipality = strings.TrimSpace(row[9])
		hospital.Sector = strings.TrimSpace(row[10])
		hospital.Head = strings.TrimSpace(row[11])

		if err := db.Create(&hospital).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to save hospital", i+3)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Hospitals uploaded successfully"})
}

// physician
func UploadPhysiciansExcel(c *gin.Context, db *gorm.DB) {
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
		if len(row) < 7 {
			continue
		}

		physician := models.Physician{
			LastName:     strings.TrimSpace(row[1]),
			FirstName:    strings.TrimSpace(row[2]),
			MiddleName:   strings.TrimSpace(row[3]),
			Specialty:    strings.TrimSpace(row[4]),
			Municipality: strings.TrimSpace(row[5]),
			Province:     strings.TrimSpace(row[6]),
		}

		if err := db.Create(&physician).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to save physician", i+2)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Physicians uploaded successfully"})
}

func UploadKonsultaProvidersExcel(c *gin.Context, db *gorm.DB) {
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
		if len(row) < 10 {
			continue
		}

		provider := models.KonsultaProvider{
			Region:       strings.TrimSpace(row[0]),
			Province:     strings.TrimSpace(row[1]),
			FacilityName: strings.TrimSpace(row[3]),
			Telephone:    strings.TrimSpace(row[4]),
			Email:        strings.TrimSpace(row[5]),
			Street:       strings.TrimSpace(row[6]),
			Municipality: strings.TrimSpace(row[7]),
			Sector:       strings.TrimSpace(row[8]),
			Head:         strings.TrimSpace(row[9]),
		}

		if err := db.Create(&provider).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to save provider", i+2)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Konsulta providers uploaded successfully"})
}

func UploadDentists(c *gin.Context, db *gorm.DB) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File upload failed"})
		return
	}

	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot open file"})
		return
	}
	defer f.Close()

	xlFile, err := excelize.OpenReader(f)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read Excel"})
		return
	}

	rows, err := xlFile.GetRows(xlFile.GetSheetName(0))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot get Excel rows"})
		return
	}

	for i, row := range rows {
		if i == 0 || len(row) < 6 {
			continue
		}

		dentist := models.Dentist{
			LastName:     strings.TrimSpace(row[1]),
			FirstName:    strings.TrimSpace(row[2]),
			MiddleName:   strings.TrimSpace(row[3]),
			Municipality: strings.TrimSpace(row[4]),
			Province:     strings.TrimSpace(row[5]),
		}

		db.Create(&dentist)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dentist data uploaded successfully"})
}
