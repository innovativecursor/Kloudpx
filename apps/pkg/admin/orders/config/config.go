package config

type UpdateOrderDetailsRequest struct {
	Status         string  `json:"status"`
	PaidAmount     float64 `json:"paid_amount"`
	ShippingNumber string  `json:"shipping_number"`
}
