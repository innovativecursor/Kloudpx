package models

import (
	"time"

	"gorm.io/gorm"
)

type Pharmacist struct {
	gorm.Model
	Name          string     `gorm:"not null" json:"name"`
	Email         *string    `gorm:"type:varchar(100);uniqueIndex" json:"email,omitempty"`
	Password      *string    `gorm:"not null" json:"-"`
	OAuthID       *string    `gorm:"uniqueIndex" json:"-"`
	OAuthProvider *string    `gorm:"type:varchar(50)" json:"-"`
	LastLogin     *time.Time `json:"last_login,omitempty"`
}
