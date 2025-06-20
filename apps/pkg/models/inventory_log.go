package models

import (
	"gorm.io/gorm"
)

type InventoryLog struct {
	gorm.Model
	MedicineID   uint   `gorm:"not null"` // Related medicine
	ChangeAmount int    `gorm:"not null"` // e.g., -5 for sale, +10 for restock
	NewQuantity  int    `gorm:"not null"` // Updated stock after change
	ChangeType   string `gorm:"size:50"`  // e.g., "sale", "restock", "return"
	ChangeReason string `gorm:"size:255"` // Reason for change
	Message      string `gorm:"size:255"` // Optional message (used in admin test)
}
