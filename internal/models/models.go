/*package models

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Admin struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Pharmacist struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Medicine struct {
	ID                   int     `json:"id"`
	Name                 string  `json:"name"`
	GenericName          string  `json:"generic_name"`
	PrescriptionRequired bool    `json:"prescription_required"`
	Stock                int     `json:"stock"`
	Price                float64 `json:"price"`
}

type Cart struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Status string `json:"status"`
}

type CartItem struct {
	ID                int    `json:"id"`
	CartID            int    `json:"cart_id"`
	MedicineID        int    `json:"medicine_id"`
	Quantity          int    `json:"quantity"`
	OriginalMedicineID int    `json:"original_medicine_id"`
	Status            string `json:"status"`
}

type Prescription struct {
	ID          int    `json:"id"`
	CartItemID  int    `json:"cart_item_id"`
	ImageData   []byte `json:"image_data"`
	Hash        string `json:"hash"`
}

type CartDetails struct {
	CartID int
	UserID int
	Items  []CartItemDetail
}

type CartItemDetail struct {
	ID                int
	MedicineID        int
	MedicineName      string
	GenericName       string
	PrescriptionRequired bool
	Quantity          int
	Price             float64
	Status            string
}*/
//package models
/*
import (
	"database/sql"
	"time"
)
*/
/*
package models

import (
	"database/sql"
	"time"
)

/*type Medicine struct {
	ID                  int       `json:"id"`
	BrandName           string    `json:"brand_name"`
	GenericName         string    `json:"generic_name"`
	Description         string    `json:"description"`
	Category            string    `json:"category"`
	QuantityInPieces    int       `json:"quantity_in_pieces"`
	Supplier            string    `json:"supplier"`
	PurchasePrice       float64   `json:"purchase_price"`
	SellingPrice        float64   `json:"selling_price"`
	TaxType             string    `json:"tax_type"`
	TaxRate             float64   `json:"tax_rate"`
	MinimumThreshold    int       `json:"minimum_threshold"`
	MaximumThreshold    int       `json:"maximum_threshold"`
	EstimatedLeadTime   int       `json:"estimated_lead_time"`
	PrescriptionRequired bool     `json:"prescription_required"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}*/
/*type Medicine struct {
	ID                  int       `json:"id"`
	BrandName           string    `json:"name"`                // Updated JSON tag
	GenericName         string    `json:"generic_name"`
	Description         string    `json:"description"`
	Category            string    `json:"category"`
	QuantityInPieces    int       `json:"stock"`               // Updated JSON tag
	Supplier            string    `json:"supplier"`
	PurchasePrice       float64   `json:"purchase_price"`
	SellingPrice        float64   `json:"price"`               // Updated JSON tag
	TaxType             string    `json:"tax_type"`
	TaxRate             float64   `json:"tax_rate"`
	MinimumThreshold    int       `json:"minimum_threshold"`
	MaximumThreshold    int       `json:"maximum_threshold"`
	EstimatedLeadTime   int       `json:"estimated_lead_time"`
	PrescriptionRequired bool     `json:"prescription_required"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

type DirectOrder struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	MedicineID int       `json:"medicine_id"`
	Quantity   int       `json:"quantity"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
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
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}

type Pharmacist struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}

/*type Medicine struct {
	ID                   int       `json:"id"`
	Name                 string    `json:"name"`
	GenericName          string    `json:"generic_name"`
	PrescriptionRequired bool      `json:"prescription_required"`
	Stock                int       `json:"stock"`
	Price                float64   `json:"price"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}
*/
/*type Cart struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CartItem struct {
	ID                int       `json:"id"`
	CartID            int       `json:"cart_id"`
	MedicineID        int       `json:"medicine_id"`
	Quantity          int       `json:"quantity"`
	OriginalMedicineID int       `json:"original_medicine_id"`
	Status            string    `json:"status"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type Prescription struct {
	ID          int       `json:"id"`
	CartItemID  int       `json:"cart_item_id"`
	ImageData   []byte    `json:"-"`
	Hash        string    `json:"hash"`
	CreatedAt   time.Time `json:"created_at"`
}

type Order struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	CartID     int       `json:"cart_id"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}
type RefreshToken struct {10
++
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
}

type OrderDetails struct {
	OrderID int         `json:"order_id"`
	Items   []OrderItem `json:"items"`
	Total   float64     `json:"total"`
}

type OAuthUser struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}
*/
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
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}

type Pharmacist struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}

type Medicine struct {
	ID                   int       `json:"id"`
	BrandName            string    `json:"name"` // JSON tag alias
	GenericName          string    `json:"generic_name"`
	Description          string    `json:"description"`
	Category             string    `json:"category"`
	QuantityInPieces     int       `json:"stock"` // JSON tag alias
	Supplier             string    `json:"supplier"`
	PurchasePrice        float64   `json:"purchase_price"`
	SellingPrice         float64   `json:"price"` // JSON tag alias
	TaxType              string    `json:"tax_type"`
	TaxRate              float64   `json:"tax_rate"`
	MinimumThreshold     int       `json:"minimum_threshold"`
	MaximumThreshold     int       `json:"maximum_threshold"`
	EstimatedLeadTime    int       `json:"estimated_lead_time"`
	PrescriptionRequired bool      `json:"prescription_required"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
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
