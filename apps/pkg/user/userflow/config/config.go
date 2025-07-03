package config

type AddCartRequest struct {
	MedicineID uint `json:"medicineid"`
	Quantity   int  `json:"quantity"`
}

// Struct to return only user-facing fields
type UserFacingMedicine struct {
	ID                   uint     `json:"id"`
	BrandName            string   `json:"brandname"`
	Power                string   `json:"power"`
	GenericName          string   `json:"genericname"`
	Category             string   `json:"category"`
	Description          string   `json:"description"`
	Unit                 string   `json:"unit"`
	MeasurementUnitValue int      `json:"measurementunitvalue"`
	NumberOfPiecesPerBox int      `json:"numberofpiecesperbox"`
	Price                float64  `json:"price"`
	TaxType              string   `json:"taxtype"`
	Prescription         bool     `json:"prescription"`
	Images               []string `json:"images"`
}
