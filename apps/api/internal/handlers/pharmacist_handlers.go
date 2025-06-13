package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"
	"gorm.io/gorm"
)

// GetPendingCarts returns all carts that are pending review
func GetPendingCarts(c *gin.Context) {
	var carts []models.Cart
	if err := database.DB.Where("status = ?", "pending").Find(&carts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch pending carts"})
		return
	}
	c.JSON(http.StatusOK, carts)
}

// GetCartDetails returns details of a specific cart for pharmacist
func GetCartDetails(c *gin.Context) {
	cartID := c.Param("cartID")
	var cart models.Cart
	if err := database.DB.Preload("Items").First(&cart, cartID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "cart not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch cart"})
		return
	}
	c.JSON(http.StatusOK, cart)
}

// ReviewCart allows pharmacist to review and approve/reject a cart
func ReviewCart(c *gin.Context) {
	cartID := c.Param("cartID")
	var req struct {
		Status  string `json:"status" binding:"required,oneof=approved rejected"`
		Remarks string `json:"remarks"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cart models.Cart
	if err := database.DB.First(&cart, cartID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "cart not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	cart.Status = req.Status
//	cart.Remarks = &req.Remarks
	if err := database.DB.Save(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update cart"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "cart reviewed successfully", "cart": cart})
}
