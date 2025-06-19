package config

type MedicineData struct {
	BrandName             string  `json:"brandname" binding:"required"`
	GenericID             uint    `json:"genericid" binding:"required"`
	SupplierID            uint    `json:"supplierid" binding:"required"`
	Description           string  `json:"description"`
	UnitOfMeasurement     string  `json:"unitofmeasurement"`
	NumberOfPiecesPerBox  int     `json:"numberofpieces_per_box"`
	SellingPricePerBox    float64 `json:"sellingpriceperbox"`
	SellingPricePerPiece  float64 `json:"sellingpriceperpiece"`
	CostPricePerBox       float64 `json:"costpriceperbox"`
	CostPricePerPiece     float64 `json:"costpriceperpiece"`
	Category              string  `json:"category"`
	TaxType               string  `json:"taxtype"`
	MinimumThreshold      int     `json:"minimumthreshold"`
	MaximumThreshold      int     `json:"maximumthreshold"`
	EstimatedLeadTimeDays int     `json:"estimatedleadtimedays"`
	Prescription          bool    `json:"prescription" binding:"required"`
}

type UpdateMedicineData struct {
	BrandName             string  `json:"brandname" binding:"required"`
	GenericID             uint    `json:"genericid" binding:"required"`
	SupplierID            uint    `json:"supplierid" binding:"required"`
	Description           string  `json:"description"`
	UnitOfMeasurement     string  `json:"unitofmeasurement"`
	NumberOfPiecesPerBox  int     `json:"numberofpieces_per_box"`
	SellingPricePerBox    float64 `json:"sellingpriceperbox"`
	SellingPricePerPiece  float64 `json:"sellingpriceperpiece"`
	CostPricePerBox       float64 `json:"costpriceperbox"`
	CostPricePerPiece     float64 `json:"costpriceperpiece"`
	Category              string  `json:"category"`
	TaxType               string  `json:"taxtype"`
	MinimumThreshold      int     `json:"minimumthreshold"`
	MaximumThreshold      int     `json:"maximumthreshold"`
	EstimatedLeadTimeDays int     `json:"estimatedleadtimedays"`
	Prescription          bool    `json:"prescription" binding:"required"`
}
