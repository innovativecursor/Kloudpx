package models

import (
	"time"

	"gorm.io/gorm"
)

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
	ItemCode                  string `gorm:"uniqueIndex;default:null"`
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
	TaxType                   float64
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
	Email           *string `gorm:"unique"`
	Phone           *string `gorm:"unique"`
	DOB             string
	Age             int
	Gender          string
	EmailVerified   bool
	PhoneVerified   bool
	ApplicationRole string
}

type PwdCard struct {
	gorm.Model
	ID         uint   `gorm:"primaryKey"`
	UserID     uint   `gorm:"index"`
	FileURL    string // Path to uploaded certificate
	UploadedAt time.Time
	UpdatedAt  time.Time
	//TODO: Need confirmation to add this field
	//Status     string `gorm:"default:Pending"` // Pending, Approved, Rejected
}

type OTP struct {
	gorm.Model
	ID        uint `gorm:"primaryKey"`
	Phone     string
	Code      string
	ExpiresAt time.Time
}

type LoginSession struct {
	gorm.Model
	ID        uint `gorm:"primaryKey"`
	UserID    uint
	JWTToken  string
	UserAgent string
	IP        string
	ExpiresAt time.Time
}

// Prescription uploaded by a user
type Prescription struct {
	gorm.Model
	UserID        uint
	User          User `gorm:"foreignKey:UserID"`
	UploadedImage string
	Status        string // "unsettled", "fulfilled"
	IsSelected    bool   `gorm:"default:false"`
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
	IsSavedForLater   bool   `gorm:"default:false"`
	MedicineStatus    string `gorm:"default:'unsettled'"` // "approved", "rejected", "unsettled"
	HospitalID        *uint
	Hospital          *Hospital `gorm:"foreignKey:HospitalID"`
	PhysicianID       *uint
	Physician         *Physician `gorm:"foreignKey:PhysicianID"`
}

type CartHistory struct {
	gorm.Model
	UserID            uint
	PrescriptionID    *uint
	Prescription      *Prescription
	MedicineID        uint
	Medicine          Medicine
	Quantity          int
	IsOTC             bool
	CheckoutSessionID uint
	IsSavedForLater   bool
	MedicineStatus    string
	OrderNumber       string
	HospitalID        *uint
	Hospital          *Hospital `gorm:"foreignKey:HospitalID"`
	PhysicianID       *uint
	Physician         *Physician `gorm:"foreignKey:PhysicianID"`
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
	Link       string
}

type Midwives struct {
	gorm.Model
	MidwifeCode  string `gorm:"uniqueIndex;default:null"`
	FirstName    string `gorm:"not null"`
	LastName     string `gorm:"not null"`
	MiddleName   string
	Municipality string `gorm:"not null"`
	Province     string `gorm:"not null"`
}

type Hospital struct {
	gorm.Model
	HospitalCode string `gorm:"uniqueIndex;default:null"`
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
	PhysicianCode string `gorm:"uniqueIndex;default:null"`
	FirstName     string `gorm:"not null"`
	LastName      string `gorm:"not null"`
	MiddleName    string
	Specialty     string `gorm:"not null"`
	Municipality  string `gorm:"not null"`
	Province      string `gorm:"not null"`
}

type KonsultaProvider struct {
	gorm.Model
	ProviderCode string `gorm:"uniqueIndex;default:null"`
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
	DentistCode  string `gorm:"uniqueIndex;default:null"`
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
	Barangay      string
	City          string
	ZipCode       string
	PhoneNumber   string
	IsDefault     bool
}

type CheckoutSession struct {
	gorm.Model
	UserID       uint
	AddressID    *uint
	DeliveryType string
	DeliveryCost int
	TotalCost    float64
	GrandTotal   float64
	Status       string // pending, completed
	CartItems    []Cart `gorm:"foreignKey:CheckoutSessionID"`
}

type Payment struct {
	gorm.Model
	UserID            uint
	CheckoutSessionID uint
	OrderNumber       string
	PaymentNumber     string
	ScreenshotURL     string
	Remark            float64
	Status            string // Not Paid, Partially Paid, Paid, Cancelled
	User              User
	CheckoutSession   CheckoutSession
}

type Order struct {
	gorm.Model
	UserID            uint
	CheckoutSessionID uint
	OrderNumber       string
	TotalAmount       float64
	DeliveryAddress   string
	PaidAmount        float64
	PaymentType       string
	ShippingNumber    string
	DeliveryType      string
	Status            string          // e.g., "processing", "queued", "completed"
	User              User            `gorm:"foreignKey:UserID"`
	CheckoutSession   CheckoutSession `gorm:"foreignKey:CheckoutSessionID"`
}

type RegionSetting struct {
	gorm.Model
	RegionName        string  `gorm:"unique;not null"` // NCR, Luzon, Visayas, Mindanao
	ZipStart          int     `gorm:"not null"`
	ZipEnd            int     `gorm:"not null"`
	DeliveryTime      string  `gorm:"not null"` // e.g., "2-3 days"
	FreeShippingLimit float64 `gorm:"not null"`
	StandardRate      int     `gorm:"not null"`
}

type OrderExplanationVideo struct {
	gorm.Model
	VideoURL   string
	IsActive   bool
	UploadedBy uint
}
