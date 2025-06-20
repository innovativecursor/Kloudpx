package models

import "gorm.io/gorm"

type Prescription struct {
	gorm.Model
	CartItemID uint   `gorm:"index" json:"cart_item_id"`
	ImageData  []byte `gorm:"type:bytea" json:"-"`
	Hash       string `json:"hash"`
	Status     string
}
