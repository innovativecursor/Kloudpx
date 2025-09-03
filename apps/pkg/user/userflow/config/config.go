package config

type AddCartRequest struct {
	MedicineID uint `json:"medicineid"`
	Quantity   int  `json:"quantity"`
}

type AddCartRequestMedicine struct {
	MedicineID     uint `json:"medicineid"`
	Quantity       int  `json:"quantity"`
	PrescriptionId uint `json:"prescriptionid"`
}

type CartResponse struct {
	CartID             uint               `json:"cart_id"`
	Quantity           int                `json:"quantity"`
	Medicine           UserFacingMedicine `json:"medicine"`
	PrescriptionStatus string             `json:"prescription_status"`
}

// Struct to return only user-facing fields
type UserFacingMedicine struct {
	ID                        uint     `json:"id"`
	BrandName                 string   `json:"brandname"`
	Power                     string   `json:"power"`
	GenericName               string   `json:"genericname"`
	Discount                  string   `json:"discount"`
	Category                  string   `json:"category"`
	Description               string   `json:"description"`
	Unit                      string   `json:"unit"`
	MeasurementUnitValue      int      `json:"measurementunitvalue"`
	NumberOfPiecesPerBox      int      `json:"numberofpiecesperbox"`
	Price                     float64  `json:"price"`
	TaxType                   float64  `json:"taxtype"`
	Prescription              bool     `json:"prescription"`
	Benefits                  string   `json:"benefits"`
	KeyIngredients            string   `json:"keyingredients"`
	RecommendedDailyAllowance string   `json:"recommendeddailyallowance"`
	DirectionsForUse          string   `json:"directionsforuse"`
	SafetyInformation         string   `json:"safetyinformation"`
	Storage                   string   `json:"storage"`
	Images                    []string `json:"images"`
}

type CategoryWithMedicines struct {
	ID           uint                 `json:"id"`
	CategoryName string               `json:"categoryname"`
	IconURL      string               `json:"iconurl"`
	Medicines    []UserFacingMedicine `json:"medicines"`
}

type AddCartQuantity struct {
	Action   string `json:"action"` // "increase" or "decrease"
	Quantity int    `json:"quantity" binding:"required"`
}
