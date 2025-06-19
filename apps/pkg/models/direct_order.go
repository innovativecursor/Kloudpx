package models

import "gorm.io/gorm"

type DirectOrder struct {
	gorm.Model
	UserID     uint    `json:"user_id"`
	MedicineID uint    `json:"medicine_id"`
	Quantity   int     `json:"quantity"`
	TotalPrice float64 `json:"total_price"`
	Status     string  `json:"status"`
	TaxVAT     float64 `json:"tax_vat"`
}
