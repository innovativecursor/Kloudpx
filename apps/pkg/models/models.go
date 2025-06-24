package models

import "gorm.io/gorm"

type Admin struct {
	gorm.Model

	FirstName       string
	LastName        string
	Email           string `gorm:"unique;not null" json:"email"`
	EmailVerified   bool
	ApplicationRole string
}

type Generic struct {
	gorm.Model
	GenericName string `gorm:"unique;not null"`
	UpdatedBy   uint
}

type Supplier struct {
	gorm.Model
	SupplierName string `gorm:"not null"`
}

type Category struct {
	gorm.Model
	CategoryName string `gorm:"not null"`
}

type ItemImage struct {
	gorm.Model
	FileName   string
	MedicineID *uint // nullable foreign key
}

type Medicine struct {
	gorm.Model
	BrandName             string `gorm:"not null"`
	GenericID             uint
	Generic               Generic `gorm:"foreignKey:GenericID"`
	SupplierID            uint
	Supplier              Supplier `gorm:"foreignKey:SupplierID"`
	SupplierDiscount      string
	ItemImages            []ItemImage `gorm:"foreignKey:MedicineID"`
	CategoryID            uint
	Category              Category `gorm:"foreignKey:CategoryID"`
	Description           string
	UnitOfMeasurement     string
	MeasurementUnitValue  int
	NumberOfPiecesPerBox  int
	SellingPricePerBox    float64
	SellingPricePerPiece  float64
	CostPricePerBox       float64
	CostPricePerPiece     float64
	TaxType               string
	MinimumThreshold      int
	MaximumThreshold      int
	EstimatedLeadTimeDays int
	Prescription          bool `gorm:"not null"`
	UpdatedBy             uint
}

// Pharmacist
type Pharmacist struct {
	gorm.Model

	FirstName       string
	LastName        string
	Email           string `gorm:"unique;not null" json:"email"`
	EmailVerified   bool
	ApplicationRole string
}
