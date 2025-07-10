package config

type CategoryData struct {
	Category string `json:"category"`
}

// category icon
type CategoryIconRequest struct {
	Icon string `json:"icon" binding:"required"`
}

type AssignIcon struct {
	CategoryID uint `json:"category_id" binding:"required"`
	IconID     uint `json:"icon_id" binding:"required"`
}
