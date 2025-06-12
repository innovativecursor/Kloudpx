package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

func UserCartHandler(c *gin.Context) {
	var req struct {
		UserID     int `json:"user_id"`
		MedicineID int `json:"medicine_id"`
		Quantity   int `json:"quantity"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.DB.Exec("INSERT INTO carts (user_id, status) VALUES ($1, 'pending') RETURNING id", req.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medicine added to cart"})
}