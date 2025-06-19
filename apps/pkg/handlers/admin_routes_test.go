package handlers_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
)

func setupFullAdminTestRouter(t *testing.T) (*gin.Engine, *gorm.DB) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	_ = db.AutoMigrate(&models.Admin{}, &models.Medicine{}, &models.InventoryLog{}, &models.Supplier{})

	r := gin.Default()
	h := handlers.NewAdminHandler(db)

	r.Use(func(c *gin.Context) {
		c.Set("adminID", uint(1))
		c.Next()
	})

	r.GET("/admin/profile", h.GetProfile)
	r.PUT("/admin/profile", h.UpdateProfile)
	r.GET("/admin/medicines", h.GetMedicines)
	r.GET("/admin/suppliers", h.GetSuppliers)
	r.GET("/admin/inventory", h.GetInventory)

	db.Create(&models.Admin{Model: gorm.Model{ID: 1}, FirstName: "Admin", LastName: "User", Email: "admin@example.com"})

	return r, db
}

func TestAdminGetProfile(t *testing.T) {
	r, _ := setupFullAdminTestRouter(t)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/admin/profile", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "admin@example.com")
}

func TestAdminUpdateProfileConflict(t *testing.T) {
	r, db := setupFullAdminTestRouter(t)
	db.Create(&models.Admin{Model: gorm.Model{ID: 2}, Email: "taken@example.com"})

	payload := `{"email": "taken@example.com"}`
	req, _ := http.NewRequest("PUT", "/admin/profile", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusConflict, w.Code)
	assert.Contains(t, w.Body.String(), "Email already in use")
}

func TestAdminGetMedicines(t *testing.T) {
	r, db := setupFullAdminTestRouter(t)
	db.Create(&models.GenericMedicine{Name: "Paracetamol"})
	db.Create(&models.Medicine{BrandName: "PCM", GenericID: 1, QuantityInPieces: 10, MinimumThreshold: 20})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/admin/medicines?q=PCM&low_stock=true", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "PCM")
}

func TestAdminGetSuppliers(t *testing.T) {
	r, db := setupFullAdminTestRouter(t)
	db.Create(&models.Supplier{SupplierName: "TestSupplier"})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/admin/suppliers?q=Test", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "TestSupplier")
}

func TestAdminGetInventory(t *testing.T) {
	r, db := setupFullAdminTestRouter(t)
	db.Create(&models.Medicine{BrandName: "StockA", QuantityInPieces: 0, MinimumThreshold: 10, MaximumThreshold: 100, SellingPrice: 5})
	db.Create(&models.InventoryLog{MedicineID: 1, ChangeAmount: -10, ChangeType: "deduct", ChangeReason: "test", CreatedAt: time.Now()})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/admin/inventory", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "summary")
	assert.Contains(t, w.Body.String(), "StockA")
}
