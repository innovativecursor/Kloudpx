package uploadexcel

import (
	"fmt"
	"net/http"
	"strings"

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
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete categories"})
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

// 	header := rows[0]
// 	for i, row := range rows[1:] {
// 		if len(row) < len(header) {
// 			continue
// 		}

// 		unitOfMeasurement := strings.TrimSpace(row[8])
// 		numberOfPiecesStr := strings.TrimSpace(row[17])
// 		var numberOfPieces int
// 		fmt.Sscanf(numberOfPiecesStr, "%d", &numberOfPieces)

// 		if unitOfMeasurement == "per piece" && numberOfPieces != 0 {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d: NumberOfPiecesPerBox must be 0 when unit is 'per piece'", i+2)})
// 			return
// 		}

// 		var measurementUnitValue int
// 		fmt.Sscanf(strings.TrimSpace(row[11]), "%d", &measurementUnitValue)

// 		medicine := models.Medicine{
// 			BrandName:                 strings.TrimSpace(row[0]),
// 			Power:                     strings.TrimSpace(row[1]),
// 			Description:               strings.TrimSpace(row[2]),
// 			Packaging:                 strings.TrimSpace(row[3]),
// 			DosageForm:                strings.TrimSpace(row[4]),
// 			Marketer:                  strings.TrimSpace(row[5]),
// 			TaxType:                   strings.TrimSpace(row[6]),
// 			CategorySubClass:          strings.TrimSpace(row[7]),
// 			UnitOfMeasurement:         unitOfMeasurement,
// 			Discount:                  strings.TrimSpace(row[22]),
// 			SupplierDiscount:          strings.TrimSpace(row[23]),
// 			IsBrand:                   strings.ToLower(strings.TrimSpace(row[24])) == "true",
// 			InhouseBrand:              strings.ToLower(strings.TrimSpace(row[25])) == "true",
// 			IsFeature:                 strings.ToLower(strings.TrimSpace(row[26])) == "true",
// 			NumberOfPiecesPerBox:      0,
// 			MeasurementUnitValue:      measurementUnitValue,
// 			Benefits:                  strings.TrimSpace(row[27]),
// 			KeyIngredients:            strings.TrimSpace(row[28]),
// 			RecommendedDailyAllowance: strings.TrimSpace(row[29]),
// 			DirectionsForUse:          strings.TrimSpace(row[30]),
// 			SafetyInformation:         strings.TrimSpace(row[31]),
// 			Storage:                   strings.TrimSpace(row[32]),
// 			UpdatedBy:                 userObj.ID,
// 		}

// 		if unitOfMeasurement == "per box" {
// 			medicine.NumberOfPiecesPerBox = numberOfPieces
// 		}

// 		// Resolve or Create Generic
// 		genericName := strings.TrimSpace(row[9])
// 		var generic models.Generic
// 		db.FirstOrCreate(&generic, models.Generic{GenericName: genericName})
// 		medicine.GenericID = generic.ID

// 		// Resolve or Create Supplier
// 		supplierName := strings.TrimSpace(row[10])
// 		var supplier models.Supplier
// 		db.FirstOrCreate(&supplier, models.Supplier{SupplierName: supplierName})
// 		medicine.SupplierID = supplier.ID

// 		// Only resolve category name (skip icon for now)
// 		categoryName := strings.TrimSpace(row[12])
// 		var category models.Category
// 		db.Where("category_name = ?", categoryName).First(&category)
// 		if category.ID == 0 {
// 			category = models.Category{CategoryName: categoryName}
// 			db.Create(&category)
// 		}
// 		medicine.CategoryID = category.ID

// 		// Set numeric and boolean fields
// 		fmt.Sscanf(row[13], "%f", &medicine.SellingPricePerBox)
// 		fmt.Sscanf(row[14], "%f", &medicine.SellingPricePerPiece)
// 		fmt.Sscanf(row[15], "%f", &medicine.CostPricePerBox)
// 		fmt.Sscanf(row[16], "%f", &medicine.CostPricePerPiece)
// 		fmt.Sscanf(row[18], "%d", &medicine.MinimumThreshold)
// 		fmt.Sscanf(row[19], "%d", &medicine.MaximumThreshold)
// 		fmt.Sscanf(row[20], "%d", &medicine.EstimatedLeadTimeDays)
// 		fmt.Sscanf(row[21], "%t", &medicine.Prescription)

// 		if err := db.Create(&medicine).Error; err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to save medicine", i+2)})
// 			return
// 		}
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Excel data uploaded successfully"})
// }

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

		unitOfMeasurement := getCell(8)
		numberOfPiecesStr := getCell(17)
		var numberOfPieces int
		fmt.Sscanf(numberOfPiecesStr, "%d", &numberOfPieces)

		if unitOfMeasurement == "per piece" && numberOfPieces != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d: NumberOfPiecesPerBox must be 0 when unit is 'per piece'", i+2)})
			return
		}

		var measurementUnitValue int
		fmt.Sscanf(getCell(11), "%d", &measurementUnitValue)

		// Required fields check
		brandName := getCell(0)
		if brandName == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d: BrandName is required", i+2)})
			return
		}
		var prescription bool
		fmt.Sscanf(getCell(21), "%t", &prescription)

		medicine := models.Medicine{
			BrandName:                 brandName,
			Power:                     getCell(1),
			Description:               getCell(2),
			Packaging:                 getCell(3),
			DosageForm:                getCell(4),
			Marketer:                  getCell(5),
			TaxType:                   getCell(6),
			CategorySubClass:          getCell(7),
			UnitOfMeasurement:         unitOfMeasurement,
			Discount:                  getCell(22),
			SupplierDiscount:          getCell(23),
			IsBrand:                   strings.ToLower(getCell(24)) == "true",
			InhouseBrand:              strings.ToLower(getCell(25)) == "true",
			IsFeature:                 strings.ToLower(getCell(26)) == "true",
			NumberOfPiecesPerBox:      0,
			MeasurementUnitValue:      measurementUnitValue,
			Benefits:                  getCell(27),
			KeyIngredients:            getCell(28),
			RecommendedDailyAllowance: getCell(29),
			DirectionsForUse:          getCell(30),
			SafetyInformation:         getCell(31),
			Storage:                   getCell(32),
			UpdatedBy:                 userObj.ID,
			Prescription:              prescription,
		}

		if unitOfMeasurement == "per box" {
			medicine.NumberOfPiecesPerBox = numberOfPieces
		}

		// Generic
		genericName := getCell(9)
		var generic models.Generic
		db.FirstOrCreate(&generic, models.Generic{GenericName: genericName})
		medicine.GenericID = generic.ID

		// Supplier
		supplierName := getCell(10)
		var supplier models.Supplier
		db.FirstOrCreate(&supplier, models.Supplier{SupplierName: supplierName})
		medicine.SupplierID = supplier.ID

		// Category
		categoryName := getCell(12)
		var category models.Category
		db.Where("category_name = ?", categoryName).First(&category)
		if category.ID == 0 {
			category = models.Category{CategoryName: categoryName}
			db.Create(&category)
		}
		medicine.CategoryID = category.ID

		// Prices and thresholds
		fmt.Sscanf(getCell(13), "%f", &medicine.SellingPricePerBox)
		fmt.Sscanf(getCell(14), "%f", &medicine.SellingPricePerPiece)
		fmt.Sscanf(getCell(15), "%f", &medicine.CostPricePerBox)
		fmt.Sscanf(getCell(16), "%f", &medicine.CostPricePerPiece)
		fmt.Sscanf(getCell(18), "%d", &medicine.MinimumThreshold)
		fmt.Sscanf(getCell(19), "%d", &medicine.MaximumThreshold)
		fmt.Sscanf(getCell(20), "%d", &medicine.EstimatedLeadTimeDays)

		// Save to DB
		if err := db.Create(&medicine).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to save medicine", i+2)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Excel data uploaded successfully"})
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
