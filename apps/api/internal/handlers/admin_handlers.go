package handlers

import (
	"net/http"
	//"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"
)

// --- Generic Medicine Handlers ---

func CreateGenericMedicine(c *gin.Context) {
	var generic models.GenericMedicine
	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&generic)
	c.JSON(http.StatusCreated, generic)
}

func ListGenericMedicines(c *gin.Context) {
	var generics []models.GenericMedicine
	database.DB.Find(&generics)
	c.JSON(http.StatusOK, generics)
}

func GetGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	var generic models.GenericMedicine
	if err := database.DB.First(&generic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Generic not found"})
		return
	}
	c.JSON(http.StatusOK, generic)
}

func UpdateGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	var generic models.GenericMedicine
	if err := database.DB.First(&generic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Generic not found"})
		return
	}
	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&generic)
	c.JSON(http.StatusOK, generic)
}

func DeleteGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.GenericMedicine{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Generic deleted"})
}

// --- Supplier Handlers ---

func CreateSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&supplier)
	c.JSON(http.StatusCreated, supplier)
}

func ListSuppliers(c *gin.Context) {
	var suppliers []models.Supplier
	database.DB.Find(&suppliers)
	c.JSON(http.StatusOK, suppliers)
}

func GetSupplier(c *gin.Context) {
	id := c.Param("id")
	var supplier models.Supplier
	if err := database.DB.First(&supplier, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}
	c.JSON(http.StatusOK, supplier)
}

func UpdateSupplier(c *gin.Context) {
	id := c.Param("id")
	var supplier models.Supplier
	if err := database.DB.First(&supplier, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&supplier)
	c.JSON(http.StatusOK, supplier)
}

func DeleteSupplier(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Supplier{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Supplier deleted"})
}

// --- Tax Handlers ---

func GetTax(c *gin.Context) {
	var tax models.Tax
	database.DB.First(&tax)
	c.JSON(http.StatusOK, tax)
}

func UpdateTax(c *gin.Context) {
	var tax models.Tax
	if err := c.ShouldBindJSON(&tax); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&tax)
	c.JSON(http.StatusOK, tax)
} 

// --- Medicine Handlers (Admin) ---

func AddMedicine(c *gin.Context) {
	var med models.Medicine
	if err := c.ShouldBindJSON(&med); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&med)
	c.JSON(http.StatusCreated, med)
}

func ListMedicines(c *gin.Context) {
	var meds []models.Medicine
	database.DB.Find(&meds)
	c.JSON(http.StatusOK, meds)
}

func UpdateMedicine(c *gin.Context) {
	id := c.Param("id")
	var med models.Medicine
	if err := database.DB.First(&med, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}
	if err := c.ShouldBindJSON(&med); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&med)
	c.JSON(http.StatusOK, med)
}

func DeleteMedicine(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Medicine{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted"})
}

func GetLowStockMedicines(c *gin.Context) {
	var meds []models.Medicine
	database.DB.Where("stock < ?", 10).Find(&meds) // Threshold for low stock
	c.JSON(http.StatusOK, meds)
}

// --- User/Admin/Pharmacist Lists ---

func ListUsers(c *gin.Context) {
	var users []models.User
	database.DB.Find(&users)
	c.JSON(http.StatusOK, users)
}

func ListAdmins(c *gin.Context) {
	var admins []models.Admin
	database.DB.Find(&admins)
	c.JSON(http.StatusOK, admins)
}

func ListPharmacists(c *gin.Context) {
	var pharmacists []models.Pharmacist
	database.DB.Find(&pharmacists)
	c.JSON(http.StatusOK, pharmacists)
}

func GetUserDetails(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// --- Order Statistics ---

func GetOrderStatistics(c *gin.Context) {
	var count int64
	database.DB.Model(&models.Order{}).Count(&count)
	c.JSON(http.StatusOK, gin.H{"total_orders": count})
}
//package handlers
/*
import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"
)
*/
// ------------------- Generic Medicines -------------------

type GenericMedicineHandler struct{}

func (h GenericMedicineHandler) CreateGenericMedicine(c *gin.Context) {
	var generic models.GenericMedicine
	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&generic)
	c.JSON(http.StatusCreated, generic)
}

func (h GenericMedicineHandler) ListGenericMedicines(c *gin.Context) {
	var generics []models.GenericMedicine
	database.DB.Find(&generics)
	c.JSON(http.StatusOK, generics)
}

func (h GenericMedicineHandler) GetGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	var generic models.GenericMedicine
	if err := database.DB.First(&generic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, generic)
}

func (h GenericMedicineHandler) UpdateGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	var generic models.GenericMedicine
	if err := database.DB.First(&generic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	if err := c.ShouldBindJSON(&generic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&generic)
	c.JSON(http.StatusOK, generic)
}

func (h GenericMedicineHandler) DeleteGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.GenericMedicine{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}

// ------------------- Suppliers -------------------

type SupplierHandler struct{}

func (h SupplierHandler) CreateSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&supplier)
	c.JSON(http.StatusCreated, supplier)
}

func (h SupplierHandler) ListSuppliers(c *gin.Context) {
	var suppliers []models.Supplier
	database.DB.Find(&suppliers)
	c.JSON(http.StatusOK, suppliers)
}

func (h SupplierHandler) GetSupplier(c *gin.Context) {
	id := c.Param("id")
	var supplier models.Supplier
	if err := database.DB.First(&supplier, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, supplier)
}

func (h SupplierHandler) UpdateSupplier(c *gin.Context) {
	id := c.Param("id")
	var supplier models.Supplier
	if err := database.DB.First(&supplier, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&supplier)
	c.JSON(http.StatusOK, supplier)
}

func (h SupplierHandler) DeleteSupplier(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.Supplier{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}

// ------------------- Tax -------------------

type TaxHandler struct{}

func (h TaxHandler) GetTax(c *gin.Context) {
	var tax models.Tax
	if err := database.DB.First(&tax).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tax not set"})
		return
	}
	c.JSON(http.StatusOK, tax)
}

func (h TaxHandler) UpdateTax(c *gin.Context) {
	var input models.Tax
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&input)
	c.JSON(http.StatusOK, input)
}
