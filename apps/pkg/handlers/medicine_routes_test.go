package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	assert.NoError(t, err)

	err = db.AutoMigrate(&models.Medicine{}, &models.GenericMedicine{}, &models.InventoryLog{}, &models.CartItem{})
	assert.NoError(t, err)

	return db
}

func getTestRouter(h *handlers.MedicineHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	r.POST("/medicines", h.CreateMedicine)
	r.GET("/medicines/:id", h.GetMedicine)
	r.PUT("/medicines/:id", h.UpdateMedicine)
	r.DELETE("/medicines/:id", h.DeleteMedicine)
	r.GET("/medicines", h.GetMedicines)
	r.POST("/medicines/:id/inventory", h.UpdateInventory)
	r.GET("/medicines/search", h.SearchMedicines)

	return r
}

func TestCreateMedicine(t *testing.T) {
	db := setupTestDB(t)
	db.Create(&models.GenericMedicine{Name: "Paracetamol"})

	h := handlers.NewMedicineHandler(db)
	r := getTestRouter(h)

	medicine := map[string]interface{}{
		"brand_name":         "Calpol",
		"generic_id":         1,
		"selling_price":      10.0,
		"quantity_in_pieces": 100,
	}
	body, _ := json.Marshal(medicine)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/medicines", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestGetMedicine(t *testing.T) {
	db := setupTestDB(t)
	gm := models.GenericMedicine{Name: "Ibuprofen"}
	db.Create(&gm)
	med := models.Medicine{BrandName: "Brufen", GenericID: gm.ID, SellingPrice: 5.0, QuantityInPieces: 20}
	db.Create(&med)

	h := handlers.NewMedicineHandler(db)
	r := getTestRouter(h)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/medicines/1", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdateMedicine(t *testing.T) {
	db := setupTestDB(t)
	gm := models.GenericMedicine{Name: "Amoxicillin"}
	db.Create(&gm)
	med := models.Medicine{BrandName: "Mox", GenericID: gm.ID, SellingPrice: 8.0, QuantityInPieces: 10}
	db.Create(&med)

	h := handlers.NewMedicineHandler(db)
	r := getTestRouter(h)

	update := map[string]interface{}{
		"brand_name":    "Mox DT",
		"selling_price": 9.5,
	}
	body, _ := json.Marshal(update)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/medicines/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestDeleteMedicine(t *testing.T) {
	db := setupTestDB(t)
	gm := models.GenericMedicine{Name: "Cetrizine"}
	db.Create(&gm)
	med := models.Medicine{BrandName: "Cetirizine", GenericID: gm.ID, SellingPrice: 4.0, QuantityInPieces: 50}
	db.Create(&med)

	h := handlers.NewMedicineHandler(db)
	r := getTestRouter(h)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/medicines/1", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdateInventory(t *testing.T) {
	db := setupTestDB(t)
	gm := models.GenericMedicine{Name: "Metformin"}
	db.Create(&gm)
	med := models.Medicine{BrandName: "Gluformin", GenericID: gm.ID, SellingPrice: 3.0, QuantityInPieces: 25}
	db.Create(&med)

	h := handlers.NewMedicineHandler(db)
	r := getTestRouter(h)

	update := map[string]interface{}{
		"change_amount": 10,
		"reason":        "Restock",
	}
	body, _ := json.Marshal(update)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/medicines/1/inventory", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestSearchMedicines(t *testing.T) {
	db := setupTestDB(t)
	gm := models.GenericMedicine{Name: "Pantoprazole"}
	db.Create(&gm)
	med := models.Medicine{BrandName: "Pan-D", GenericID: gm.ID, SellingPrice: 12.0, Description: "For acidity"}
	db.Create(&med)

	h := handlers.NewMedicineHandler(db)
	r := getTestRouter(h)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/medicines/search?q=pan", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
