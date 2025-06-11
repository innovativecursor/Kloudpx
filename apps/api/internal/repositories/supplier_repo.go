package repositories

import (
	"errors"
	"gorm.io/gorm"
	"/models"
)

type SupplierRepository struct {
	db *gorm.DB
}

func NewSupplierRepository(db *gorm.DB) *SupplierRepository {
	return &SupplierRepository{db: db}
}

func (r *SupplierRepository) Create(supplier *models.Supplier) error {
	return r.db.Create(supplier).Error
}

func (r *SupplierRepository) FindAll() ([]models.Supplier, error) {
	var suppliers []models.Supplier
	err := r.db.Find(&suppliers).Error
	return suppliers, err
}

func (r *SupplierRepository) FindByID(id uint) (models.Supplier, error) {
	var supplier models.Supplier
	err := r.db.First(&supplier, id).Error
	return supplier, err
}

func (r *SupplierRepository) Update(supplier *models.Supplier) error {
	return r.db.Save(supplier).Error
}

func (r *SupplierRepository) Delete(id uint) error {
	result := r.db.Delete(&models.Supplier{}, id)
	if result.RowsAffected == 0 {
		return errors.New("supplier not found")
	}
	return result.Error
}

func (r *SupplierRepository) FindByEmail(email string) (models.Supplier, error) {
	var supplier models.Supplier
	err := r.db.Where("email = ?", email).First(&supplier).Error
	return supplier, err
}