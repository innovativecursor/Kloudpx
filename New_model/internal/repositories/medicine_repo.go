package repositories

import (
	"database/sql"
	"kloudpx-api/internal/models"
)

type MedicineRepository interface {
	FindAll() ([]models.Medicine, error)
	FindByID(id int) (*models.Medicine, error)
	Create(medicine *models.Medicine) (*models.Medicine, error)
	Update(medicine *models.Medicine) error
	Delete(id int) error
}

type medicineRepository struct {
	db *sql.DB
}

func NewMedicineRepository(db *sql.DB) MedicineRepository {
	return &medicineRepository{db: db}
}

func (mr *medicineRepository) FindAll() ([]models.Medicine, error) {
	// Implementation using sql.DB
}

func (mr *medicineRepository) FindByID(id int) (*models.Medicine, error) {
	// Implementation using sql.DB
}

// Implement other methods