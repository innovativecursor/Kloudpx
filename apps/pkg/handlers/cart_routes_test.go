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

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	assert.NoError(t, err)

	err = db.AutoMigrate(&models.User{}, &models.Cart{}, &models.CartItem{}, &models.Medicine{}, &models.Prescription{}, &models.GenericMedicine{}, &models.InventoryLog{}, &models.Order{}, &models.OrderItem{})
	assert.NoError(t, err)

	return db
}

func getTestRouter(handler *handlers.CartHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Set("userID", uint(1)) // Simulate authenticated user
		c.Next()
	})

	r.POST("/cart", handler.CreateCart)
	r.POST("/cart/:id/item", handler.AddItem)
	r.PUT("/cart/item/:itemId", handler.UpdateItem)
	r.DELETE("/cart/item/:itemId", handler.RemoveItem)
	r.GET("/cart/:id", handler.GetCart)
	r.POST("/cart/:id/checkout", handler.CheckoutCart)

	return r
}

func TestCreateCart(t *testing.T) {
	db := setupTestDB(t)
	h := handlers.NewCartHandler(db)
	r := getTestRouter(h)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/cart", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestAddItemToCart(t *testing.T) {
	db := setupTestDB(t)
	h := handlers.NewCartHandler(db)
	r := getTestRouter(h)

	userID := uint(1)
	cart := models.Cart{UserID: userID, Status: "active"}
	db.Create(&cart)

	medicine := models.Medicine{BrandName: "Paracetamol", QuantityInPieces: 10, SellingPrice: 5.0}
	db.Create(&medicine)

	body := map[string]interface{}{
		"medicine_id": medicine.ID,
		"quantity":    2,
	}
	jsonValue, _ := json.Marshal(body)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/cart/"+strconv.Itoa(int(cart.ID))+"/item", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestGetCart(t *testing.T) {
	db := setupTestDB(t)
	h := handlers.NewCartHandler(db)
	r := getTestRouter(h)

	userID := uint(1)
	cart := models.Cart{UserID: userID, Status: "active"}
	db.Create(&cart)

	medicine := models.Medicine{BrandName: "Ibuprofen", QuantityInPieces: 50, SellingPrice: 10.0}
	db.Create(&medicine)
	item := models.CartItem{CartID: cart.ID, MedicineID: medicine.ID, Quantity: 2, Status: "pending"}
	db.Create(&item)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/cart/"+strconv.Itoa(int(cart.ID)), nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestCheckoutEmptyCart(t *testing.T) {
	db := setupTestDB(t)
	h := handlers.NewCartHandler(db)
	r := getTestRouter(h)

	cart := models.Cart{UserID: 1, Status: "active"}
	db.Create(&cart)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/cart/"+strconv.Itoa(int(cart.ID))+"/checkout", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestRemoveCartItem(t *testing.T) {
	db := setupTestDB(t)
	h := handlers.NewCartHandler(db)
	r := getTestRouter(h)

	cart := models.Cart{UserID: 1, Status: "active"}
	db.Create(&cart)
	item := models.CartItem{CartID: cart.ID, MedicineID: 1, Quantity: 1, Status: "pending"}
	db.Create(&item)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/cart/item/"+strconv.Itoa(int(item.ID)), nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
