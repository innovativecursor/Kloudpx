package lalamovehelper

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/latlnghelper"
)

type QuotationRequest struct {
	ServiceType string `json:"serviceType"`
	Stops       []Stop `json:"stops"`
	Weight      string `json:"weight"`
}

type Stop struct {
	Coordinates Coordinates `json:"coordinates"`
	Address     string      `json:"address"`
}

type Coordinates struct {
	Lat string `json:"lat"`
	Lng string `json:"lng"`
}

type QuotationResponse struct {
	QuotationID string `json:"quotationId"`
	Amount      int    `json:"price"`
	ETA         string `json:"deliveryTime"`
}

// GetQuotation fetches a delivery quotation
func GetQuotation(zipcode string, weight float64) (*QuotationResponse, error) {
	// Hardcoded pickup coordinates
	pickupCoords := Coordinates{Lat: "14.5995", Lng: "120.9842"}

	// Get dropoff coordinates from zipcode (India used here)
	dropoffCoordsRaw, err := latlnghelper.ZipToCoordinates(zipcode, "PH")
	if err != nil {
		return nil, fmt.Errorf("failed to get coordinates for zipcode %s: %v", zipcode, err)
	}

	// Convert between helper.Coordinates → lalamovehelper.Coordinates
	dropoffCoords := Coordinates{
		Lat: dropoffCoordsRaw.Lat,
		Lng: dropoffCoordsRaw.Lng,
	}

	// Build quotation request
	req := QuotationRequest{
		ServiceType: "MOTORCYCLE", // or VAN, depends on market
		Stops: []Stop{
			{Coordinates: pickupCoords, Address: "Pickup Address"},
			{Coordinates: dropoffCoords, Address: "Dropoff Address"},
		},
		Weight: fmt.Sprintf("%.1f", weight),
	}

	payload, _ := json.Marshal(req)

	client := &http.Client{}
	apiKey := "pk_test_bd53f31d4a639b71bc25cab2ad354611"
	secret := "sk_test_Boj8VFv/zKp26u3a+eW3ioliwNUSKr+mzcEdcq+A4NKhyAEAf9FNWck8D8BgThGt"
	path := "/v3/quotations"
	timestamp := fmt.Sprint(time.Now().Unix())

	rawSignature := fmt.Sprintf("%s\n%s\n%s", timestamp, "POST", path)
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(rawSignature))
	signature := hex.EncodeToString(h.Sum(nil))

	request, _ := http.NewRequest("POST", "https://sandbox-rest.lalamove.com/v3/quotations", bytes.NewBuffer(payload))
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", fmt.Sprintf("hmac %s:%s:%s", apiKey, timestamp, signature))
	request.Header.Set("Market", "PH_MNL") // depends on market

	resp, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result QuotationResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}
