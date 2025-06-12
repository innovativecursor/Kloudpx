package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

// Define a struct for cart details
type Cart struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Status string `json:"status"`
}

// Get pending carts for pharmacist review
func GetPendingCarts(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, user_id, status FROM carts WHERE status='pending'")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pending carts"})
		return
	}
	defer rows.Close()

	var carts []Cart
	for rows.Next() {
		var cart Cart
		rows.Scan(&cart.ID, &cart.UserID, &cart.Status)
		carts = append(carts, cart)
	}

	c.JSON(http.StatusOK, gin.H{"pending_carts": carts})
}

// Get cart details for pharmacist review
func GetCartDetails(c *gin.Context) {
	cartID := c.Param("cartID")
	var cart Cart

	err := database.DB.QueryRow("SELECT id, user_id, status FROM carts WHERE id=$1", cartID).
		Scan(&cart.ID, &cart.UserID, &cart.Status)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart details"})
		}
		return
	}

	c.JSON(http.StatusOK, cart)
}

// Review cart and approve or suggest alternative medicines
func ReviewCart(c *gin.Context) {
	cartID := c.Param("cartID")
	var req struct {
		Approved bool `json:"approved"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if req.Approved {
		_, err := database.DB.Exec("UPDATE carts SET status='approved' WHERE id=$1", cartID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve cart"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Cart approved"})
	} else {
		var alternativeMedicine string
		err := database.DB.QueryRow("SELECT brand_name FROM medicines WHERE generic_name = (SELECT generic_name FROM medicines WHERE id IN (SELECT medicine_id FROM cart_items WHERE cart_id=$1)) LIMIT 1", cartID).
			Scan(&alternativeMedicine)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "No alternative medicine found"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch alternative medicine"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"alternative_medicine": alternativeMedicine})
	}
}