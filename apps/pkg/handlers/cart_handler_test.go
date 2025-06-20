package handlers_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Setup in-memory DB and handler
func setupCartTest() (*gorm.DB, *gin.Engine, *handlers.CartHandler) {
	gin.SetMode(gin.TestMode)
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})

	// AutoMigrate required models
	db.AutoMigrate(&models.Cart{}, &models.Medicine{}, &models.CartItem{}, &models.Prescription{}, &models.GenericMedicine{})

	router := gin.Default()
	handler := handlers.NewCartHandler(db)

	return db, router, handler
}

// Helper to attach fake userID
func withUserID(userID uint, h gin.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("userID", userID)
		h(c)
	}
}

func TestCartCRUD(t *testing.T) {
	db, r, h := setupCartTest()

	// Seed medicine
	medicine := models.Medicine{
		BrandName:            "Paracetamol",
		SellingPrice:         10.0,
		QuantityInPieces:     100,
		PrescriptionRequired: false,
	}
	db.Create(&medicine)

	// ---- 1. Create Cart ----
	r.POST("/cart", withUserID(1, h.CreateCart))

	req := httptest.NewRequest(http.MethodPost, "/cart", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusCreated, w.Code)

	var createdCart models.Cart
	json.Unmarshal(w.Body.Bytes(), &createdCart)
	assert.Equal(t, uint(1), createdCart.UserID)

	// ---- 2. Add Item to Cart ----
	r.POST("/cart/:id/item", withUserID(1, h.AddItem))
	itemPayload := map[string]interface{}{
		"medicine_id": medicine.ID,
		"quantity":    2,
	}
	body, _ := json.Marshal(itemPayload)
	req = httptest.NewRequest(http.MethodPost, "/cart/"+toStr(createdCart.ID)+"/item", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusCreated, w.Code)

	// ---- 3. Update Cart Item ----
	var item models.CartItem
	db.First(&item, "cart_id = ? AND medicine_id = ?", createdCart.ID, medicine.ID)
	r.PUT("/cart/item/:itemId", withUserID(1, h.UpdateItem))
	updateBody := map[string]interface{}{
		"quantity": 5,
	}
	body, _ = json.Marshal(updateBody)
	req = httptest.NewRequest(http.MethodPut, "/cart/item/"+toStr(item.ID), bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	var updatedItem models.CartItem
	db.First(&updatedItem, item.ID)
	assert.Equal(t, 5, updatedItem.Quantity)

	// ---- 4. Get Cart ----
	r.GET("/cart/:id", withUserID(1, h.GetCart))
	req = httptest.NewRequest(http.MethodGet, "/cart/"+toStr(createdCart.ID), nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// ---- 5. Remove Cart Item ----
	r.DELETE("/cart/item/:itemId", withUserID(1, h.RemoveItem))
	req = httptest.NewRequest(http.MethodDelete, "/cart/item/"+toStr(item.ID), nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	var deletedItem models.CartItem
	err := db.First(&deletedItem, item.ID).Error
	assert.Error(t, err) // should be not found
}
func toStr(n uint) string {
	return fmt.Sprintf("%d", n)
}
