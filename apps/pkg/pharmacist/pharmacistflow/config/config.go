package config

type AddMedicineRequest struct {
	MedicineID uint `json:"medicineid"`
	Quantity   int  `json:"quantity"`
}

// update medicine
type UpdateMedicineRequest struct {
	MedicineID uint `json:"medicineid"`
	Quantity   int  `json:"quantity"`
}
