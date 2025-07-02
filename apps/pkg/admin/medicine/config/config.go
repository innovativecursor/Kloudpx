package config

type MedicineData struct {
	BrandName             string  `json:"brandname" binding:"required"`
	Power                 string  `json:"power"`
	GenericID             uint    `json:"genericid" binding:"required"`
	SupplierID            uint    `json:"supplierid" binding:"required"`
	CategoryID            uint    `json:"categoryid"`
	SupplierDiscount      string  `json:"supplierdiscount"`
	Description           string  `json:"description"`
	UnitOfMeasurement     string  `json:"unitofmeasurement"`
	MeasurementUnitValue  int     `json:"measurementunitvalue"`
	NumberOfPiecesPerBox  int     `json:"numberofpiecesperbox"`
	SellingPricePerBox    float64 `json:"sellingpriceperbox"`
	SellingPricePerPiece  float64 `json:"sellingpriceperpiece"`
	CostPricePerBox       float64 `json:"costpriceperbox"`
	CostPricePerPiece     float64 `json:"costpriceperpiece"`
	TaxType               string  `json:"taxtype"`
	MinimumThreshold      int     `json:"minimumthreshold"`
	MaximumThreshold      int     `json:"maximumthreshold"`
	EstimatedLeadTimeDays int     `json:"estimatedleadtimedays"`
	Prescription          bool    `json:"prescription"`
	ImageIDs              []uint  `json:"imageids"`
}

type UpdateMedicineData struct {
	BrandName             string  `json:"brandname" binding:"required"`
	Power                 string  `json:"power"`
	GenericID             uint    `json:"genericid" binding:"required"`
	SupplierID            uint    `json:"supplierid" binding:"required"`
	CategoryID            uint    `json:"categoryid"`
	SupplierDiscount      string  `json:"supplierdiscount"`
	Description           string  `json:"description"`
	UnitOfMeasurement     string  `json:"unitofmeasurement"`
	MeasurementUnitValue  int     `json:"measurementunitvalue"`
	NumberOfPiecesPerBox  int     `json:"numberofpiecesperbox"`
	SellingPricePerBox    float64 `json:"sellingpriceperbox"`
	SellingPricePerPiece  float64 `json:"sellingpriceperpiece"`
	CostPricePerBox       float64 `json:"costpriceperbox"`
	CostPricePerPiece     float64 `json:"costpriceperpiece"`
	TaxType               string  `json:"taxtype"`
	MinimumThreshold      int     `json:"minimumthreshold"`
	MaximumThreshold      int     `json:"maximumthreshold"`
	EstimatedLeadTimeDays int     `json:"estimatedleadtimedays"`
	Prescription          bool    `json:"prescription"`
	ImageIDs              []uint  `json:"imageids"`
}
