package config

type RegionRequest struct {
	ID                uint    `json:"id" binding:"required"`
	RegionName        string  `json:"region_name" binding:"required"`
	ZipStart          int     `json:"zip_start" binding:"required"`
	ZipEnd            int     `json:"zip_end" binding:"required"`
	DeliveryTime      string  `json:"delivery_time" binding:"required"`
	FreeShippingLimit float64 `json:"free_shipping_limit" binding:"required"`
	StandardRate      int     `json:"standard_rate" binding:"required"`
}
