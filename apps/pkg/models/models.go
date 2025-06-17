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
	Name      string `gorm:"unique;not null"`
	UpdatedBy uint
}

type Medicine struct {
	gorm.Model
	BrandName             string `gorm:"not null"`
	GenericID             uint
	Generic               Generic `gorm:"foreignKey:GenericID"`
	Description           string
	UnitOfMeasurement     string
	NumberOfPiecesPerBox  int
	SellingPricePerBox    float64
	SellingPricePerPiece  float64
	CostPricePerBox       float64
	CostPricePerPiece     float64
	Category              string
	Supplier              string
	TaxType               string
	MinimumThreshold      int
	MaximumThreshold      int
	EstimatedLeadTimeDays int
	UpdatedBy             uint
}
