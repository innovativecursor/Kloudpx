package config

type AddressRequest struct {
	ID            uint   `json:"id"`
	NameResidency string `json:"nameresidency"`
	Region        string `json:"region"`
	Province      string `json:"province"`
	Barangay      string `json:"barangay"`
	City          string `json:"city"`
	ZipCode       string `json:"zipcode"`
	PhoneNumber   string `json:"phonenumber"`
	IsDefault     bool   `json:"isdefault"`
	AddressTypeID uint   `json:"address_type_id"`
}

type ReqDelivery struct {
	CheckoutSessionID uint   `json:"checkoutsessionid"`
	AddressID         uint   `json:"addressid"`
	DeliveryType      string `json:"deliverytype"`
}

type SelectAddress struct {
	AddressID uint `json:"addressid"`
}

type SubmitPaymentRequest struct {
	CheckoutSessionID string `json:"checkout_session_id"`
	PaymentNumber     string `json:"payment_number"`
	Remark            string `json:"remark"`
	ScreenshotBase64  string `json:"screenshot_base64"`
}
type UserFacingMedicine struct {
	ID                        uint     `json:"id"`
	BrandName                 string   `json:"brand_name"`
	Power                     string   `json:"power"`
	GenericName               string   `json:"generic_name"`
	Discount                  string   `json:"discount"`
	Category                  string   `json:"category"`
	Description               string   `json:"description"`
	Unit                      string   `json:"unit"`
	MeasurementUnitValue      int      `json:"measurement_unit_value"`
	NumberOfPiecesPerBox      int      `json:"number_of_pieces_per_box"`
	Price                     float64  `json:"price"`
	TaxType                   float64  `json:"tax_type"`
	Prescription              bool     `json:"prescription"`
	Benefits                  string   `json:"benefits"`
	KeyIngredients            string   `json:"key_ingredients"`
	RecommendedDailyAllowance string   `json:"recommended_daily_allowance"`
	DirectionsForUse          string   `json:"directions_for_use"`
	SafetyInformation         string   `json:"safety_information"`
	Storage                   string   `json:"storage"`
	Images                    []string `json:"images"`
}

type CartResponse struct {
	CartID             uint               `json:"cart_id"`
	Quantity           int                `json:"quantity"`
	Medicine           UserFacingMedicine `json:"medicine"`
	PrescriptionStatus string             `json:"prescription_status"`
}

type ReqPaymentType struct {
	CheckoutSessionID uint   `json:"checkout_session_id"`
	PaymentType       string `json:"payment_type"` // GCOD or COD
}

type SelectClinicDoctorRequest struct {
	CartIDs []uint `json:"cart_ids"`

	// If selected from dropdowns
	HospitalID  *uint `json:"hospital_id"`
	PhysicianID *uint `json:"physician_id"`

	// If entered manually
	CustomHospital  string `json:"custom_hospital"`
	CustomPhysician string `json:"custom_physician"`
}
