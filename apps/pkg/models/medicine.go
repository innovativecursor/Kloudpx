package models

import "gorm.io/gorm"

type GenericMedicine struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;not null" json:"name"`
	Description string `json:"description"`
}

type Tax struct {
	VAT float64 `json:"vat"`
}

type Medicine struct {
	gorm.Model
	BrandName            string  `json:"brand_name"`
	GenericID            uint    `json:"generic_id"`
	Description          string  `json:"description"`
	Category             string  `json:"category"`
	QuantityInPieces     int     `json:"stock"`
	Supplier             string  `json:"supplier"`
	PurchasePrice        float64 `json:"purchase_price"`
	SellingPrice         float64 `json:"price"`
	TaxType              string  `json:"tax_type"`
	TaxVAT               float64 `json:"tax_vat"`
	MinimumThreshold     int     `json:"minimum_threshold"`
	MaximumThreshold     int     `json:"maximum_threshold"`
	EstimatedLeadTime    int     `json:"estimated_lead_time"`
	PrescriptionRequired bool    `json:"prescription_required"`
}

type MedicineWithGeneric struct {
	Medicine
	Generic GenericMedicine `gorm:"foreignKey:GenericID" json:"generic"`
}
