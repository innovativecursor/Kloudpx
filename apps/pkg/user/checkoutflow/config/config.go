package config

type AddressRequest struct {
	ID            uint   `json:"id"`
	NameResidency string `json:"nameresidency"`
	Region        string `json:"region"`
	Province      string `json:"province"`
	City          string `json:"city"`
	ZipCode       string `json:"zipcode"`
	IsDefault     bool   `json:"isdefault"`
}

type ReqDelivery struct {
	CheckoutSessionID uint   `json:"checkoutsessionid"`
	AddressID         uint   `json:"addressid"`
	DeliveryType      string `json:"deliverytype"`
}

type SelectAddress struct {
	AddressID uint `json:"addressid"`
}
