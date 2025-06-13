package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"
)

func CreateCart(c *gin.Context) {
	userID := c.GetUint("userID")
	cart := models.Cart{UserID: userID, Status: "pending"}
	if err := database.DB.Create(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create cart"})
		return
	}
	c.JSON(http.StatusCreated, cart)
}

func AddToCart(c *gin.Context) {
	cartID, _ := strconv.Atoi(c.Param("cartID"))
	var item models.CartItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	item.CartID = uint(cartID)
	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add item to cart"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func UploadPrescription(c *gin.Context) {
	// Simulate file upload logic
	c.JSON(http.StatusOK, gin.H{"message": "Prescription uploaded successfully"})
}

func CheckoutCart(c *gin.Context) {
	cartID := c.Param("cartID")
	if err := database.DB.Model(&models.Cart{}).Where("id = ?", cartID).Update("status", "checked_out").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to checkout"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cart checked out successfully"})
}

func GetCart(c *gin.Context) {
	cartID := c.Param("cartID")
	var cart models.Cart
	if err := database.DB.Preload("Items").Where("id = ?", cartID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "cart not found"})
		return
	}
	c.JSON(http.StatusOK, cart)
}

func ConfirmCart(c *gin.Context) {
	cartID := c.Param("cartID")
	if err := database.DB.Model(&models.Cart{}).Where("id = ?", cartID).Update("status", "confirmed").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to confirm cart"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cart confirmed"})
}

func GetUserOrders(c *gin.Context) {
	userID := c.GetUint("userID")
	var orders []models.Order
	if err := database.DB.Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch orders"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func GetOrderDetails(c *gin.Context) {
	orderID := c.Param("orderID")
	var order models.Order
	if err := database.DB.Preload("Items").Where("id = ?", orderID).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
		return
	}
	c.JSON(http.StatusOK, order)
}

func GenerateInvoice(c *gin.Context) {
	// Dummy invoice generation logic
	c.JSON(http.StatusOK, gin.H{"invoice": "Invoice content here"})
}

func SearchMedicines(c *gin.Context) {
	query := c.Query("q")
	var medicines []models.Medicine
	db := database.DB
	if query != "" {
		db = db.Where("name ILIKE ?", "%"+query+"%")
	}
	if err := db.Find(&medicines).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search medicines"})
		return
	}
	c.JSON(http.StatusOK, medicines)
}

func GetMedicineDetails(c *gin.Context) {
	id := c.Param("id")
	var med models.Medicine
	if err := database.DB.Where("id = ?", id).First(&med).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "medicine not found"})
		return
	}
	c.JSON(http.StatusOK, med)
}

func UpdateProfile(c *gin.Context) {
	userID := c.GetUint("userID")
	var updateData models.User
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Model(&models.User{}).Where("id = ?", userID).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}
