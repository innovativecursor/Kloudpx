package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"github.com/innovativecursor/Kloudpx.git/internal/auth"
	"github.com/innovativecursor/Kloudpx.git/internal/database"
	"github.com/innovativecursor/Kloudpx.git/internal/models"

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

	token, err := auth.GenerateJWT(pharmacist.ID, pharmacist.Username, "pharmacist")
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

// GetCartDetails retrieves cart items for review
func GetCartDetails(c *gin.Context) {
	cartID := c.Param("cartID")
	
	// Query cart details and items
	// (Implementation similar to previous example)
}

// ReviewCart processes pharmacist review and substitutions
func ReviewCart(c *gin.Context) {
	cartID := c.Param("cartID")
	
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

	// Process replacements
	for itemID, newMedID := range reviewData.Replacements {
		// Verify new medicine has same generic name
		var originalGeneric, newGeneric string
		err := tx.QueryRow(
			`SELECT m1.generic_name, m2.generic_name
			FROM cart_items ci
			JOIN medicines m1 ON ci.original_medicine_id = m1.id
			JOIN medicines m2 ON m2.id = $1
			WHERE ci.id = $2`,
			newMedID, itemID,
		).Scan(&originalGeneric, &newGeneric)

		if err != nil || originalGeneric != newGeneric {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid replacement medicine"})
			return
		}

		// Update cart item
		_, err = tx.Exec(
			"UPDATE cart_items SET medicine_id = $1, status = 'replaced' WHERE id = $2",
			newMedID, itemID,
		)

		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update cart item"})
			return
		}
	}

	// Update cart status
	_, err = tx.Exec(
		"UPDATE carts SET status = 'reviewed' WHERE id = $1",
		cartID,
	)

	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update cart status"})
		return
	}

	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart reviewed successfully"})
}