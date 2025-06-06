package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"

	"github.com/gin-gonic/gin"
)

// PharmacistRegister handles pharmacist registration
func PharmacistRegister(c *gin.Context) {
	var pharmacist models.Pharmacist
	if err := c.ShouldBindJSON(&pharmacist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := auth.HashPassword(pharmacist.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	err = database.DB.QueryRow(
		"INSERT INTO pharmacists (username, password) VALUES ($1, $2) RETURNING id",
		pharmacist.Username, hashedPassword,
	).Scan(&pharmacist.ID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": pharmacist.ID, "username": pharmacist.Username})
}

// PharmacistLogin handles pharmacist login
func PharmacistLogin(c *gin.Context) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var pharmacist models.Pharmacist
	err := database.DB.QueryRow(
		"SELECT id, username, password FROM pharmacists WHERE username = $1",
		credentials.Username,
	).Scan(&pharmacist.ID, &pharmacist.Username, &pharmacist.Password)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if !auth.CheckPasswordHash(credentials.Password, pharmacist.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := auth.GenerateAccessToken(pharmacist.ID, pharmacist.Username, "pharmacist")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

// GetPendingCarts retrieves carts needing review
func GetPendingCarts(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, user_id FROM carts WHERE status = 'submitted'",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve carts"})
		return
	}
	defer rows.Close()

	var carts []models.Cart
	for rows.Next() {
		var cart models.Cart
		if err := rows.Scan(&cart.ID, &cart.UserID); err == nil {
			carts = append(carts, cart)
		}
	}

	c.JSON(http.StatusOK, carts)
}

// CartItemDetail represents detailed view of a cart item
type CartItemDetail struct {
	ID                    int       `json:"id"`
	OriginalMedicineID    int       `json:"original_medicine_id"`
	OriginalMedicineName  string    `json:"original_medicine_name"`
	OriginalGenericName   string    `json:"original_generic_name"`
	MedicineID            int       `json:"medicine_id"`
	MedicineName          string    `json:"medicine_name"`
	GenericName           string    `json:"generic_name"`
	Quantity              int       `json:"quantity"`
	Status                string    `json:"status"`
	CreatedAt             time.Time `json:"created_at"`
}

// GetCartDetails retrieves cart items for review
func GetCartDetails(c *gin.Context) {
	cartID := c.Param("cartID")
	cartIDInt, err := strconv.Atoi(cartID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	// Get cart basic info
	var cart models.Cart
	err = database.DB.QueryRow(
		"SELECT id, user_id, status, created_at FROM carts WHERE id = $1",
		cartIDInt,
	).Scan(&cart.ID, &cart.UserID, &cart.Status, &cart.CreatedAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Get cart items with medicine details
	rows, err := database.DB.Query(`
		SELECT 
			ci.id,
			ci.original_medicine_id,
			mo.name AS original_medicine_name,
			mo.generic_name AS original_generic_name,
			ci.medicine_id,
			COALESCE(mc.name, mo.name) AS medicine_name,
			COALESCE(mc.generic_name, mo.generic_name) AS generic_name,
			ci.quantity,
			ci.status,
			ci.created_at
		FROM cart_items ci
		JOIN medicines mo ON mo.id = ci.original_medicine_id
		LEFT JOIN medicines mc ON mc.id = ci.medicine_id
		WHERE ci.cart_id = $1
	`, cartIDInt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve cart items"})
		return
	}
	defer rows.Close()

	var items []CartItemDetail
	for rows.Next() {
		var item CartItemDetail
		err := rows.Scan(
			&item.ID,
			&item.OriginalMedicineID,
			&item.OriginalMedicineName,
			&item.OriginalGenericName,
			&item.MedicineID,
			&item.MedicineName,
			&item.GenericName,
			&item.Quantity,
			&item.Status,
			&item.CreatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan cart item"})
			return
		}
		items = append(items, item)
	}

	response := struct {
		Cart   models.Cart      `json:"cart"`
		Items  []CartItemDetail `json:"items"`
	}{
		Cart:  cart,
		Items: items,
	}

	c.JSON(http.StatusOK, response)
}

// ReviewCart processes pharmacist review and substitutions
func ReviewCart(c *gin.Context) {
	cartID := c.Param("cartID")
	cartIDInt, err := strconv.Atoi(cartID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}
	
	var reviewData struct {
		Replacements map[int]int `json:"replacements"` // [itemID]newMedicineID
	}

	if err := c.ShouldBindJSON(&reviewData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Start transaction
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction"})
		return
	}

	// Step 1: Mark all items in the cart as approved
	_, err = tx.Exec(`
		UPDATE cart_items 
		SET status = 'approved'
		WHERE cart_id = $1
	`, cartIDInt)

	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not approve cart items"})
		return
	}

	// Step 2: Process replacements
	for itemID, newMedID := range reviewData.Replacements {
		// Verify new medicine has same generic name as original
		var originalGeneric, newGeneric string
		err := tx.QueryRow(`
			SELECT 
				(SELECT generic_name FROM medicines WHERE id = ci.original_medicine_id),
				(SELECT generic_name FROM medicines WHERE id = $1)
			FROM cart_items ci
			WHERE ci.id = $2
		`, newMedID, itemID).Scan(&originalGeneric, &newGeneric)

		if err != nil {
			tx.Rollback()
			if errors.Is(err, sql.ErrNoRows) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart item or medicine"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not verify replacement"})
			}
			return
		}

		if originalGeneric != newGeneric {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Replacement medicine must have the same generic name",
				"details": gin.H{
					"original_generic": originalGeneric,
					"new_generic":      newGeneric,
				},
			})
			return
		}

		// Update cart item with replacement
		_, err = tx.Exec(`
			UPDATE cart_items 
			SET 
				medicine_id = $1,
				status = 'replaced',
				updated_at = NOW()
			WHERE id = $2
		`, newMedID, itemID)

		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Could not update cart item",
				"item":  itemID,
			})
			return
		}
	}

	// Step 3: Update cart status
	_, err = tx.Exec(`
		UPDATE carts 
		SET 
			status = 'reviewed',
			reviewed_at = NOW()
		WHERE id = $1
	`, cartIDInt)

	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update cart status"})
		return
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart reviewed successfully"})
}