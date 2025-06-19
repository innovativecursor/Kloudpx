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

func setupCartTestRouter(t *testing.T) (*gin.Engine, *gorm.DB) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	_ = db.AutoMigrate(&models.Cart{}, &models.CartItem{}, &models.Medicine{})

	r := gin.Default()
	h := handlers.NewCartHandler(db)

	r.Use(func(c *gin.Context) {
		c.Set("userID", uint(1))
		c.Next()
	})

	r.POST("/cart", h.CreateCart)
	r.POST("/cart/:id/item", h.AddItem)
	r.GET("/cart/:id", h.GetCart)
	r.POST("/cart/:id/checkout", h.CheckoutCart)

	db.Create(&models.Medicine{Model: gorm.Model{ID: 1}, BrandName: "Med1", QuantityInPieces: 100, SellingPrice: 5.0})

	return r, db
}

func TestCreateCart(t *testing.T) {
	r, _ := setupCartTestRouter(t)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/cart", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "\"status\":\"active\"")
}

func TestAddItemToCart(t *testing.T) {
	r, db := setupCartTestRouter(t)
	cart := models.Cart{UserID: 1, Status: "active"}
	db.Create(&cart)

	payload := map[string]interface{}{
		"medicine_id": 1,
		"quantity":    2,
	}
	body, _ := json.Marshal(payload)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/cart/"+strconv.Itoa(int(cart.ID))+"/item", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "\"medicine_id\":1")
}

func TestGetCart(t *testing.T) {
	r, db := setupCartTestRouter(t)
	cart := models.Cart{UserID: 1, Status: "active"}
	db.Create(&cart)
	db.Create(&models.CartItem{CartID: cart.ID, MedicineID: 1, Quantity: 3, Status: "pending"})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/cart/"+strconv.Itoa(int(cart.ID)), nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "\"total\":15")
}

func TestCheckoutCart(t *testing.T) {
	r, db := setupCartTestRouter(t)
	cart := models.Cart{UserID: 1, Status: "active"}
	db.Create(&cart)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/cart/"+strconv.Itoa(int(cart.ID))+"/checkout", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Checkout initiated")
}
