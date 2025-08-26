package config

type UpdateProfileInput struct {
	FullName string  `json:"full_name" binding:"required"`
	Phone    *string `json:"phone"`
	DOB      string  `json:"dob" binding:"required"` // frontend sends DOB as YYYY-MM-DD
	Gender   string  `json:"gender" binding:"required,oneof=Male Female Other"`
}

type PwdPayload struct {
	File string `json:"file" binding:"required"` // base64-encoded certificate
}
