package models

import (
	//"time"
	"golang.org/x/crypto/bcrypt"
)

/*type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"not null"`
	Email        string    `json:"email" gorm:"unique;not null"`
	Password     string    `json:"-" gorm:"default:null"` // Null for OAuth users
	Role         string    `json:"role" gorm:"default:'user'"`
	Provider     string    `json:"provider" gorm:"default:'local'"` // 'local', 'google', etc.
	ProviderID   string    `json:"provider_id" gorm:"default:null"` // ID from OAuth provider
	Avatar       string    `json:"avatar" gorm:"default:null"`      // URL to profile picture
	RefreshToken string    `json:"-" gorm:"default:null"`           // For OAuth refresh
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
*/
// HashPassword hashes the user's password
func (u *User) HashPassword() error {
	if u.Password == "" {
		return nil // Skip for OAuth users
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// CheckPassword checks if the provided password is correct
func (u *User) CheckPassword(password string) error {
	if u.Provider != "local" {
		return errors.New("password authentication not available for OAuth users")
	}
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}