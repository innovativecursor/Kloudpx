package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
)

func setupMedicineTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	assert.NoError(t, err)

	err = db.AutoMigrate(&models.Medicine{}, &models.GenericMedicine{}, &models.InventoryLog{})
	assert.NoError(t, err)

	return db
}

func getMedicineRouter(h *handlers.MedicineHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	r.POST("/medicines", h.CreateMedicine)
	r.GET("/medicines", h.GetMedicines)
	r.GET("/medicines/:id", h.GetMedicine)
	r.PUT("/medicines/:id", h.UpdateMedicine)
	r.DELETE("/medicines/:id", h.DeleteMedicine)
	r.PUT("/medicines/:id/inventory", h.UpdateInventory)
	r.GET("/medicines/search", h.SearchMedicines)

	return r
}

func TestCreateMedicine(t *testing.T) {
	db := setupMedicineTestDB(t)
	h := handlers.NewMedicineHandler(db)
	r := getMedicineRouter(h)

	medicine := models.Medicine{BrandName: "TestMed", QuantityInPieces: 100, SellingPrice: 10.5}
	jsonValue, _ := json.Marshal(medicine)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/medicines", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestGetMedicines(t *testing.T) {
	db := setupMedicineTestDB(t)
	db.Create(&models.Medicine{BrandName: "Panadol"})

	h := handlers.NewMedicineHandler(db)
	r := getMedicineRouter(h)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/medicines", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetMedicine(t *testing.T) {
	db := setupMedicineTestDB(t)
	medicine := models.Medicine{BrandName: "Tylenol"}
	db.Create(&medicine)

	h := handlers.NewMedicineHandler(db)
	r := getMedicineRouter(h)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/medicines/"+strconv.Itoa(int(medicine.ID)), nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdateMedicine(t *testing.T) {
	db := setupMedicineTestDB(t)
	medicine := models.Medicine{BrandName: "OldName", QuantityInPieces: 10, SellingPrice: 20.0}
	db.Create(&medicine)

	h := handlers.NewMedicineHandler(db)
	r := getMedicineRouter(h)

	update := map[string]interface{}{"brand_name": "NewName", "quantity_in_pieces": 50}
	jsonValue, _ := json.Marshal(update)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/medicines/"+strconv.Itoa(int(medicine.ID)), bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestDeleteMedicine(t *testing.T) {
	db := setupMedicineTestDB(t)
	medicine := models.Medicine{BrandName: "DeleteMe"}
	db.Create(&medicine)

	h := handlers.NewMedicineHandler(db)
	r := getMedicineRouter(h)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/medicines/"+strconv.Itoa(int(medicine.ID)), nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdateInventory(t *testing.T) {
	db := setupMedicineTestDB(t)
	medicine := models.Medicine{BrandName: "StockMed", QuantityInPieces: 10}
	db.Create(&medicine)

	h := handlers.NewMedicineHandler(db)
	r := getMedicineRouter(h)

	update := map[string]interface{}{"quantity_change": 5, "reason": "Restock"}
	jsonValue, _ := json.Marshal(update)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/medicines/"+strconv.Itoa(int(medicine.ID))+"/inventory", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestSearchMedicines(t *testing.T) {
	db := setupMedicineTestDB(t)
	db.Create(&models.Medicine{BrandName: "SearchMe"})

	h := handlers.NewMedicineHandler(db)
	r := getMedicineRouter(h)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/medicines/search?q=SearchMe", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
