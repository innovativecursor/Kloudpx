package handlers

import (
	//"database/sql"
	"net/http"
	"time"
	"strconv"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// GetPendingCarts retrieves pending carts for pharmacist review
func GetPendingCarts(c *gin.Context) {
	rows, err := database.DB.Query(
		`SELECT 
			c.id,
			u.username,
			c.created_at,
			COUNT(ci.id) as item_count
		FROM carts c
		JOIN users u ON c.user_id = u.id
		JOIN cart_items ci ON ci.cart_id = c.id
		WHERE c.status = 'checkout_completed'
		GROUP BY c.id, u.username
		ORDER BY c.created_at ASC`,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pending carts"})
		return
	}
	defer rows.Close()

	var carts []struct {
		ID        int       `json:"id"`
		Username  string    `json:"username"`
		CreatedAt time.Time `json:"created_at"`
		ItemCount int       `json:"item_count"`
	}

	for rows.Next() {
		var cart struct {
			ID        int       `json:"id"`
			Username  string    `json:"username"`
			CreatedAt time.Time `json:"created_at"`
			ItemCount int       `json:"item_count"`
		}
		err := rows.Scan(
			&cart.ID,
			&cart.Username,
			&cart.CreatedAt,
			&cart.ItemCount,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read pending carts"})
			return
		}
		carts = append(carts, cart)
	}

	c.JSON(http.StatusOK, gin.H{"carts": carts})
}

// GetCartDetails retrieves details of a specific cart for pharmacist review
func GetCartDetails(c *gin.Context) {
	cartID, err := strconv.Atoi(c.Param("cartID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	// Get cart status
	var status string
	err = database.DB.QueryRow("SELECT status FROM carts WHERE id = $1", cartID).Scan(&status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if status != "checkout_completed" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart not ready for review"})
		return
	}

	// Get cart items with details
	rows, err := database.DB.Query(
		`SELECT 
			ci.id, 
			m.brand_name, 
			gm.name as generic_name,
			m.prescription_required,
			ci.quantity,
			m.selling_price,
			ci.status,
			CASE WHEN p.id IS NULL THEN false ELSE true END as has_prescription
		FROM cart_items ci
		JOIN medicines m ON ci.medicine_id = m.id
		JOIN generic_medicines gm ON m.generic_id = gm.id
		LEFT JOIN prescriptions p ON p.cart_item_id = ci.id
		WHERE ci.cart_id = $1`,
		cartID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get cart items"})
		return
	}
	defer rows.Close()

	var items []models.CartItemDetail
	var total float64

	for rows.Next() {
		var item models.CartItemDetail
		var price float64
		err := rows.Scan(
			&item.ID,
			&item.MedicineName,
			&item.GenericName,
			&item.PrescriptionRequired,
			&item.Quantity,
			&price,
			&item.Status,
			&item.HasPrescription,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read cart items"})
			return
		}
		item.Price = price
		items = append(items, item)
		total += price * float64(item.Quantity)
	}

	// Get VAT rate
	var vatRate float64
	err = database.DB.QueryRow("SELECT vat FROM medicines LIMIT 1").Scan(&vatRate)
	if err != nil {
		vatRate = 0
	}

	c.JSON(http.StatusOK, gin.H{
		"cart_id": cartID,
		"status":  status,
		"items":   items,
		"total":   total * (1 + vatRate/100),
		"vat":     vatRate,
	})
}

// ReviewCart handles pharmacist review of a cart
func ReviewCart(c *gin.Context) {
	cartID, err := strconv.Atoi(c.Param("cartID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	var req struct {
		Approved bool `json:"approved"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Verify cart is in correct status
	var status string
	err = database.DB.QueryRow("SELECT status FROM carts WHERE id = $1", cartID).Scan(&status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if status != "checkout_completed" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart not ready for review"})
		return
	}

	newStatus := "rejected"
	if req.Approved {
		newStatus = "approved"
	}

	// Update cart status
	_, err = database.DB.Exec(
		"UPDATE carts SET status = $1, updated_at = NOW() WHERE id = $2",
		newStatus, cartID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart status"})
		return
	}

	// Update all cart items status
	_, err = database.DB.Exec(
		"UPDATE cart_items SET status = $1 WHERE cart_id = $2",
		newStatus, cartID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart review completed successfully"})
}

/*package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"strings"
	//"time"

	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"
	"github.com/gin-gonic/gin"
)

// PharmacistOAuthLogin handles pharmacist OAuth login
func PharmacistOAuthLogin(c *gin.Context) {
	var credentials struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify token with provider
	userInfo, err := auth.GetUserInfo(credentials.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check if this is a pharmacist email domain
	if !isPharmacistEmail(userInfo.Email) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "OAuth login is restricted to pharmacist accounts",
		})
		return
	}

	// Find or create pharmacist user
	pharmacist, err := findOrCreatePharmacist(userInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Pharmacist processing failed"})
		return
	}

	// Generate JWT with pharmacist role
	token, err := auth.GenerateAccessToken(pharmacist.ID, pharmacist.Name, "pharmacist")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"role":  "pharmacist",
	})
}

func isPharmacistEmail(email string) bool {
	pharmacistDomains := []string{"pharmacy.yourdomain.com", "yourpharmacist.com"}
	
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return false
	}

	domain := parts[1]
	for _, d := range pharmacistDomains {
		if domain == d {
			return true
		}
	}
	return false
}

func findOrCreatePharmacist(info *auth.UserInfo) (*models.Pharmacist, error) {
	var pharmacist models.Pharmacist
	
	err := database.DB.QueryRow(
		"SELECT id, name, email FROM pharmacists WHERE oauth_id = $1",
		info.ID,
	).Scan(&pharmacist.ID, &pharmacist.Name, &pharmacist.Email)

	if err == nil {
		return &pharmacist, nil
	}

	if errors.Is(err, sql.ErrNoRows) {
		err = database.DB.QueryRow(
			`INSERT INTO pharmacists (name, email, oauth_id, oauth_provider) 
			VALUES ($1, $2, $3, 'oauth') 
			RETURNING id, name, email`,
			info.Name, info.Email, info.ID,
		).Scan(&pharmacist.ID, &pharmacist.Name, &pharmacist.Email)

		if err != nil {
			return nil, err
		}
		return &pharmacist, nil
	}

	return nil, err
}

// Pharmacist-specific handlers
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

	var items []models.CartItemDetail
	for rows.Next() {
		var item models.CartItemDetail
		err := rows.Scan(
			&item.ID,
		//	&item.OriginalMedicineID,
		//	&item.OriginalMedicineName,
		//	&item.OriginalGenericName,
			&item.MedicineID,
			&item.MedicineName,
			&item.GenericName,
			&item.Quantity,
			&item.Status,
		//	&item.CreatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan cart item"})
			return
		}
		items = append(items, item)
	}

	response := struct {
		Cart   models.Cart      `json:"cart"`
		Items  []models.CartItemDetail `json:"items"`
	}{
		Cart:  cart,
		Items: items,
	}

	c.JSON(http.StatusOK, response)
}

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
}*/