package repositories

import (
	"errors"
	"gorm.io/gorm"
	"your-app-name/models"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindAll() ([]models.User, error) {
	var users []models.User
	err := r.db.Find(&users).Error
	return users, err
}

func (r *UserRepository) FindByID(id uint) (models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	return user, err
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id uint) error {
	result := r.db.Delete(&models.User{}, id)
	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}
	return result.Error
}

func (r *UserRepository) FindByEmail(email string) (models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return user, err
}

func (r *UserRepository) FindByProvider(provider, providerID string) (models.User, error) {
	var user models.User
	err := r.db.Where("provider = ? AND provider_id = ?", provider, providerID).First(&user).Error
	return user, err
}

func (r *UserRepository) CreateOrUpdateFromOAuth(user *models.User) error {
	existing, err := r.FindByProvider(user.Provider, user.ProviderID)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// User doesn't exist, create new
		return r.Create(user)
	} else if err != nil {
		return err
	}

	// Update existing user
	existing.Name = user.Name
	existing.Email = user.Email
	existing.Avatar = user.Avatar
	return r.Update(&existing)
}
/*package models

import "gorm.io/gorm"

type Role string

const (
	RoleAdmin    Role = "admin"
	RoleChemist  Role = "chemist"
	RoleCustomer Role = "customer"
)

type User struct {
	gorm.Model
	Email     string `gorm:"unique;not null"`
	Name      string
	AvatarURL string
	Role      Role `gorm:"default:'customer'"`
	Provider  string
}

type Admin struct {
	gorm.Model
	UserID uint `gorm:"unique"`
	User   User
}

type Chemist struct {
	gorm.Model
	UserID    uint `gorm:"unique"`
	User      User
	LicenseNo string
}

type Customer struct {
	gorm.Model
	UserID  uint `gorm:"unique"`
	User    User
	Phone   string
	Address string
}*/