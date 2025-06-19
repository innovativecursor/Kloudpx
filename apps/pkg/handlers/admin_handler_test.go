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

func setupAdminTestRouter(t *testing.T) (*gin.Engine, *gorm.DB) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	_ = db.AutoMigrate(&models.Admin{}, &models.Medicine{}, &models.Supplier{}, &models.Order{})

	r := gin.Default()
	h := handlers.NewAdminHandler(db)

	r.Use(func(c *gin.Context) {
		c.Set("adminID", uint(1))
		c.Next()
	})

	r.GET("/admin/profile", h.GetProfile)
	r.PUT("/admin/profile", h.UpdateProfile)
	r.GET("/admin/dashboard", h.GetDashboard)

	// Seed test admin
	db.Create(&models.Admin{Model: gorm.Model{ID: 1}, FirstName: "Test", LastName: "Admin", Email: "test@example.com"})

	return r, db
}

func TestGetProfile(t *testing.T) {
	r, _ := setupAdminTestRouter(t)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/admin/profile", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "test@example.com")
}

func TestUpdateProfile(t *testing.T) {
	r, _ := setupAdminTestRouter(t)
	payload := map[string]string{
		"first_name": "Updated",
		"last_name":  "Admin",
		"email":      "updated@example.com",
	}
	body, _ := json.Marshal(payload)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/admin/profile", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "updated")
}

func TestGetDashboard(t *testing.T) {
	r, db := setupAdminTestRouter(t)

	// Seed data
	db.Create(&models.Medicine{BrandName: "Paracetamol", QuantityInPieces: 20})
	db.Create(&models.Supplier{SupplierName: "MedSupply"})
	db.Create(&models.Order{})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/admin/dashboard", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "total_medicines")
	assert.Contains(t, w.Body.String(), "low_stock_items")
}
