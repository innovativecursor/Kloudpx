package handlers

import (
	//"database/sql"
	//"errors"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// CreateCart creates a new cart for the user
func CreateCart(c *gin.Context) {
	userID := c.GetInt("userID")

	var cartID int
	err := database.DB.QueryRow(
		"INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
		userID,
	).Scan(&cartID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"cart_id": cartID})
}

// AddToCart adds an item to the cart
func AddToCart(c *gin.Context) {
	userID := c.GetInt("userID")
	cartID, err := strconv.Atoi(c.Param("cartID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	var req struct {
		MedicineID int `json:"medicine_id"`
		Quantity   int `json:"quantity"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Verify cart belongs to user
	var cartUserID int
	err = database.DB.QueryRow("SELECT user_id FROM carts WHERE id = $1", cartID).Scan(&cartUserID)
	if err != nil || cartUserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Check medicine exists and get details
	var medicine models.Medicine
	err = database.DB.QueryRow(
		`SELECT id, brand_name, generic_id, selling_price, prescription_required 
		FROM medicines WHERE id = $1`,
		req.MedicineID,
	).Scan(&medicine.ID, &medicine.BrandName, &medicine.GenericID, &medicine.SellingPrice, &medicine.PrescriptionRequired)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Medicine not found"})
		return
	}

	// Check stock
	var stock int
	err = database.DB.QueryRow("SELECT quantity_in_pieces FROM medicines WHERE id = $1", req.MedicineID).Scan(&stock)
	if err != nil || stock < req.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Add to cart
	var itemID int
	err = database.DB.QueryRow(
		`INSERT INTO cart_items (cart_id, medicine_id, quantity, original_medicine_id) 
		VALUES ($1, $2, $3, $2) RETURNING id`,
		cartID, req.MedicineID, req.Quantity,
	).Scan(&itemID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"item_id": itemID})
}

// GetCart retrieves cart details
func GetCart(c *gin.Context) {
	userID := c.GetInt("userID")
	cartID, err := strconv.Atoi(c.Param("cartID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	// Verify cart belongs to user
	var cartUserID int
	err = database.DB.QueryRow("SELECT user_id FROM carts WHERE id = $1", cartID).Scan(&cartUserID)
	if err != nil || cartUserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Get cart items with details
	rows, err := database.DB.Query(
		`SELECT 
			ci.id, 
			ci.medicine_id, 
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
			&item.MedicineID,
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

	// Get cart status
	var status string
	err = database.DB.QueryRow("SELECT status FROM carts WHERE id = $1", cartID).Scan(&status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get cart status"})
		return
	}

	c.JSON(http.StatusOK, models.CartResponse{
		CartID: cartID,
		Status: status,
		Items:  items,
		Total:  total,
	})
}

// UploadPrescription handles prescription upload for a cart item
func UploadPrescription(c *gin.Context) {
	userID := c.GetInt("userID")
	cartID, err := strconv.Atoi(c.Param("cartID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	itemID, err := strconv.Atoi(c.Param("itemID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	// Verify cart and item belong to user
	var cartUserID, cartItemID int
	err = database.DB.QueryRow(
		`SELECT c.user_id, ci.id 
		FROM carts c 
		JOIN cart_items ci ON ci.cart_id = c.id 
		WHERE c.id = $1 AND ci.id = $2`,
		cartID, itemID,
	).Scan(&cartUserID, &cartItemID)

	if err != nil || cartUserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	// Get the uploaded file
	file, err := c.FormFile("prescription")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Prescription file required"})
		return
	}

	// Open the file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read prescription"})
		return
	}
	defer src.Close()

	// Read the file content
	imageData, err := io.ReadAll(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read prescription"})
		return
	}

	// Generate hash for the prescription
	hash := auth.GeneratePrescriptionHash(userID, itemID)

	// Save to database
	_, err = database.DB.Exec(
		"INSERT INTO prescriptions (cart_item_id, image_data, hash) VALUES ($1, $2, $3)",
		itemID, imageData, hash,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save prescription"})
		return
	}

	// Update cart item status
	_, err = database.DB.Exec(
		"UPDATE cart_items SET status = 'prescription_uploaded' WHERE id = $1",
		itemID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Prescription uploaded successfully"})
}

// CheckoutCart handles cart checkout
func CheckoutCart(c *gin.Context) {
	userID := c.GetInt("userID")
	cartID, err := strconv.Atoi(c.Param("cartID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	// Verify cart belongs to user and is in pending status
	var cartUserID int
	var cartStatus string
	err = database.DB.QueryRow(
		"SELECT user_id, status FROM carts WHERE id = $1",
		cartID,
	).Scan(&cartUserID, &cartStatus)

	if err != nil || cartUserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if cartStatus != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart already processed"})
		return
	}

	// Check all items have prescriptions if required
	var itemsRequiringPrescription int
	err = database.DB.QueryRow(
		`SELECT COUNT(*) 
		FROM cart_items ci 
		JOIN medicines m ON ci.medicine_id = m.id 
		WHERE ci.cart_id = $1 AND m.prescription_required = true 
		AND NOT EXISTS (SELECT 1 FROM prescriptions p WHERE p.cart_item_id = ci.id)`,
		cartID,
	).Scan(&itemsRequiringPrescription)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify prescriptions"})
		return
	}

	if itemsRequiringPrescription > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Prescription required for some items"})
		return
	}

	// Calculate total price
	var totalPrice float64
	err = database.DB.QueryRow(
		`SELECT SUM(ci.quantity * m.selling_price) 
		FROM cart_items ci 
		JOIN medicines m ON ci.medicine_id = m.id 
		WHERE ci.cart_id = $1`,
		cartID,
	).Scan(&totalPrice)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate total"})
		return
	}

	// Get current VAT rate
	var vatRate float64
	err = database.DB.QueryRow("SELECT vat FROM medicines LIMIT 1").Scan(&vatRate)
	if err != nil {
		vatRate = 0 // Default if not set
	}

	// Apply VAT
	totalWithVAT := totalPrice * (1 + vatRate/100)

	// Update cart status
	_, err = database.DB.Exec(
		"UPDATE carts SET status = 'checkout_completed', updated_at = NOW() WHERE id = $1",
		cartID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart status"})
		return
	}

	// Create order
	var orderID int
	err = database.DB.QueryRow(
		`INSERT INTO orders (user_id, cart_id, total_price, vat) 
		VALUES ($1, $2, $3, $4) RETURNING id`,
		userID, cartID, totalWithVAT, vatRate,
	).Scan(&orderID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"order_id": orderID, "total": totalWithVAT})
}

// ConfirmCart confirms the cart after pharmacist review
func ConfirmCart(c *gin.Context) {
	userID := c.GetInt("userID")
	cartID, err := strconv.Atoi(c.Param("cartID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	// Verify cart belongs to user
	var cartUserID int
	var cartStatus string
	err = database.DB.QueryRow(
		"SELECT user_id, status FROM carts WHERE id = $1",
		cartID,
	).Scan(&cartUserID, &cartStatus)

	if err != nil || cartUserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if cartStatus != "approved" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart not approved by pharmacist"})
		return
	}

	// Update cart status
	_, err = database.DB.Exec(
		"UPDATE carts SET status = 'confirmed', updated_at = NOW() WHERE id = $1",
		cartID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to confirm cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart confirmed successfully"})
}
/*
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
}*/