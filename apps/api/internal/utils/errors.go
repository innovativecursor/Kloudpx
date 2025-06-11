package utils

import "errors"

var (
	ErrInvalidToken      = errors.New("invalid token")
	ErrUnauthorized      = errors.New("unauthorized")
	ErrForbidden         = errors.New("forbidden")
	ErrNotFound          = errors.New("not found")
	ErrInvalidInput      = errors.New("invalid input")
	ErrInternalServer    = errors.New("internal server error")
	ErrFileUpload        = errors.New("file upload error")
	ErrInvalidFileType   = errors.New("invalid file type")
	ErrFileSizeExceeded  = errors.New("file size exceeded")
)