package config

type Req struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
}

type VerifySignUpReq struct {
	Phone string `json:"phone"`
	OTP   string `json:"otp"`
}
