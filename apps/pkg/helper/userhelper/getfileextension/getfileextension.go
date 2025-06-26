package getfileextension

import (
	"errors"
	"net/http"
)

// extensionMap is a mapping of MIME types to file extensions
var extensionMap = map[string]string{
	"image/jpeg":    "jpg",
	"image/png":     "png",
	"image/gif":     "gif",
	"image/svg+xml": "svg",
	// Add more mappings as needed
}

// GetFileExtension extracts the file extension from the given base64 decoded image data
func GetFileExtension(decodeImage []byte) (string, error) {
	// Check the MIME type of the decoded image data
	mimeType := http.DetectContentType(decodeImage)

	// Check if the MIME type is in the extension map
	if extension, exists := extensionMap[mimeType]; exists {
		return extension, nil
	}

	// If not found in the extension map, return an error
	return "", errors.New("unable to determine file extension")

}
