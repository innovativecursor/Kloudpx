package models

import "time"

type Supplier struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Email       string    `json:"email" gorm:"unique;not null"`
	Phone       string    `json:"phone" gorm:"not null"`
	Address     string    `json:"address"`
	ContactPerson string  `json:"contact_person"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}