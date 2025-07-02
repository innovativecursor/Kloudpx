package config

type UploadImagesPayload struct {
	Images []string `json:"images" binding:"required"` // base64 strings
}
