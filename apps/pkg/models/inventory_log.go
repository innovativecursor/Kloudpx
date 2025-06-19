package models

import "gorm.io/gorm"

type InventoryLog struct {
	gorm.Model
	MedicineID   uint   `gorm:"index" json:"medicine_id"`
	ChangeAmount int    `json:"change_amount"`
	NewQuantity  int    `json:"new_quantity"`
	ChangeType   string `json:"change_type"`
	ChangeReason string `json:"change_reason"`
}
