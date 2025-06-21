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

// Setup in-memory DB and handler with routes pre-registered
func setupCartTest() (*gorm.DB, *gin.Engine) {
	gin.SetMode(gin.TestMode)
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})

	// AutoMigrate required models
	db.AutoMigrate(&models.Cart{}, &models.Medicine{}, &models.CartItem{}, &models.Prescription{}, &models.GenericMedicine{})

	router := gin.Default()
	handler := handlers.NewCartHandler(db)

	// Register routes up front
	router.POST("/cart", withUserID(1, handler.CreateCart))
	router.POST("/cart/:id/item", withUserID(1, handler.AddItem))
	router.PUT("/cart/item/:itemId", withUserID(1, handler.UpdateItem))
	router.GET("/cart/:id", withUserID(1, handler.GetCart))
	router.DELETE("/cart/item/:itemId", withUserID(1, handler.RemoveItem))

	return db, router
}

// Inject fake userID into request context
func withUserID(userID uint, h gin.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("userID", userID)
		h(c)
	}
}

func TestCartCRUD(t *testing.T) {
	db, r := setupCartTest()

	// ---- Seed medicine ----
	medicine := models.Medicine{
		BrandName:            "Paracetamol",
		SellingPrice:         10.0,
		QuantityInPieces:     100,
		PrescriptionRequired: false,
	}
	db.Create(&medicine)

	// ---- 1. Create Cart ----
	req := httptest.NewRequest(http.MethodPost, "/cart", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusCreated, w.Code)

	var createdCart models.Cart
	err := json.Unmarshal(w.Body.Bytes(), &createdCart)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), createdCart.UserID)
	assert.NotZero(t, createdCart.ID)
	t.Logf("Created Cart ID: %d", createdCart.ID)

	// ---- 2. Add Item to Cart ----
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
	err = db.First(&item, "cart_id = ? AND medicine_id = ?", createdCart.ID, medicine.ID).Error
	assert.NoError(t, err)

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
	req = httptest.NewRequest(http.MethodGet, "/cart/"+toStr(createdCart.ID), nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// ---- 5. Remove Cart Item ----
	req = httptest.NewRequest(http.MethodDelete, "/cart/item/"+toStr(item.ID), nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	var deletedItem models.CartItem
	err = db.First(&deletedItem, item.ID).Error
	assert.Error(t, err) // Expect record not found
}

// Helper function to convert uint to string
func toStr(n uint) string {
	return fmt.Sprintf("%d", n)
}
