package models

import "gorm.io/gorm"

type Cart struct {
	gorm.Model
	UserID uint
	Status string
	Items  []CartItem // Add this relationship
}


type CartItem struct {
	gorm.Model
	CartID     uint
	MedicineID uint
	Quantity   int
}


/*package models

import "gorm.io/gorm"

type CartItem struct {
	gorm.Model
	CartID     uint
	MedicineID uint
	Quantity   int
}
type CartItem struct {
	gorm.Model
	CartID     uint
	MedicineID uint
	Quantity   int
}*/
/*package models

import "gorm.io/gorm"

type Cart struct {
	gorm.Model
	UserID uint   `gorm:"index" json:"user_id"`
	Status string `json:"status"`
}

type CartItem struct {
	gorm.Model
	CartID             uint   `gorm:"index" json:"cart_id"`
	MedicineID         uint   `json:"medicine_id"`
	Quantity           int    `json:"quantity"`
	OriginalMedicineID uint   `json:"original_medicine_id"`
	Status             string `json:"status"`
}

type CartItemDetail struct {
	ID                   uint    `json:"id"`
	MedicineID           uint    `json:"medicine_id"`
	MedicineName         string  `json:"medicine_name"`
	GenericName          string  `json:"generic_name"`
	PrescriptionRequired bool    `json:"prescription_required"`
	Quantity             int     `json:"quantity"`
	Price                float64 `json:"price"`
	Status               string  `json:"status"`
	HasPrescription      bool    `json:"has_prescription"`
}

type CartResponse struct {
	CartID uint             `json:"cart_id"`
	Status string           `json:"status"`
	Items  []CartItemDetail `json:"items"`
	Total  float64          `json:"total"`
}
*/