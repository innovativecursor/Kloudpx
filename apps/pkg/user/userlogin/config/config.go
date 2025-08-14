package config

type LoginRequest struct {
	Phone string `json:"phone"`
}

type VerifyOTP struct {
	Phone string `json:"phone"`
	OTP   string `json:"otp"`
}
