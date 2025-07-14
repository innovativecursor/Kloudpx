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
	CategoryName   string `gorm:"not null"`
	CategoryIconID *uint
	CategoryIcon   CategoryIcon `gorm:"foreignKey:CategoryIconID"`
}

type ItemImage struct {
	gorm.Model
	FileName   string
	MedicineID *uint // nullable foreign key
}

type CategoryIcon struct {
	gorm.Model
	Icon string `gorm:"not null"` // e.g., S3 URL
}

type Medicine struct {
	gorm.Model
	BrandName             string `gorm:"not null"`
	IsBrand               bool
	InhouseBrand          bool
	Discount              string
	Power                 string
	GenericID             uint
	Generic               Generic `gorm:"foreignKey:GenericID"`
	SupplierID            uint
	Supplier              Supplier `gorm:"foreignKey:SupplierID"`
	SupplierDiscount      string
	ItemImages            []ItemImage `gorm:"foreignKey:MedicineID"`
	CategoryID            uint
	Category              Category `gorm:"foreignKey:CategoryID"`
	CategorySubClass      string
	DosageForm            string
	Packaging             string
	Marketer              string
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
	IsFeature             bool
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

// user
// User who uploads prescriptions
type User struct {
	gorm.Model
	FirstName       string
	LastName        string
	Email           string `gorm:"unique"`
	EmailVerified   bool
	ApplicationRole string
}

// Prescription uploaded by a user
type Prescription struct {
	gorm.Model
	UserID        uint
	User          User `gorm:"foreignKey:UserID"`
	UploadedImage string
	Status        string // "unsettled", "fulfilled"
}

// Many-to-many (cart) between prescription and medicines
type Cart struct {
	gorm.Model
	UserID         uint
	PrescriptionID *uint         // Nullable — present only for prescribed medicines
	Prescription   *Prescription // Nullable
	MedicineID     uint
	Medicine       Medicine
	Quantity       int
	IsOTC          bool // NEW: explicitly marks whether it’s OTC
	VisibleToUser  bool `gorm:"default:false"`
}

type CarouselImage struct {
	gorm.Model
	ImageURL string
	IsActive bool
}

type GalleryImage struct {
	gorm.Model
	ImageURL   string
	IsActive   bool
	ButtonText string
}
