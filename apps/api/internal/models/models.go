
package models

import (
	"database/sql"
	"time"
)

type User struct {
	ID            int            `json:"id"`
	Username      string         `json:"username"`
	Password      string         `json:"-"`
	Email         sql.NullString `json:"email,omitempty"`
	OAuthID       sql.NullString `json:"-"`
	OAuthProvider sql.NullString `json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	LastLogin     sql.NullTime   `json:"last_login,omitempty"`
}

type Admin struct {
	ID            int            `json:"id"`
	Name          string         `json:"name"`
	Email         string         `json:"email"`
	OAuthID       string         `json:"-"`
	OAuthProvider string         `json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	LastLogin     sql.NullTime   `json:"last_login,omitempty"`
}

type Supplier struct {
	ID               int       `json:"id"`
	AdminID          int       `json:"admin_id"`
	SupplierName     string    `json:"supplier_name"`
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
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Tax struct {
	VAT float64 `json:"vat"`
}

type Medicine struct {
	ID                   int       `json:"id"`
	BrandName            string    `json:"name"`
	GenericID            int       `json:"generic_id"`
	Description          string    `json:"description"`
	Category             string    `json:"category"`
	QuantityInPieces     int       `json:"stock"`
	Supplier             string    `json:"supplier"`
	PurchasePrice        float64   `json:"purchase_price"`
	SellingPrice         float64   `json:"price"`
	TaxType              string    `json:"tax_type"`
	Tax                  Tax       `json:"tax"`
	MinimumThreshold     int       `json:"minimum_threshold"`
	MaximumThreshold     int       `json:"maximum_threshold"`
	EstimatedLeadTime    int       `json:"estimated_lead_time"`
	PrescriptionRequired bool      `json:"prescription_required"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

type MedicineWithGeneric struct {
	Medicine
	Generic GenericMedicine `json:"generic"`
}

type Pharmacist struct {
	ID            int            `json:"id"`
	Name          string         `json:"name"`
	Email         string         `json:"email"`
	OAuthID       string         `json:"-"`
	OAuthProvider string         `json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	LastLogin     sql.NullTime   `json:"last_login,omitempty"`
}

type Cart struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CartItem struct {
	ID                 int       `json:"id"`
	CartID             int       `json:"cart_id"`
	MedicineID         int       `json:"medicine_id"`
	Quantity           int       `json:"quantity"`
	OriginalMedicineID int       `json:"original_medicine_id"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type Prescription struct {
	ID         int       `json:"id"`
	CartItemID int       `json:"cart_item_id"`
	ImageData  []byte    `json:"-"`
	Hash       string    `json:"hash"`
	CreatedAt  time.Time `json:"created_at"`
}

type Order struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	CartID     int       `json:"cart_id"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
	Tax        Tax       `json:"tax"`
	CreatedAt  time.Time `json:"created_at"`
}

type RefreshToken struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type CartItemDetail struct {
	ID                   int     `json:"id"`
	MedicineID           int     `json:"medicine_id"`
	MedicineName         string  `json:"medicine_name"`
	GenericName          string  `json:"generic_name"`
	PrescriptionRequired bool    `json:"prescription_required"`
	Quantity             int     `json:"quantity"`
	Price                float64 `json:"price"`
	Status               string  `json:"status"`
	HasPrescription      bool    `json:"has_prescription"`
}

type CartResponse struct {
	CartID int              `json:"cart_id"`
	Status string           `json:"status"`
	Items  []CartItemDetail `json:"items"`
	Total  float64          `json:"total"`
}

type OrderItem struct {
	Name        string  `json:"name"`
	GenericName string  `json:"generic_name"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	Status      string  `json:"status"`
	ItemTotal   float64 `json:"item_total"`
	Tax         Tax     `json:"tax"`
}

type OrderDetails struct {
	OrderID int         `json:"order_id"`
	Items   []OrderItem `json:"items"`
	Total   float64     `json:"total"`
}

type DirectOrder struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	MedicineID int       `json:"medicine_id"`
	Quantity   int       `json:"quantity"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
	Tax        Tax       `json:"tax"`
	CreatedAt  time.Time `json:"created_at"`
}

type InventoryLog struct {
	ID           int       `json:"id"`
	MedicineID   int       `json:"medicine_id"`
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
/*package models

import (
	"database/sql"
	"time"
)

type User struct {
	ID            int            `json:"id"`
	Username      string         `json:"username"`
	Password      string         `json:"-"`
	Email         sql.NullString `json:"email,omitempty"`
	OAuthID       sql.NullString `json:"-"`
	OAuthProvider sql.NullString `json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	LastLogin     sql.NullTime   `json:"last_login,omitempty"`
}

type Admin struct {
	ID            int            `json:"id"`
	Name          string         `json:"name"`
	Email         string         `json:"email"`
	OAuthID       string         `json:"-"`
	OAuthProvider string         `json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	LastLogin     sql.NullTime   `json:"last_login,omitempty"`
}

type Supplier struct {
	ID               int       `json:"id"`
	AdminID          int       `json:"admin_id"`
	SupplierName     string    `json:"supplier_name"`
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
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Tax struct {
	VAT float64 `json:"vat"`
}

type Medicine struct {
	ID                   int       `json:"id"`
	BrandName            string    `json:"name"`
	GenericID            int       `json:"generic_id"`
	Description          string    `json:"description"`
	Category             string    `json:"category"`
	QuantityInPieces     int       `json:"stock"`
	Supplier             string    `json:"supplier"`
	PurchasePrice        float64   `json:"purchase_price"`
	SellingPrice         float64   `json:"price"`
	TaxType              string    `json:"tax_type"`
	Tax                  Tax       `json:"tax"`
	MinimumThreshold     int       `json:"minimum_threshold"`
	MaximumThreshold     int       `json:"maximum_threshold"`
	EstimatedLeadTime    int       `json:"estimated_lead_time"`
	PrescriptionRequired bool      `json:"prescription_required"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

type MedicineWithGeneric struct {
	Medicine
	Generic GenericMedicine `json:"generic"`
}

type Pharmacist struct {
	ID            int            `json:"id"`
	Name          string         `json:"name"`
	Email         string         `json:"email"`
	OAuthID       string         `json:"-"`
	OAuthProvider string         `json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	LastLogin     sql.NullTime   `json:"last_login,omitempty"`
}

type Cart struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CartItem struct {
	ID                 int       `json:"id"`
	CartID             int       `json:"cart_id"`
	MedicineID         int       `json:"medicine_id"`
	Quantity           int       `json:"quantity"`
	OriginalMedicineID int       `json:"original_medicine_id"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type Prescription struct {
	ID         int       `json:"id"`
	CartItemID int       `json:"cart_item_id"`
	ImageData  []byte    `json:"-"`
	Hash       string    `json:"hash"`
	CreatedAt  time.Time `json:"created_at"`
}

type Order struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	CartID     int       `json:"cart_id"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
	Tax        Tax       `json:"tax"`
	CreatedAt  time.Time `json:"created_at"`
}

type RefreshToken struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type CartItemDetail struct {
	ID                   int     `json:"id"`
	MedicineID           int     `json:"medicine_id"`
	MedicineName         string  `json:"medicine_name"`
	GenericName          string  `json:"generic_name"`
	PrescriptionRequired bool    `json:"prescription_required"`
	Quantity             int     `json:"quantity"`
	Price                float64 `json:"price"`
	Status               string  `json:"status"`
	HasPrescription      bool    `json:"has_prescription"`
}

type CartResponse struct {
	CartID int              `json:"cart_id"`
	Status string           `json:"status"`
	Items  []CartItemDetail `json:"items"`
	Total  float64          `json:"total"`
}

type OrderItem struct {
	Name        string  `json:"name"`
	GenericName string  `json:"generic_name"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	Status      string  `json:"status"`
	ItemTotal   float64 `json:"item_total"`
	Tax         Tax     `json:"tax"`
}

type OrderDetails struct {
	OrderID int         `json:"order_id"`
	Items   []OrderItem `json:"items"`
	Total   float64     `json:"total"`
}

type DirectOrder struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	MedicineID int       `json:"medicine_id"`
	Quantity   int       `json:"quantity"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
	Tax        Tax       `json:"tax"`
	CreatedAt  time.Time `json:"created_at"`
}

type InventoryLog struct {
	ID           int       `json:"id"`
	MedicineID   int       `json:"medicine_id"`
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
*/