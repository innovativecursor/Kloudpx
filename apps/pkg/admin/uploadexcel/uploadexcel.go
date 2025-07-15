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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete categories"})
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

	header := rows[0]
	for i, row := range rows[1:] {
		if len(row) < len(header) {
			continue
		}

		unitOfMeasurement := strings.TrimSpace(row[8])
		numberOfPiecesStr := strings.TrimSpace(row[17])
		var numberOfPieces int
		fmt.Sscanf(numberOfPiecesStr, "%d", &numberOfPieces)

		if unitOfMeasurement == "per piece" && numberOfPieces != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d: NumberOfPiecesPerBox must be 0 when unit is 'per piece'", i+2)})
			return
		}

		var measurementUnitValue int
		fmt.Sscanf(strings.TrimSpace(row[11]), "%d", &measurementUnitValue)

		medicine := models.Medicine{
			BrandName:            strings.TrimSpace(row[0]),
			Power:                strings.TrimSpace(row[1]),
			Description:          strings.TrimSpace(row[2]),
			Packaging:            strings.TrimSpace(row[3]),
			DosageForm:           strings.TrimSpace(row[4]),
			Marketer:             strings.TrimSpace(row[5]),
			TaxType:              strings.TrimSpace(row[6]),
			CategorySubClass:     strings.TrimSpace(row[7]),
			UnitOfMeasurement:    unitOfMeasurement,
			Discount:             strings.TrimSpace(row[22]),
			SupplierDiscount:     strings.TrimSpace(row[23]),
			IsBrand:              strings.ToLower(strings.TrimSpace(row[24])) == "true",
			InhouseBrand:         strings.ToLower(strings.TrimSpace(row[25])) == "true",
			IsFeature:            strings.ToLower(strings.TrimSpace(row[26])) == "true",
			NumberOfPiecesPerBox: 0,
			MeasurementUnitValue: measurementUnitValue,
		}

		if unitOfMeasurement == "per box" {
			medicine.NumberOfPiecesPerBox = numberOfPieces
		}

		// Resolve or Create Generic
		genericName := strings.TrimSpace(row[9])
		var generic models.Generic
		db.FirstOrCreate(&generic, models.Generic{GenericName: genericName})
		medicine.GenericID = generic.ID

		// Resolve or Create Supplier
		supplierName := strings.TrimSpace(row[10])
		var supplier models.Supplier
		db.FirstOrCreate(&supplier, models.Supplier{SupplierName: supplierName})
		medicine.SupplierID = supplier.ID

		// Only resolve category name (skip icon for now)
		categoryName := strings.TrimSpace(row[12])
		var category models.Category
		db.Where("category_name = ?", categoryName).First(&category)
		if category.ID == 0 {
			category = models.Category{CategoryName: categoryName}
			db.Create(&category)
		}
		medicine.CategoryID = category.ID

		// Set numeric and boolean fields
		fmt.Sscanf(row[13], "%f", &medicine.SellingPricePerBox)
		fmt.Sscanf(row[14], "%f", &medicine.SellingPricePerPiece)
		fmt.Sscanf(row[15], "%f", &medicine.CostPricePerBox)
		fmt.Sscanf(row[16], "%f", &medicine.CostPricePerPiece)
		fmt.Sscanf(row[18], "%d", &medicine.MinimumThreshold)
		fmt.Sscanf(row[19], "%d", &medicine.MaximumThreshold)
		fmt.Sscanf(row[20], "%d", &medicine.EstimatedLeadTimeDays)
		fmt.Sscanf(row[21], "%t", &medicine.Prescription)

		if err := db.Create(&medicine).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Row %d: Failed to save medicine", i+2)})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Excel data uploaded successfully"})
}
