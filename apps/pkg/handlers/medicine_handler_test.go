package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(
		&models.GenericMedicine{},
		&models.Medicine{},
		&models.InventoryLog{},
		&models.CartItem{},
	)

	return db
}

func createGenericMedicine(db *gorm.DB, name string) models.GenericMedicine {
	generic := models.GenericMedicine{Name: name}
	db.Create(&generic)
	return generic
}

func createMedicine(db *gorm.DB, brandName string, genericID uint) models.Medicine {
	medicine := models.Medicine{
		BrandName:        brandName,
		GenericID:        genericID,
		SellingPrice:     9.99,
		QuantityInPieces: 100,
	}
	db.Create(&medicine)
	return medicine
}

func TestMedicineHandler_CreateMedicine(t *testing.T) {
	db := setupTestDB()
	handler := handlers.NewMedicineHandler(db)
	generic := createGenericMedicine(db, "Paracetamol")

	t.Run("Create valid medicine", func(t *testing.T) {
		medicine := models.Medicine{
			BrandName:        "Panadol",
			GenericID:        generic.ID,
			SellingPrice:     5.99,
			QuantityInPieces: 100,
		}

		body, _ := json.Marshal(medicine)
		req, _ := http.NewRequest("POST", "/medicines", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.CreateMedicine(rr, req)

		assert.Equal(t, http.StatusCreated, rr.Code)

		var response models.Medicine
		json.Unmarshal(rr.Body.Bytes(), &response)
		assert.Equal(t, "Panadol", response.BrandName)
		assert.Equal(t, generic.ID, response.GenericID)
	})

	t.Run("Create with missing brand name", func(t *testing.T) {
		medicine := models.Medicine{
			GenericID:        generic.ID,
			SellingPrice:     5.99,
			QuantityInPieces: 100,
		}

		body, _ := json.Marshal(medicine)
		req, _ := http.NewRequest("POST", "/medicines", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.CreateMedicine(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Brand name is required")
	})

	t.Run("Create with invalid generic", func(t *testing.T) {
		medicine := models.Medicine{
			BrandName:        "InvalidGeneric",
			GenericID:        999, // Non-existent ID
			SellingPrice:     5.99,
			QuantityInPieces: 100,
		}

		body, _ := json.Marshal(medicine)
		req, _ := http.NewRequest("POST", "/medicines", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.CreateMedicine(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Generic medicine not found")
	})
}

func TestMedicineHandler_GetMedicine(t *testing.T) {
	db := setupTestDB()
	handler := handlers.NewMedicineHandler(db)
	generic := createGenericMedicine(db, "Ibuprofen")
	medicine := createMedicine(db, "Advil", generic.ID)

	t.Run("Get existing medicine", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/medicines/"+string(rune(medicine.ID)), nil)
		rr := httptest.NewRecorder()

		handler.GetMedicine(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var response struct {
			Medicine models.Medicine
		}
		json.Unmarshal(rr.Body.Bytes(), &response)
		assert.Equal(t, "Advil", response.Medicine.BrandName)
		assert.Equal(t, "Ibuprofen", response.Medicine.Generic.Name)
	})

	t.Run("Get non-existent medicine", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/medicines/999", nil)
		rr := httptest.NewRecorder()

		handler.GetMedicine(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
		assert.Contains(t, rr.Body.String(), "Medicine not found")
	})

	t.Run("Get with invalid ID", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/medicines/invalid", nil)
		rr := httptest.NewRecorder()

		handler.GetMedicine(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Invalid medicine ID")
	})
}

func TestMedicineHandler_UpdateMedicine(t *testing.T) {
	db := setupTestDB()
	handler := handlers.NewMedicineHandler(db)
	generic := createGenericMedicine(db, "Lisinopril")
	medicine := createMedicine(db, "Zestril", generic.ID)

	t.Run("Update valid fields", func(t *testing.T) {
		update := map[string]interface{}{
			"brand_name":    "Updated Brand",
			"selling_price": 12.99,
		}

		body, _ := json.Marshal(update)
		req, _ := http.NewRequest("PUT", "/medicines/"+string(rune(medicine.ID)), bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.UpdateMedicine(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var response models.Medicine
		json.Unmarshal(rr.Body.Bytes(), &response)
		assert.Equal(t, "Updated Brand", response.BrandName)
		assert.Equal(t, 12.99, response.SellingPrice)
	})

	t.Run("Update with invalid generic", func(t *testing.T) {
		update := map[string]interface{}{
			"generic_id": 999,
		}

		body, _ := json.Marshal(update)
		req, _ := http.NewRequest("PUT", "/medicines/"+string(rune(medicine.ID)), bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.UpdateMedicine(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Generic medicine not found")
	})

	t.Run("Update non-existent medicine", func(t *testing.T) {
		update := map[string]interface{}{"brand_name": "Non-existent"}
		body, _ := json.Marshal(update)
		req, _ := http.NewRequest("PUT", "/medicines/999", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.UpdateMedicine(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
	})
}

func TestMedicineHandler_DeleteMedicine(t *testing.T) {
	db := setupTestDB()
	handler := handlers.NewMedicineHandler(db)
	generic := createGenericMedicine(db, "Atorvastatin")
	medicine := createMedicine(db, "Lipitor", generic.ID)

	t.Run("Delete existing medicine", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", "/medicines/"+string(rune(medicine.ID)), nil)
		rr := httptest.NewRecorder()

		handler.DeleteMedicine(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "Medicine deleted successfully")
	})

	t.Run("Delete non-existent medicine", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", "/medicines/999", nil)
		rr := httptest.NewRecorder()

		handler.DeleteMedicine(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
	})

	t.Run("Delete medicine in cart", func(t *testing.T) {
		medInCart := createMedicine(db, "InCart", generic.ID)
		db.Create(&models.CartItem{MedicineID: medInCart.ID})

		req, _ := http.NewRequest("DELETE", "/medicines/"+string(rune(medInCart.ID)), nil)
		rr := httptest.NewRecorder()

		handler.DeleteMedicine(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Cannot delete medicine that is in active carts")
	})
}

func TestMedicineHandler_UpdateInventory(t *testing.T) {
	db := setupTestDB()
	handler := handlers.NewMedicineHandler(db)
	generic := createGenericMedicine(db, "Omeprazole")
	medicine := createMedicine(db, "Prilosec", generic.ID)

	t.Run("Add inventory", func(t *testing.T) {
		update := map[string]interface{}{
			"change_amount": 50,
			"reason":        "Restock",
		}

		body, _ := json.Marshal(update)
		req, _ := http.NewRequest("POST", "/medicines/"+string(rune(medicine.ID))+"/inventory", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.UpdateInventory(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "Inventory updated")
		assert.Contains(t, rr.Body.String(), "150") // Original 100 + 50

		var med models.Medicine
		db.First(&med, medicine.ID)
		assert.Equal(t, 150, med.QuantityInPieces)
	})

	t.Run("Remove too much inventory", func(t *testing.T) {
		update := map[string]interface{}{
			"change_amount": -200,
			"reason":        "Overuse",
		}

		body, _ := json.Marshal(update)
		req, _ := http.NewRequest("POST", "/medicines/"+string(rune(medicine.ID))+"/inventory", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.UpdateInventory(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Insufficient stock")
	})
}

func TestMedicineHandler_GetMedicines(t *testing.T) {
	db := setupTestDB()
	handler := handlers.NewMedicineHandler(db)
	generic := createGenericMedicine(db, "Metformin")
	createMedicine(db, "Glucophage", generic.ID)
	createMedicine(db, "Fortamet", generic.ID)

	t.Run("Get all medicines", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/medicines", nil)
		rr := httptest.NewRecorder()

		handler.GetMedicines(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var response struct {
			Medicines []models.Medicine
		}
		json.Unmarshal(rr.Body.Bytes(), &response)
		assert.Len(t, response.Medicines, 2)
	})

	t.Run("Filter by category", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/medicines?category=Diabetes", nil)
		rr := httptest.NewRecorder()

		handler.GetMedicines(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
	})
}

func TestMedicineHandler_SearchMedicines(t *testing.T) {
	db := setupTestDB()
	handler := handlers.NewMedicineHandler(db)
	generic := createGenericMedicine(db, "Sertraline")
	createMedicine(db, "Zoloft", generic.ID)

	t.Run("Search by brand name", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/medicines/search?q=Zoloft", nil)
		rr := httptest.NewRecorder()

		handler.SearchMedicines(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "Zoloft")
	})

	t.Run("Search by generic name", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/medicines/search?q=Sertraline", nil)
		rr := httptest.NewRecorder()

		handler.SearchMedicines(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "Zoloft")
	})
}
