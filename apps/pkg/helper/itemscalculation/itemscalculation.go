package itemscalculation

import (
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

func CalculateTotalStockByBrandName(db *gorm.DB, brandName, power string) (int, error) {
	var medicines []models.Medicine
	if err := db.Where("brand_name = ? AND power = ?", brandName, power).Find(&medicines).Error; err != nil {
		return 0, err
	}

	total := 0
	for _, m := range medicines {
		if m.UnitOfMeasurement == "per box" {
			total += m.MeasurementUnitValue * m.NumberOfPiecesPerBox
		} else if m.UnitOfMeasurement == "per piece" {
			total += m.MeasurementUnitValue
		}
	}
	return total, nil
}
