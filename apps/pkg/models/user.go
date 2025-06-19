package models

import (
	"time"

	"gorm.io/gorm"
)

// User model for regular application users
type User struct {
	gorm.Model
	Username      string     `gorm:"not null;default:'unknown'" json:"username"`
	Password      string     `gorm:"not null" json:"-"`
	Email         *string    `gorm:"type:varchar(100);uniqueIndex" json:"email,omitempty"`
	OAuthID       *string    `gorm:"uniqueIndex" json:"-"`
	OAuthProvider *string    `gorm:"type:varchar(50)" json:"-"`
	LastLogin     *time.Time `json:"last_login,omitempty"`
}

// RefreshToken model for storing refresh tokens for users
type RefreshToken struct {
	gorm.Model
	UserID    uint      `gorm:"index" json:"user_id"`
	Token     string    `gorm:"uniqueIndex" json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
}

// TokenPair structure for access and refresh tokens in responses
type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
