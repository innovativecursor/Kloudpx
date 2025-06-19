package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model
	UserID     uint    `gorm:"index" json:"user_id"`
	CartID     uint    `json:"cart_id"`
	TotalPrice float64 `json:"total_price"`
	Status     string  `json:"status"`
	TaxVAT     float64 `json:"tax_vat"`
}

type OrderItem struct {
	Name        string  `json:"name"`
	GenericName string  `json:"generic_name"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	Status      string  `json:"status"`
	ItemTotal   float64 `json:"item_total"`
	TaxVAT      float64 `json:"tax_vat"`
}

type OrderDetails struct {
	OrderID uint        `json:"order_id"`
	Items   []OrderItem `json:"items"`
	Total   float64     `json:"total"`
}
