package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	//Email    *string `gorm:"uniqueIndex;not null"`
	//Password string  `gorm:"not null"`
	//Username string  `gorm:"not null;default:''"`
	ID            uint           `gorm:"primaryKey" json:"id"`
	//Username      string         `gorm:"uniqueIndex;not null" json:"username"`
	Username string `gorm:"not null;default:'unknown'"`

	Password      string         `gorm:"not null" json:"-"`
	Email         *string        `gorm:"type:varchar(100);uniqueIndex" json:"email,omitempty"`
	OAuthID       *string        `gorm:"uniqueIndex" json:"-"`
	OAuthProvider *string        `gorm:"type:varchar(50)" json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	LastLogin     *time.Time     `json:"last_login,omitempty"`
}

type Admin struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Name          string         `gorm:"not null" json:"name"`
	Email         *string        `gorm:"type:varchar(100);uniqueIndex" json:"email,omitempty"`
	OAuthID       *string        `gorm:"uniqueIndex" json:"-"`
	OAuthProvider *string        `gorm:"type:varchar(50)" json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	LastLogin     *time.Time     `json:"last_login,omitempty"`
}

type Supplier struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	AdminID          uint      `gorm:"index" json:"admin_id"`
	SupplierName     string    `gorm:"not null" json:"supplier_name"`
	Cost             float64   `json:"cost"`
	DiscountProvided float64   `json:"discount_provided"`
	QuantityInPiece  int       `json:"quantity_in_piece"`
	QuantityInBox    int       `json:"quantity_in_box"`
	CostPrice        float64   `json:"cost_price"`
	Taxes            float64   `json:"taxes"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type GenericMedicine struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"uniqueIndex;not null" json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Tax struct {
	VAT float64 `json:"vat"`
}

type Medicine struct {
	ID                   uint      `gorm:"primaryKey" json:"id"`
	BrandName            string    `json:"brand_name"`
	GenericID            uint      `json:"generic_id"`
	Description          string    `json:"description"`
	Category             string    `json:"category"`
	QuantityInPieces     int       `json:"stock"`
	Supplier             string    `json:"supplier"`
	PurchasePrice        float64   `json:"purchase_price"`
	SellingPrice         float64   `json:"price"`
	TaxType              string    `json:"tax_type"`
	TaxVAT               float64   `json:"tax_vat"` // For GORM, better to flatten embedded struct
	MinimumThreshold     int       `json:"minimum_threshold"`
	MaximumThreshold     int       `json:"maximum_threshold"`
	EstimatedLeadTime    int       `json:"estimated_lead_time"`
	PrescriptionRequired bool      `json:"prescription_required"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

type MedicineWithGeneric struct {
	Medicine
	Generic GenericMedicine `gorm:"foreignKey:GenericID" json:"generic"`
}

type Pharmacist struct {
	ID            uint       `gorm:"primaryKey" json:"id"`
	Name          string     `gorm:"not null" json:"name"`
	Email         *string    `gorm:"type:varchar(100);uniqueIndex" json:"email,omitempty"`
	Password *string `gorm:"not null" json:"-"`
	OAuthID       *string    `gorm:"uniqueIndex" json:"-"`
	OAuthProvider *string    `gorm:"type:varchar(50)" json:"-"`
	CreatedAt     time.Time  `json:"created_at"`
	LastLogin     *time.Time `json:"last_login,omitempty"`
}

type Cart struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index" json:"user_id"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CartItem struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	CartID             uint      `gorm:"index" json:"cart_id"`
	MedicineID         uint      `json:"medicine_id"`
	Quantity           int       `json:"quantity"`
	OriginalMedicineID uint      `json:"original_medicine_id"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type Prescription struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	CartItemID uint      `gorm:"index" json:"cart_item_id"`
	ImageData  []byte    `gorm:"type:bytea" json:"-"`
	Hash       string    `json:"hash"`
	CreatedAt  time.Time `json:"created_at"`
}

type Order struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `gorm:"index" json:"user_id"`
	CartID     uint      `json:"cart_id"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
	TaxVAT     float64   `json:"tax_vat"`
	CreatedAt  time.Time `json:"created_at"`
}

type RefreshToken struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index" json:"user_id"`
	Token     string    `gorm:"uniqueIndex" json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type CartItemDetail struct {
	ID                   uint    `json:"id"`
	MedicineID           uint    `json:"medicine_id"`
	MedicineName         string  `json:"medicine_name"`
	GenericName          string  `json:"generic_name"`
	PrescriptionRequired bool    `json:"prescription_required"`
	Quantity             int     `json:"quantity"`
	Price                float64 `json:"price"`
	Status               string  `json:"status"`
	HasPrescription      bool    `json:"has_prescription"`
}

type CartResponse struct {
	CartID uint              `json:"cart_id"`
	Status string            `json:"status"`
	Items  []CartItemDetail  `json:"items"`
	Total  float64           `json:"total"`
}

type OrderItem struct {
	Name        string  `json:"name"`
	GenericName string  `json:"generic_name"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	Status      string  `json:"status"`
	ItemTotal   float64 `json:"item_total"`
	TaxVAT      float64 `json:"tax_vat"`
}

type OrderDetails struct {
	OrderID uint        `json:"order_id"`
	Items   []OrderItem `json:"items"`
	Total   float64     `json:"total"`
}

type DirectOrder struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `json:"user_id"`
	MedicineID uint      `json:"medicine_id"`
	Quantity   int       `json:"quantity"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
	TaxVAT     float64   `json:"tax_vat"`
	CreatedAt  time.Time `json:"created_at"`
}

type InventoryLog struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	MedicineID   uint      `gorm:"index" json:"medicine_id"`
	ChangeAmount int       `json:"change_amount"`
	NewQuantity  int       `json:"new_quantity"`
	ChangeType   string    `json:"change_type"`
	ChangeReason string    `json:"change_reason"`
	CreatedAt    time.Time `json:"created_at"`
}

type OAuthUser struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}
