package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

// Struct for Order
type Order struct {
	ID         int     `json:"id"`
	UserID     int     `json:"user_id,omitempty"`
	TotalPrice float64 `json:"total_price"`
	Status     string  `json:"status"`
}

// Get user orders
func GetUserOrders(c *gin.Context) {
	userID := c.GetInt("userID")

	rows, err := database.DB.Query("SELECT id, total_price, status FROM orders WHERE user_id=$1", userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var order Order
		if err := rows.Scan(&order.ID, &order.TotalPrice, &order.Status); err != nil {
			continue // Optionally log
		}
		orders = append(orders, order)
	}

	c.JSON(http.StatusOK, gin.H{"orders": orders})
}

// Get order details
func GetOrderDetails(c *gin.Context) {
	orderID := c.Param("orderID")
	var order Order

	err := database.DB.QueryRow(
		"SELECT id, user_id, total_price, status FROM orders WHERE id=$1", orderID,
	).Scan(&order.ID, &order.UserID, &order.TotalPrice, &order.Status)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, order)
}

// Generate invoice for an order
func GenerateInvoice(c *gin.Context) {
	orderID := c.Param("orderID")
	var invoice Order

	err := database.DB.QueryRow(
		"SELECT id, user_id, total_price, status FROM orders WHERE id=$1", orderID,
	).Scan(&invoice.ID, &invoice.UserID, &invoice.TotalPrice, &invoice.Status)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoice": invoice})
}
