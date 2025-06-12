
package handlers

import (
	"database/sql"
	"net/http"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"

	"github.com/gin-gonic/gin"
)

// GetCart retrieves cart details
func GetCart(c *gin.Context) {
	cartID := c.Param("cartID")
	userID := c.MustGet("userID").(int)

	// Verify cart belongs to user
	var cart models.Cart
	err := database.DB.QueryRow(
		"SELECT id, user_id, status FROM carts WHERE id = $1",
		cartID,
	).Scan(&cart.ID, &cart.UserID, &cart.Status)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if cart.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Get cart items
	rows, err := database.DB.Query(
		`SELECT ci.id, ci.medicine_id, ci.quantity, ci.original_medicine_id, ci.status,
		m.name, m.generic_name, m.prescription_required, m.price
		FROM cart_items ci
		JOIN medicines m ON ci.medicine_id = m.id
		WHERE ci.cart_id = $1`,
		cartID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve cart items"})
		return
	}
	defer rows.Close()

	type CartItemResponse struct {
		ID                   int     `json:"id"`
		MedicineID           int     `json:"medicine_id"`
		MedicineName         string  `json:"medicine_name"`
		GenericName          string  `json:"generic_name"`
		PrescriptionRequired bool    `json:"prescription_required"`
		Quantity             int     `json:"quantity"`
		Price                float64 `json:"price"`
		Status               string  `json:"status"`
	}

	var items []CartItemResponse
	for rows.Next() {
		var item CartItemResponse
		err := rows.Scan(
			&item.ID, &item.MedicineID, &item.Quantity, &item.MedicineID, &item.Status,
			&item.MedicineName, &item.GenericName, &item.PrescriptionRequired, &item.Price,
		)
		if err == nil {
			items = append(items, item)
		}
	}

	response := struct {
		CartID int               `json:"cart_id"`
		Status string            `json:"status"`
		Items  []CartItemResponse `json:"items"`
	}{
		CartID: cart.ID,
		Status: cart.Status,
		Items:  items,
	}

	c.JSON(http.StatusOK, response)
}

// ConfirmCart handles user confirmation after pharmacist review
func ConfirmCart(c *gin.Context) {
	cartID := c.Param("cartID")
	userID := c.MustGet("userID").(int)

	var confirmation struct {
		Accepted bool `json:"accepted"`
	}
	if err := c.ShouldBindJSON(&confirmation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify cart belongs to user and is in 'reviewed' status
	var cart models.Cart
	err := database.DB.QueryRow(
		"SELECT id, user_id, status FROM carts WHERE id = $1",
		cartID,
	).Scan(&cart.ID, &cart.UserID, &cart.Status)

	if err != nil || cart.UserID != userID || cart.Status != "reviewed" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid cart"})
		return
	}

	if confirmation.Accepted {
		// Finalize order
		_, err = database.DB.Exec(
			"UPDATE carts SET status = 'completed' WHERE id = $1",
			cartID,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not complete order"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Order completed"})
	} else {
		// Reset cart
		_, err = database.DB.Exec(
			`UPDATE carts SET status = 'pending' WHERE id = $1;
			UPDATE cart_items SET status = 'pending', medicine_id = original_medicine_id 
			WHERE cart_id = $1 AND status = 'replaced'`,
			cartID,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not reset cart"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Cart reset to pending"})
	}
}