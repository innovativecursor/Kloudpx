package models

import (
	"time"
	
	"gorm.io/gorm"
)
/*
type Order struct {
	gorm.Model
	UserID     uint
	CartID     *uint  // Pointer to allow null for direct orders
	TotalPrice float64
	Status     string
	Items      []OrderItem // Add this relationship
}
*/


type Order struct {
	gorm.Model
	UserID     uint
	CartID     *uint  // Pointer to allow null for direct orders
	TotalPrice float64
	Status     string
}
type OrderItem struct {
	gorm.Model
	Medicine   
	OrderID    uint
	MedicineID uint
	Quantity   int
	UnitPrice  float64
	TotalPrice float64
	Status     string
}

// Add these response structs
type OrderItemDetail struct {
	ID           uint
	MedicineID   uint
	MedicineName string
	GenericName  string
	Quantity     int
	UnitPrice    float64
	TotalPrice   float64
	Status       string
}

type OrderDetails struct {
	OrderID   uint
	UserID    uint
	Status    string
	Total     float64
	CreatedAt time.Time
	UpdatedAt time.Time
	Items     []OrderItemDetail
}

type OrderSummary struct {
	ID        uint
	Status    string
	Total     float64
	CreatedAt time.Time
}
/*package models

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
*/