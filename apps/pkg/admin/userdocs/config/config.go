package config

type VerifyPwdPayload struct {
	PwdID  uint   `json:"pwd_id" binding:"required"`
	Status string `json:"status"binding:"required,oneof=approved rejected"` // Approved or Rejected
}
