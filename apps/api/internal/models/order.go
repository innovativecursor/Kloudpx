package models

import "time"

type Order struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     uint      `json:"user_id"`
	User       User      `json:"user" gorm:"foreignKey:UserID"`
	MedicineID uint      `json:"medicine_id"`
	Medicine   Medicine  `json:"medicine" gorm:"foreignKey:MedicineID"`
	Quantity   int       `json:"quantity" gorm:"not null"`
	TotalPrice float64   `json:"total_price" gorm:"not null"`
	Status     string    `json:"status" gorm:"default:'pending'"`
	OrderDate  time.Time `json:"order_date" gorm:"autoCreateTime"`
	UpdatedAt  time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}