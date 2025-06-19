package models

import (
	"time"

	"gorm.io/gorm"
)

type Admin struct {
	gorm.Model
	FirstName     string     `json:"first_name"`
	LastName      string     `json:"last_name"`
	Email         string     `gorm:"unique;not null" json:"email"`
	EmailVerified bool       `json:"email_verified"`
	OAuthID       *string    `gorm:"uniqueIndex" json:"-"`
	OAuthProvider *string    `gorm:"type:varchar(50)" json:"-"`
	LastLogin     *time.Time `json:"last_login,omitempty"`
}
