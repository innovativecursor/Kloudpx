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
	BrandName                 string `gorm:"not null"`
	IsBrand                   bool
	InhouseBrand              bool
	Discount                  string
	Power                     string
	GenericID                 uint
	Generic                   Generic `gorm:"foreignKey:GenericID"`
	SupplierID                uint
	Supplier                  Supplier `gorm:"foreignKey:SupplierID"`
	SupplierDiscount          string
	ItemImages                []ItemImage `gorm:"foreignKey:MedicineID"`
	CategoryID                uint
	Category                  Category `gorm:"foreignKey:CategoryID"`
	CategorySubClass          string
	DosageForm                string
	Packaging                 string
	Marketer                  string
	Description               string
	UnitOfMeasurement         string
	MeasurementUnitValue      int
	NumberOfPiecesPerBox      int
	SellingPricePerBox        float64
	SellingPricePerPiece      float64
	CostPricePerBox           float64
	CostPricePerPiece         float64
	TaxType                   string
	MinimumThreshold          int
	MaximumThreshold          int
	EstimatedLeadTimeDays     int
	Prescription              bool `gorm:"not null"`
	IsFeature                 bool
	Benefits                  string
	KeyIngredients            string
	RecommendedDailyAllowance string
	DirectionsForUse          string
	SafetyInformation         string
	Storage                   string
	UpdatedBy                 uint
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
	UserID            uint
	PrescriptionID    *uint         // Nullable — present only for prescribed medicines
	Prescription      *Prescription // Nullable
	MedicineID        uint
	Medicine          Medicine
	Quantity          int
	IsOTC             bool // NEW: explicitly marks whether it’s OTC
	CheckoutSessionID *uint
	IsSavedForLater   bool `gorm:"default:false"`
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

type Midwives struct {
	gorm.Model
	FirstName    string `gorm:"not null"`
	LastName     string `gorm:"not null"`
	MiddleName   string
	Municipality string `gorm:"not null"`
	Province     string `gorm:"not null"`
}

type Hospital struct {
	gorm.Model
	Region       string `gorm:"not null"`
	Province     string `gorm:"not null"`
	Name         string `gorm:"not null"`
	BedCount     int
	Category     string
	Telephone    string
	Email        string
	Street       string
	Municipality string
	Sector       string
	Head         string
}

type Physician struct {
	gorm.Model
	FirstName    string `gorm:"not null"`
	LastName     string `gorm:"not null"`
	MiddleName   string
	Specialty    string `gorm:"not null"`
	Municipality string `gorm:"not null"`
	Province     string `gorm:"not null"`
}

type KonsultaProvider struct {
	gorm.Model
	Region       string `gorm:"not null"`
	Province     string `gorm:"not null"`
	FacilityName string `gorm:"not null"`
	Telephone    string
	Email        string
	Street       string
	Municipality string `gorm:"not null"`
	Sector       string
	Head         string
}

type Dentist struct {
	gorm.Model
	LastName     string `gorm:"not null" json:"last_name"`
	FirstName    string `gorm:"not null" json:"first_name"`
	MiddleName   string `json:"middle_name"`
	Municipality string `json:"municipality"`
	Province     string `json:"province"`
}

type Address struct {
	gorm.Model
	UserID        uint
	User          User `gorm:"foreignKey:UserID"`
	NameResidency string
	Region        string
	Province      string
	City          string
	ZipCode       string
	IsDefault     bool
}

type CheckoutSession struct {
	gorm.Model
	UserID       uint
	AddressID    *uint
	DeliveryType string
	DeliveryCost int
	Status       string // pending, completed
	CartItems    []Cart `gorm:"foreignKey:CheckoutSessionID"`
}
