package itemscalculation

import (
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

// CalculateTotalStockByBrandName calculates the total available stock for a given brand, summing across suppliers
func CalculateTotalStockByBrandName(db *gorm.DB, brandName string) (int, error) {
	var medicines []models.Medicine
	if err := db.Where("brand_name = ?", brandName).Find(&medicines).Error; err != nil {
		return 0, err
	}

	total := 0
	for _, m := range medicines {
		if m.UnitOfMeasurement == "per box" {
			// Total pieces = boxes * pieces per box
			total += m.MeasurementUnitValue * m.NumberOfPiecesPerBox
		} else if m.UnitOfMeasurement == "per piece" {
			// Just add the number of pieces directly
			total += m.MeasurementUnitValue
		}
	}
	return total, nil
}
