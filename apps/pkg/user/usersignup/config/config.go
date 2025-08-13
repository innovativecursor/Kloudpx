package config

type SignupRequest struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email,omitempty"` // optional if signing up with phone
	Phone     string `json:"phone,omitempty"` // optional if signing up with email
	Password  string `json:"password"`        // need to handle required case from frontend
}
