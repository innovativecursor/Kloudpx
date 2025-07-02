package config

type CategoryData struct {
	Category string `json:"category"`
	IconID   uint   `json:"iconid" binding:"required"`
}

// category icon
type CategoryIconRequest struct {
	Icon string `json:"icon" binding:"required"`
}
