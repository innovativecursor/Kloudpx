package models

import "gorm.io/gorm"

type Supplier struct {
	gorm.Model
	AdminID          uint    `gorm:"index" json:"admin_id"`
	SupplierName     string  `gorm:"not null" json:"supplier_name"`
	Cost             float64 `json:"cost"`
	DiscountProvided float64 `json:"discount_provided"`
	QuantityInPiece  int     `json:"quantity_in_piece"`
	QuantityInBox    int     `json:"quantity_in_box"`
	CostPrice        float64 `json:"cost_price"`
	Taxes            float64 `json:"taxes"`
}
