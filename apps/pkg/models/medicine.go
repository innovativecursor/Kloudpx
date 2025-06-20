package models

import (
	"gorm.io/gorm"
)

// Main medicine model
type Medicine struct {
	gorm.Model
	BrandName            string          `gorm:"not null"`
	GenericID            uint            `gorm:"not null"`
	Generic              GenericMedicine `gorm:"foreignKey:GenericID"` // belongs to GenericMedicine
	Description          string
	Category             string
	QuantityInPieces     int `gorm:"default:0"`
	Supplier             string
	PurchasePrice        float64
	SellingPrice         float64 `gorm:"not null"`
	TaxType              string
	TaxVAT               float64
	MinimumThreshold     int
	MaximumThreshold     int
	EstimatedLeadTime    int
	PrescriptionRequired bool `gorm:"default:false"`
}

// Generic medicine definition (no duplicate ID)
type GenericMedicine struct {
	gorm.Model
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"uniqueIndex;not null" json:"name"`
	Description string `json:"description"`
}

// Optional Tax wrapper if used in DTOs or API
type Tax struct {
	VAT float64 `json:"vat"`
}

// Optional DTO to include full generic details with medicine
type MedicineWithGeneric struct {
	Medicine
	Generic GenericMedicine `json:"generic"`
}
