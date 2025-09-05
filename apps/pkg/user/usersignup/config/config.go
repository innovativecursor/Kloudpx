package config

type SignUpReq struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
}

type VerifySignUpReq struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	Email     string `json:"email"`
	OTP       string `json:"otp"`
}

type ResendOTPReq struct {
	Phone string `json:"phone" binding:"required"`
}
