package config

type MedicineData struct {
	ItemCode                  string  `json:"itemcode"`
	BrandName                 string  `json:"brandname" binding:"required"`
	IsBrand                   bool    `json:"isbrand"`
	InhouseBrand              bool    `json:"inhousebrand"`
	Discount                  string  `json:"discount"`
	Power                     string  `json:"power"`
	GenericID                 uint    `json:"genericid" binding:"required"`
	SupplierID                uint    `json:"supplierid" binding:"required"`
	CategoryID                uint    `json:"categoryid"`
	CategorySubClass          string  `json:"categorysubclass"`
	DosageForm                string  `json:"dosageform"`
	Packaging                 string  `json:"packaging"`
	Marketer                  string  `json:"marketer"`
	SupplierDiscount          string  `json:"supplierdiscount"`
	Description               string  `json:"description"`
	UnitOfMeasurement         string  `json:"unitofmeasurement"`
	MeasurementUnitValue      int     `json:"measurementunitvalue"`
	NumberOfPiecesPerBox      int     `json:"numberofpiecesperbox"`
	SellingPricePerBox        float64 `json:"sellingpriceperbox"`
	SellingPricePerPiece      float64 `json:"sellingpriceperpiece"`
	CostPricePerBox           float64 `json:"costpriceperbox"`
	CostPricePerPiece         float64 `json:"costpriceperpiece"`
	TaxType                   string  `json:"taxtype"`
	MinimumThreshold          int     `json:"minimumthreshold"`
	MaximumThreshold          int     `json:"maximumthreshold"`
	EstimatedLeadTimeDays     int     `json:"estimatedleadtimedays"`
	Prescription              bool    `json:"prescription"`
	IsFeature                 bool    `json:"isfeature"`
	ImageIDs                  []uint  `json:"imageids"`
	Benefits                  string  `json:"benefits"`
	KeyIngredients            string  `json:"keyingredients"`
	RecommendedDailyAllowance string  `json:"recommendeddailyallowance"`
	DirectionsForUse          string  `json:"directionsforuse"`
	SafetyInformation         string  `json:"safetyinformation"`
	Storage                   string  `json:"storage"`
}

type UpdateMedicineData struct {
	BrandName                 string  `json:"brandname" binding:"required"`
	IsBrand                   bool    `json:"isbrand"`
	InhouseBrand              bool    `json:"inhousebrand"`
	Discount                  string  `json:"discount"`
	Power                     string  `json:"power"`
	GenericID                 uint    `json:"genericid" binding:"required"`
	SupplierID                uint    `json:"supplierid" binding:"required"`
	CategoryID                uint    `json:"categoryid"`
	CategoryIconID            uint    `json:"categoryiconid"`
	CategorySubClass          string  `json:"categorysubclass"`
	DosageForm                string  `json:"dosageform"`
	Packaging                 string  `json:"packaging"`
	Marketer                  string  `json:"marketer"`
	SupplierDiscount          string  `json:"supplierdiscount"`
	Description               string  `json:"description"`
	UnitOfMeasurement         string  `json:"unitofmeasurement"`
	MeasurementUnitValue      int     `json:"measurementunitvalue"`
	NumberOfPiecesPerBox      int     `json:"numberofpiecesperbox"`
	SellingPricePerBox        float64 `json:"sellingpriceperbox"`
	SellingPricePerPiece      float64 `json:"sellingpriceperpiece"`
	CostPricePerBox           float64 `json:"costpriceperbox"`
	CostPricePerPiece         float64 `json:"costpriceperpiece"`
	TaxType                   string  `json:"taxtype"`
	MinimumThreshold          int     `json:"minimumthreshold"`
	MaximumThreshold          int     `json:"maximumthreshold"`
	EstimatedLeadTimeDays     int     `json:"estimatedleadtimedays"`
	Prescription              bool    `json:"prescription"`
	IsFeature                 bool    `json:"isfeature"`
	ImageIDs                  []uint  `json:"imageids"`
	Benefits                  string  `json:"benefits"`
	KeyIngredients            string  `json:"keyingredients"`
	RecommendedDailyAllowance string  `json:"recommendeddailyallowance"`
	DirectionsForUse          string  `json:"directionsforuse"`
	SafetyInformation         string  `json:"safetyinformation"`
	Storage                   string  `json:"storage"`
}
