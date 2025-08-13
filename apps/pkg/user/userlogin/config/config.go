package config

type LoginRequest struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"` // need to handle binding:"required" from frontend
}
