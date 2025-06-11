package repositories

import (
	"kloudpx-api/internal/models"
	"errors"
	"gorm.io/gorm"
)

type MedicineRepository struct {
	db *gorm.DB
}

func NewMedicineRepository(db *gorm.DB) *MedicineRepository {
	return &MedicineRepository{db: db}
}

func (r *MedicineRepository) Create(medicine *models.Medicine) error {
	return r.db.Create(medicine).Error
}

func (r *MedicineRepository) FindAll() ([]models.Medicine, error) {
	var medicines []models.Medicine
	err := r.db.Preload("Supplier").Find(&medicines).Error
	return medicines, err
}

func (r *MedicineRepository) FindByID(id uint) (models.Medicine, error) {
	var medicine models.Medicine
	err := r.db.Preload("Supplier").First(&medicine, id).Error
	return medicine, err
}

func (r *MedicineRepository) Update(medicine *models.Medicine) error {
	return r.db.Save(medicine).Error
}

func (r *MedicineRepository) Delete(id uint) error {
	result := r.db.Delete(&models.Medicine{}, id)
	if result.RowsAffected == 0 {
		return errors.New("medicine not found")
	}
	return result.Error
}

func (r *MedicineRepository) SearchByName(name string) ([]models.Medicine, error) {
	var medicines []models.Medicine
	err := r.db.Where("name LIKE ?", "%"+name+"%").Find(&medicines).Error
	return medicines, err
}
/*
type MedicineRepository interface {
	Create(medicine *models.Medicine) error
	GetByID(id uint) (*models.Medicine, error)
	GetByGenericName(name string) ([]models.Medicine, error)
	Update(medicine *models.Medicine) error
	Delete(id uint) error
}

type medicineRepository struct {
	db *gorm.DB
}

func NewMedicineRepository(db *gorm.DB) MedicineRepository {
	return &medicineRepository{db: db}
}

func (r *medicineRepository) Create(medicine *models.Medicine) error {
	return r.db.Create(medicine).Error
}

func (r *medicineRepository) GetByID(id uint) (*models.Medicine, error) {
	var medicine models.Medicine
	if err := r.db.Preload("Supplier").First(&medicine, id).Error; err != nil {
		return nil, err
	}
	return &medicine, nil
}

func (r *medicineRepository) GetByGenericName(name string) ([]models.Medicine, error) {
	var medicines []models.Medicine
	if err := r.db.Where("generic_name = ?", name).Find(&medicines).Error; err != nil {
		return nil, err
	}
	return medicines, nil
}

func (r *medicineRepository) Update(medicine *models.Medicine) error {
	return r.db.Save(medicine).Error
}

func (r *medicineRepository) Delete(id uint) error {
	return r.db.Delete(&models.Medicine{}, id).Error
}*/