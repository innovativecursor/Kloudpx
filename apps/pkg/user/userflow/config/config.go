package config

type AddCartRequest struct {
	MedicineID uint `json:"medicineid"`
	Quantity   int  `json:"quantity"`
}
