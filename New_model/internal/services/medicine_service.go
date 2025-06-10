package services

import (
	"kloudpx-api/internal/models"
	"kloudpx-api/internal/repositories"
)

type MedicineService struct {
	repo repositories.MedicineRepository
}

func NewMedicineService(repo repositories.MedicineRepository) *MedicineService {
	return &MedicineService{repo: repo}
}

type MedicineInput struct {
	Name                 string  `json:"name"`
	GenericName          string  `json:"generic_name"`
	Description          string  `json:"description"`
	Price                float64 `json:"price"`
	Stock                int     `json:"stock"`
	PrescriptionRequired bool    `json:"prescription_required"`
}

func (ms *MedicineService) ListMedicines() ([]models.Medicine, error) {
	return ms.repo.FindAll()
}

func (ms *MedicineService) GetMedicine(id int) (*models.Medicine, error) {
	return ms.repo.FindByID(id)
}

func (ms *MedicineService) CreateMedicine(input MedicineInput) (*models.Medicine, error) {
	medicine := &models.Medicine{
		Name:                 input.Name,
		GenericName:          input.GenericName,
		Description:          input.Description,
		Price:                input.Price,
		Stock:                input.Stock,
		PrescriptionRequired: input.PrescriptionRequired,
	}

	return ms.repo.Create(medicine)
}

// Similar methods for Update and Delete