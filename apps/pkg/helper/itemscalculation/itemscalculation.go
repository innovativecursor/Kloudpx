package itemscalculation

import (
	"fmt"
	"strings"

	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func CalculateTotalStockByBrandName(db *gorm.DB, brandName, power string) (int, error) {
	brandName = strings.TrimSpace(strings.ToLower(brandName))
	power = strings.TrimSpace(strings.ToLower(power))

	var medicines []models.Medicine
	if err := db.
		Where("LOWER(brand_name) = ? AND LOWER(power) = ?", brandName, power).
		Find(&medicines).Error; err != nil {
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

func getAvailableInPieces(med models.Medicine) int {
	if med.UnitOfMeasurement == "per box" {
		return med.MeasurementUnitValue * med.NumberOfPiecesPerBox
	}
	return med.MeasurementUnitValue
}

func updateStockAfterDeduction(med *models.Medicine, newTotalPieces int) {
	if med.UnitOfMeasurement == "per box" {
		med.MeasurementUnitValue = newTotalPieces / med.NumberOfPiecesPerBox
	} else {
		med.MeasurementUnitValue = newTotalPieces
	}
}

func DeductStockByBrandAndPower(db *gorm.DB, brandName, power string, quantityToDeduct int) error {
	brandName = strings.TrimSpace(strings.ToLower(brandName))
	power = strings.TrimSpace(strings.ToLower(power))

	var medicines []models.Medicine
	if err := db.
		Clauses(clause.Locking{Strength: "UPDATE"}). // <-- row lock here
		Where("LOWER(brand_name) = ? AND LOWER(power) = ?", brandName, power).
		Order("id asc").
		Find(&medicines).Error; err != nil {
		return fmt.Errorf("failed to fetch medicines for deduction: %w", err)
	}

	for _, med := range medicines {
		available := getAvailableInPieces(med)

		if available >= quantityToDeduct {
			newQty := available - quantityToDeduct
			updateStockAfterDeduction(&med, newQty)
			if err := db.Save(&med).Error; err != nil {
				return fmt.Errorf("failed to update stock for %s: %w", med.BrandName, err)
			}
			return nil
		} else {
			quantityToDeduct -= available
			updateStockAfterDeduction(&med, 0)
			if err := db.Save(&med).Error; err != nil {
				return fmt.Errorf("failed to deplete stock for %s: %w", med.BrandName, err)
			}
		}
	}

	return fmt.Errorf("not enough stock available to deduct for brand: %s", brandName)
}

func DeductMedicineStock(db *gorm.DB, cartItems []models.Cart) error {
	return db.Transaction(func(tx *gorm.DB) error {
		for _, item := range cartItems {
			quantityToDeduct := item.Quantity
			if item.Medicine.UnitOfMeasurement == "per box" {
				quantityToDeduct = item.Quantity * item.Medicine.NumberOfPiecesPerBox
			}

			err := DeductStockByBrandAndPower(tx, item.Medicine.BrandName, item.Medicine.Power, quantityToDeduct)
			if err != nil {
				return err
			}
		}
		return nil
	})
}

func RestoreMedicineStock(db *gorm.DB, cartItems []models.CartHistory) error {
	return db.Transaction(func(tx *gorm.DB) error {
		for _, item := range cartItems {
			quantityToRestore := item.Quantity
			if item.Medicine.UnitOfMeasurement == "per box" {
				quantityToRestore = item.Quantity * item.Medicine.NumberOfPiecesPerBox
			}

			// Lock and restore
			var medicines []models.Medicine
			if err := tx.
				Clauses(clause.Locking{Strength: "UPDATE"}).
				Where("LOWER(brand_name) = ? AND LOWER(power) = ?",
					strings.ToLower(item.Medicine.BrandName),
					strings.ToLower(item.Medicine.Power)).
				Order("id asc").
				Find(&medicines).Error; err != nil {
				return fmt.Errorf("failed to fetch medicines for restore: %w", err)
			}

			for _, med := range medicines {
				available := getAvailableInPieces(med)
				available += quantityToRestore
				updateStockAfterDeduction(&med, available) // reuse your same update logic
				if err := tx.Save(&med).Error; err != nil {
					return fmt.Errorf("failed to restore stock for %s: %w", med.BrandName, err)
				}
				break // restore to first matching medicine batch
			}
		}
		return nil
	})
}
