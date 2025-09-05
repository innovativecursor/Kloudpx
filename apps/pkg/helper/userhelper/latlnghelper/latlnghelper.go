package latlnghelper

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Coordinates holds latitude & longitude
type Coordinates struct {
	Lat string `json:"lat"`
	Lng string `json:"lng"`
}

// ZipToCoordinates takes a pincode and returns coordinates using Nominatim API
func ZipToCoordinates(zipcode string, countryCode string) (Coordinates, error) {
	url := fmt.Sprintf("https://nominatim.openstreetmap.org/search?postalcode=%s&country=%s&format=json&limit=1", zipcode, countryCode)

	resp, err := http.Get(url)
	if err != nil {
		return Coordinates{}, err
	}
	defer resp.Body.Close()

	var result []struct {
		Lat string `json:"lat"`
		Lon string `json:"lon"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return Coordinates{}, err
	}

	if len(result) == 0 {
		return Coordinates{}, fmt.Errorf("no coordinates found for pincode %s", zipcode)
	}

	return Coordinates{Lat: result[0].Lat, Lng: result[0].Lon}, nil
}
