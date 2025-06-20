package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	assert.NoError(t, err)
	err = db.AutoMigrate(&models.Medicine{}, &models.GenericMedicine{}, &models.InventoryLog{}, &models.CartItem{})
	assert.NoError(t, err)
	return db
}

func setupRouter(handler *handlers.MedicineHandler) *gin.Engine {
	r := gin.Default()
	r.POST("/medicines", handler.CreateMedicine)
	r.GET("/medicines/:id", handler.GetMedicine)
	r.DELETE("/medicines/:id", handler.DeleteMedicine)
	r.PUT("/medicines/:id/inventory", handler.UpdateInventory)
	return r
}
func TestCreateGetDeleteMedicine(t *testing.T) {
	db := setupTestDB(t)

	// Insert a generic medicine first
	generic := models.GenericMedicine{Name: "Paracetamol"}
	assert.NoError(t, db.Create(&generic).Error)

	handler := handlers.NewMedicineHandler(db)
	router := setupRouter(handler)

	// Create a medicine
	medicineData := models.Medicine{
		BrandName:        "Crocin",
		GenericID:        generic.ID,
		QuantityInPieces: 100,
		SellingPrice:     25.0,
	}
	body, _ := json.Marshal(medicineData)

	req := httptest.NewRequest(http.MethodPost, "/medicines", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var created models.Medicine
	err := json.Unmarshal(w.Body.Bytes(), &created)
	assert.NoError(t, err)
	assert.Equal(t, "Crocin", created.BrandName)

	idStr := strconv.Itoa(int(created.ID))

	// Get the medicine
	req = httptest.NewRequest(http.MethodGet, "/medicines/"+idStr, nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// Delete the medicine
	req = httptest.NewRequest(http.MethodDelete, "/medicines/"+idStr, nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdateInventory(t *testing.T) {
	db := setupTestDB(t)

	// Insert generic and medicine
	generic := models.GenericMedicine{Name: "Ibuprofen"}
	db.Create(&generic)
	medicine := models.Medicine{
		BrandName:        "Brufen",
		GenericID:        generic.ID,
		QuantityInPieces: 50,
		SellingPrice:     15,
	}
	db.Create(&medicine)

	handler := handlers.NewMedicineHandler(db)
	router := setupRouter(handler)

	// Inventory update payload
	payload := map[string]interface{}{
		"change_amount": 20,
		"reason":        "Stock refill",
	}
	body, _ := json.Marshal(payload)

	url := "/medicines/" + strconv.Itoa(int(medicine.ID)) + "/inventory"
	req := httptest.NewRequest(http.MethodPut, url, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Verify updated quantity
	var updated models.Medicine
	err := db.First(&updated, medicine.ID).Error
	assert.NoError(t, err)
	assert.Equal(t, 70, updated.QuantityInPieces)
}
