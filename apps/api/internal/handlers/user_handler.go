package handlers

import (
<<<<<<< HEAD
	"time"
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"github.com/hashmi846003/online-med.git/internal/database"
=======
	"bytes"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"

	//"os"
	"strconv"
	"strings"
	"time"

	"github.com/innovativecursor/Kloudpx/internal/auth"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"

>>>>>>> 420a7f163fd1339c30f8a0be7d5f4639739aeb3a
	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/models"
)

<<<<<<< HEAD
// GetUserOrders retrieves user's order history
=======
// UserProfile handles user profile retrieval
func UserProfile(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	var user models.User
	err := database.DB.QueryRow(
		`SELECT id, username, email, created_at, last_login 
		FROM users 
		WHERE id = $1`,
		userID,
	).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.CreatedAt,
		&user.LastLogin,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// CreateCart creates a new cart for the user
func CreateCart(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	var cart models.Cart
	err := database.DB.QueryRow(
		"INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
		userID,
	).Scan(&cart.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create cart"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"cart_id": cart.ID})
}

// AddToCart adds an item to the user's cart
func AddToCart(c *gin.Context) {
	cartID := c.Param("cartID")
	userID := c.MustGet("userID").(int)

	// Verify cart belongs to user
	var cartUserID int
	err := database.DB.QueryRow(
		"SELECT user_id FROM carts WHERE id = $1",
		cartID,
	).Scan(&cartUserID)

	if err != nil || cartUserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cart not found or access denied"})
		return
	}

	var item struct {
		MedicineID int `json:"medicine_id"`
		Quantity   int `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check medicine exists
	var medicine models.Medicine
	err = database.DB.QueryRow(
		"SELECT id, prescription_required FROM medicines WHERE id = $1",
		item.MedicineID,
	).Scan(&medicine.ID, &medicine.PrescriptionRequired)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Add to cart
	var cartItemID int
	err = database.DB.QueryRow(
		`INSERT INTO cart_items (cart_id, medicine_id, quantity, original_medicine_id) 
		VALUES ($1, $2, $3, $2) RETURNING id`,
		cartID, item.MedicineID, item.Quantity,
	).Scan(&cartItemID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not add to cart"})
		return
	}

	response := gin.H{"item_id": cartItemID}
	if medicine.PrescriptionRequired {
		response["prescription_required"] = true
		response["message"] = "Prescription required for this medicine"
	}

	c.JSON(http.StatusCreated, response)
}

// UploadPrescription handles prescription upload
func UploadPrescription(c *gin.Context) {
	cartID := c.Param("cartID")
	itemID := c.Param("itemID")
	userID := c.MustGet("userID").(int)

	// Verify cart and item belong to user
	var cartUserID, cartItemID int
	err := database.DB.QueryRow(
		`SELECT c.user_id, ci.id 
		FROM carts c
		JOIN cart_items ci ON c.id = ci.cart_id
		WHERE c.id = $1 AND ci.id = $2`,
		cartID, itemID,
	).Scan(&cartUserID, &cartItemID)

	if err != nil || cartUserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Item not found or access denied"})
		return
	}

	// Check if prescription is required
	var requiresPrescription bool
	err = database.DB.QueryRow(
		`SELECT m.prescription_required 
		FROM cart_items ci
		JOIN medicines m ON ci.medicine_id = m.id
		WHERE ci.id = $1`,
		itemID,
	).Scan(&requiresPrescription)

	if err != nil || !requiresPrescription {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Prescription not required for this item"})
		return
	}

	// Get image data
	var data struct {
		Image string `json:"image"` // Base64 encoded
	}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Decode base64 image
	imageBytes, err := base64.StdEncoding.DecodeString(data.Image)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image data"})
		return
	}

	// Generate unique hash for prescription
	hash := auth.GeneratePrescriptionHash(userID, cartItemID)

	// Save prescription
	_, err = database.DB.Exec(
		"INSERT INTO prescriptions (cart_item_id, image_data, hash) VALUES ($1, $2, $3)",
		cartItemID, imageBytes, hash,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save prescription"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Prescription uploaded successfully"})
}

// CheckoutCart submits cart for pharmacist review
func CheckoutCart(c *gin.Context) {
	cartID := c.Param("cartID")
	userID := c.MustGet("userID").(int)

	// Verify cart belongs to user
	var cartUserID int
	err := database.DB.QueryRow(
		"SELECT user_id FROM carts WHERE id = $1",
		cartID,
	).Scan(&cartUserID)

	if err != nil || cartUserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cart not found or access denied"})
		return
	}

	// Check all prescription items have prescriptions
	rows, err := database.DB.Query(
		`SELECT ci.id 
		FROM cart_items ci
		JOIN medicines m ON ci.medicine_id = m.id
		LEFT JOIN prescriptions p ON ci.id = p.cart_item_id
		WHERE ci.cart_id = $1 
		AND m.prescription_required = true
		AND p.id IS NULL`,
		cartID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not verify prescriptions"})
		return
	}
	defer rows.Close()

	var missingItems []int
	for rows.Next() {
		var itemID int
		if err := rows.Scan(&itemID); err == nil {
			missingItems = append(missingItems, itemID)
		}
	}

	if len(missingItems) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":         "Prescriptions missing for some items",
			"missing_items": missingItems,
			"message":       "Please upload prescriptions for all required medicines",
		})
		return
	}

	// Update cart status
	_, err = database.DB.Exec(
		"UPDATE carts SET status = 'submitted' WHERE id = $1",
		cartID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not checkout cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart submitted for pharmacist review"})
}

// GetCart retrieves the user's cart
/*func GetCart(c *gin.Context) {
	cartID := c.Param("cartID")
	userID := c.MustGet("userID").(int)

	// Verify cart belongs to user
	var cart models.Cart
	err := database.DB.QueryRow(
		"SELECT id, user_id, status FROM carts WHERE id = $1",
		cartID,
	).Scan(&cart.ID, &cart.UserID, &cart.Status)

	if err != nil || cart.UserID != userID {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
			return
		}
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Get cart items
	rows, err := database.DB.Query(
		`SELECT
			ci.id,
			ci.medicine_id,
			m.name,
			m.generic_name,
			m.prescription_required,
			ci.quantity,
			m.price,
			ci.status,
			CASE WHEN p.id IS NOT NULL THEN true ELSE false END as has_prescription
		FROM cart_items ci
		JOIN medicines m ON ci.medicine_id = m.id
		LEFT JOIN prescriptions p ON ci.id = p.cart_item_id
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
		HasPrescription      bool    `json:"has_prescription"`
	}

	var items []CartItemResponse
	for rows.Next() {
		var item CartItemResponse
		err := rows.Scan(
			&item.ID,
			&item.MedicineID,
			&item.MedicineName,
			&item.GenericName,
			&item.PrescriptionRequired,
			&item.Quantity,
			&item.Price,
			&item.Status,
			&item.HasPrescription,
		)
		if err != nil {
			continue
		}
		items = append(items, item)
	}

	// Calculate total
	var total float64
	for _, item := range items {
		total += float64(item.Quantity) * item.Price
	}

	response := struct {
		CartID int              `json:"cart_id"`
		Status string           `json:"status"`
		Items  []CartItemResponse `json:"items"`
		Total  float64          `json:"total"`
	}{
		CartID: cart.ID,
		Status: cart.Status,
		Items:  items,
		Total:  total,
	}

	c.JSON(http.StatusOK, response)
}

// ConfirmCart handles user confirmation of reviewed cart
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

	// Verify cart belongs to user and is in reviewed status
	var cart models.Cart
	err := database.DB.QueryRow(
		"SELECT id, user_id, status FROM carts WHERE id = $1",
		cartID,
	).Scan(&cart.ID, &cart.UserID, &cart.Status)

	if err != nil || cart.UserID != userID || cart.Status != "reviewed" {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
			return
		}
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid cart status or access denied"})
		return
	}

	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction"})
		return
	}

	if confirmation.Accepted {
		// Finalize order - update cart status to completed
		_, err = tx.Exec(
			"UPDATE carts SET status = 'completed' WHERE id = $1",
			cartID,
		)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not complete order"})
			return
		}

		// Update inventory
		rows, err := tx.Query(
			`SELECT medicine_id, quantity
			FROM cart_items
			WHERE cart_id = $1`,
			cartID,
		)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get cart items"})
			return
		}
		defer rows.Close()

		for rows.Next() {
			var medicineID, quantity int
			if err := rows.Scan(&medicineID, &quantity); err != nil {
				continue
			}

			_, err = tx.Exec(
				`UPDATE medicines
				SET stock = stock - $1
				WHERE id = $2 AND stock >= $1`,
				quantity, medicineID,
			)
			if err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update inventory"})
				return
			}
		}

		// Create order record
		var total float64
		err = tx.QueryRow(
			`SELECT SUM(ci.quantity * m.price)
			FROM cart_items ci
			JOIN medicines m ON ci.medicine_id = m.id
			WHERE ci.cart_id = $1`,
			cartID,
		).Scan(&total)

		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not calculate total"})
			return
		}

		_, err = tx.Exec(
			`INSERT INTO orders (user_id, cart_id, total_price)
			VALUES ($1, $2, $3)`,
			userID, cartID, total,
		)

		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create order"})
			return
		}

		err = tx.Commit()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Order completed successfully"})
	} else {
		// Reset cart to pending and revert changes
		_, err = tx.Exec(
			`UPDATE carts SET status = 'pending' WHERE id = $1;
			UPDATE cart_items
			SET medicine_id = original_medicine_id, status = 'pending'
			WHERE cart_id = $1 AND status = 'replaced'`,
			cartID,
		)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not reset cart"})
			return
		}

		err = tx.Commit()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Cart reset to pending"})
	}
}
//*/
// GenerateInvoice generates a PDF invoice for a completed order
func GenerateInvoice(c *gin.Context) {
	orderID := c.Param("orderID")
	userID := c.MustGet("userID").(int)

	// Verify order belongs to user
	var order struct {
		ID        int
		UserID    int
		Total     float64
		CreatedAt time.Time
		Username  string
		Email     sql.NullString
	}

	err := database.DB.QueryRow(
		`SELECT o.id, o.user_id, o.total_price, o.created_at,
		 u.username, u.email
		FROM orders o
		JOIN users u ON o.user_id = u.id
		WHERE o.id = $1`,
		orderID,
	).Scan(
		&order.ID,
		&order.UserID,
		&order.Total,
		&order.CreatedAt,
		&order.Username,
		&order.Email,
	)

	if err != nil || order.UserID != userID {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Get order items
	rows, err := database.DB.Query(
		`SELECT 
			m.name, 
			m.generic_name, 
			ci.quantity, 
			m.price
		FROM cart_items ci
		JOIN medicines m ON ci.medicine_id = m.id
		JOIN carts c ON ci.cart_id = c.id
		JOIN orders o ON c.id = o.cart_id
		WHERE o.id = $1`,
		orderID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve order items"})
		return
	}
	defer rows.Close()

	type OrderItem struct {
		Name        string
		GenericName string
		Quantity    int
		Price       float64
	}

	var items []OrderItem
	for rows.Next() {
		var item OrderItem
		if err := rows.Scan(
			&item.Name,
			&item.GenericName,
			&item.Quantity,
			&item.Price,
		); err == nil {
			items = append(items, item)
		}
	}

	// Generate PDF invoice
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// Pharmacy Information
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(0, 10, "Pharmacy App")
	pdf.Ln(12)

	pdf.SetFont("Arial", "", 12)
	pdf.Cell(0, 10, "123 Health Street, MedCity")
	pdf.Ln(5)
	pdf.Cell(0, 10, "Phone: (123) 456-7890 | Email: contact@pharmacyapp.com")
	pdf.Ln(15)

	// Invoice Title
	pdf.SetFont("Arial", "B", 20)
	pdf.Cell(0, 10, "INVOICE")
	pdf.Ln(15)

	// Order Information
	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 10, "Invoice Number:")
	pdf.Cell(0, 10, fmt.Sprintf("INV-%d", order.ID))
	pdf.Ln(8)

	pdf.Cell(40, 10, "Invoice Date:")
	pdf.Cell(0, 10, order.CreatedAt.Format("January 2, 2006"))
	pdf.Ln(15)

	// Customer Information
	pdf.SetFont("Arial", "B", 14)
	pdf.Cell(0, 10, "Bill To:")
	pdf.Ln(8)

	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 10, "Customer:")
	pdf.Cell(0, 10, order.Username)
	pdf.Ln(8)

	if order.Email.Valid {
		pdf.Cell(40, 10, "Email:")
		pdf.Cell(0, 10, order.Email.String)
		pdf.Ln(8)
	}

	pdf.Ln(10)

	// Items Table
	pdf.SetFont("Arial", "B", 12)
	pdf.CellFormat(100, 10, "Item", "1", 0, "", false, 0, "")
	pdf.CellFormat(30, 10, "Generic Name", "1", 0, "", false, 0, "")
	pdf.CellFormat(20, 10, "Qty", "1", 0, "C", false, 0, "")
	pdf.CellFormat(20, 10, "Price", "1", 0, "R", false, 0, "")
	pdf.CellFormat(20, 10, "Total", "1", 1, "R", false, 0, "")

	pdf.SetFont("Arial", "", 12)
	for _, item := range items {
		itemTotal := float64(item.Quantity) * item.Price
		pdf.CellFormat(100, 10, item.Name, "1", 0, "", false, 0, "")
		pdf.CellFormat(30, 10, item.GenericName, "1", 0, "", false, 0, "")
		pdf.CellFormat(20, 10, strconv.Itoa(item.Quantity), "1", 0, "C", false, 0, "")
		pdf.CellFormat(20, 10, fmt.Sprintf("$%.2f", item.Price), "1", 0, "R", false, 0, "")
		pdf.CellFormat(20, 10, fmt.Sprintf("$%.2f", itemTotal), "1", 1, "R", false, 0, "")
	}

	// Total
	pdf.SetFont("Arial", "B", 12)
	pdf.CellFormat(170, 10, "Grand Total:", "1", 0, "R", false, 0, "")
	pdf.CellFormat(20, 10, fmt.Sprintf("$%.2f", order.Total), "1", 1, "R", false, 0, "")

	// Footer
	pdf.Ln(15)
	pdf.SetFont("Arial", "I", 10)
	pdf.Cell(0, 10, "Thank you for your purchase! Your health is our priority.")
	pdf.Ln(5)
	pdf.Cell(0, 10, "This is a computer-generated invoice and does not require a signature.")

	// Generate PDF bytes
	var buf bytes.Buffer
	err = pdf.Output(&buf)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate PDF"})
		return
	}

	// Return PDF as download
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=invoice-%d.pdf", order.ID))
	c.Data(http.StatusOK, "application/pdf", buf.Bytes())
}

// GetUserOrders retrieves order history for the user
>>>>>>> 420a7f163fd1339c30f8a0be7d5f4639739aeb3a
func GetUserOrders(c *gin.Context) {
	userID := c.GetInt("userID")

	rows, err := database.DB.Query(
		`SELECT 
			o.id, 
			o.total_price, 
			o.status, 
			o.created_at,
			COUNT(ci.id) as item_count
		FROM orders o
		JOIN carts c ON o.cart_id = c.id
		JOIN cart_items ci ON ci.cart_id = c.id
		WHERE o.user_id = $1
		GROUP BY o.id
		ORDER BY o.created_at DESC`,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get orders"})
		return
	}
	defer rows.Close()

	var orders []struct {
		ID        int       `json:"id"`
		Total     float64   `json:"total"`
		Status    string    `json:"status"`
		CreatedAt time.Time `json:"created_at"`
		ItemCount int       `json:"item_count"`
	}

	for rows.Next() {
		var order struct {
			ID        int       `json:"id"`
			Total     float64   `json:"total"`
			Status    string    `json:"status"`
			CreatedAt time.Time `json:"created_at"`
			ItemCount int       `json:"item_count"`
		}
		err := rows.Scan(
			&order.ID,
			&order.Total,
			&order.Status,
			&order.CreatedAt,
			&order.ItemCount,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read orders"})
			return
		}
		orders = append(orders, order)
	}

	c.JSON(http.StatusOK, gin.H{"orders": orders})
}

// GetOrderDetails retrieves details of a specific order
func GetOrderDetails(c *gin.Context) {
	userID := c.GetInt("userID")
	orderID, err := strconv.Atoi(c.Param("orderID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	// Verify order belongs to user
	var orderUserID int
	err = database.DB.QueryRow(
		"SELECT user_id FROM orders WHERE id = $1",
		orderID,
	).Scan(&orderUserID)

	if err != nil || orderUserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Get order items
	rows, err := database.DB.Query(
		`SELECT 
			m.brand_name,
			gm.name as generic_name,
			ci.quantity,
			m.selling_price,
			ci.status
		FROM orders o
		JOIN carts c ON o.cart_id = c.id
		JOIN cart_items ci ON ci.cart_id = c.id
		JOIN medicines m ON ci.medicine_id = m.id
		JOIN generic_medicines gm ON m.generic_id = gm.id
		WHERE o.id = $1`,
		orderID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get order items"})
		return
	}
	defer rows.Close()

	var items []models.OrderItem
	var total float64

	for rows.Next() {
		var item models.OrderItem
		var price float64
		err := rows.Scan(
			&item.Name,
			&item.GenericName,
			&item.Quantity,
			&price,
			&item.Status,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read order items"})
			return
		}
		item.Price = price
		item.ItemTotal = price * float64(item.Quantity)
		items = append(items, item)
		total += item.ItemTotal
	}

<<<<<<< HEAD
	// Get VAT rate
	var vatRate float64
	err = database.DB.QueryRow("SELECT vat FROM orders WHERE id = $1", orderID).Scan(&vatRate)
=======
	// Get order details
	var order struct {
		ID        int       `json:"id"`
		CreatedAt time.Time `json:"created_at"`
	}

	err = database.DB.QueryRow(
		`SELECT id, created_at 
		FROM orders 
		WHERE id = $1`,
		orderID,
	).Scan(&order.ID, &order.CreatedAt)

>>>>>>> 420a7f163fd1339c30f8a0be7d5f4639739aeb3a
	if err != nil {
		vatRate = 0
	}

	c.JSON(http.StatusOK, models.OrderDetails{
		OrderID: orderID,
		Items:   items,
		Total:   total * (1 + vatRate/100),
	})
}

// GenerateInvoice generates an invoice for an order
func GenerateInvoice(c *gin.Context) {
	userID := c.GetInt("userID")
	orderID, err := strconv.Atoi(c.Param("orderID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	// Verify order belongs to user
	var orderUserID int
	err = database.DB.QueryRow(
		"SELECT user_id FROM orders WHERE id = $1",
		orderID,
	).Scan(&orderUserID)

	if err != nil || orderUserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// In a real implementation, you would generate a PDF invoice here
	// For this example, we'll return a JSON response with invoice details

	// Get order details
	var order struct {
		Total     float64   `json:"total"`
		VAT       float64   `json:"vat"`
		CreatedAt time.Time `json:"created_at"`
	}

	err = database.DB.QueryRow(
		"SELECT total_price, vat, created_at FROM orders WHERE id = $1",
		orderID,
	).Scan(&order.Total, &order.VAT, &order.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get order details"})
		return
	}

	// Get order items
	rows, err := database.DB.Query(
		`SELECT 
			m.brand_name,
			ci.quantity,
			m.selling_price
		FROM orders o
		JOIN carts c ON o.cart_id = c.id
		JOIN cart_items ci ON ci.cart_id = c.id
		JOIN medicines m ON ci.medicine_id = m.id
		WHERE o.id = $1`,
		orderID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get order items"})
		return
	}
	defer rows.Close()

	var items []struct {
		Name     string  `json:"name"`
		Quantity int     `json:"quantity"`
		Price    float64 `json:"price"`
	}

	for rows.Next() {
		var item struct {
			Name     string  `json:"name"`
			Quantity int     `json:"quantity"`
			Price    float64 `json:"price"`
		}
		err := rows.Scan(
			&item.Name,
			&item.Quantity,
			&item.Price,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read order items"})
			return
		}
		items = append(items, item)
	}

	// Generate invoice response
	invoice := gin.H{
		"order_id":    orderID,
		"date":        order.CreatedAt.Format("2006-01-02"),
		"items":       items,
		"subtotal":    order.Total / (1 + order.VAT/100),
		"vat_rate":    order.VAT,
		"vat_amount":  order.Total - (order.Total / (1 + order.VAT/100)),
		"total":       order.Total,
		"customer_id": userID,
	}

	c.JSON(http.StatusOK, invoice)
}

// SearchMedicines searches for medicines
func SearchMedicines(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query required"})
		return
	}

	rows, err := database.DB.Query(
<<<<<<< HEAD
		`SELECT 
			m.id,
			m.brand_name,
			gm.name as generic_name,
			m.selling_price,
			m.quantity_in_pieces,
			m.prescription_required
		FROM medicines m
		JOIN generic_medicines gm ON m.generic_id = gm.id
		WHERE m.brand_name ILIKE $1 OR gm.name ILIKE $1
		LIMIT 50`,
		"%"+query+"%",
=======
		`SELECT id, name, generic_name, prescription_required, stock, price
		FROM medicines
		WHERE LOWER(name) LIKE '%' || $1 || '%'
		OR LOWER(generic_name) LIKE '%' || $1 || '%'`,
		query,
>>>>>>> 420a7f163fd1339c30f8a0be7d5f4639739aeb3a
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search medicines"})
		return
	}
	defer rows.Close()

	var medicines []struct {
		ID                   int     `json:"id"`
		BrandName            string  `json:"brand_name"`
		GenericName          string  `json:"generic_name"`
		Price                float64 `json:"price"`
		Stock                int     `json:"stock"`
		PrescriptionRequired bool    `json:"prescription_required"`
	}

	for rows.Next() {
		var medicine struct {
			ID                   int     `json:"id"`
			BrandName            string  `json:"brand_name"`
			GenericName          string  `json:"generic_name"`
			Price                float64 `json:"price"`
			Stock                int     `json:"stock"`
			PrescriptionRequired bool    `json:"prescription_required"`
		}
		err := rows.Scan(
			&medicine.ID,
			&medicine.BrandName,
			&medicine.GenericName,
			&medicine.Price,
			&medicine.Stock,
			&medicine.PrescriptionRequired,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read medicines"})
			return
		}
		medicines = append(medicines, medicine)
	}

	c.JSON(http.StatusOK, gin.H{"medicines": medicines})
}
<<<<<<< HEAD

// GetMedicineDetails retrieves details of a specific medicine
func GetMedicineDetails(c *gin.Context) {
	medicineID, err := strconv.Atoi(c.Param("id"))
=======
*/func SearchMedicines(c *gin.Context) {
	query := strings.ToLower(c.Query("q"))
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query required"})
		return
	}

	rows, err := database.DB.Query(
		`SELECT m.id, m.name, m.generic_id, g.name as generic_name, 
         m.prescription_required, m.stock, m.price 
        FROM medicines m
        LEFT JOIN generic_medicines g ON m.generic_id = g.id
        WHERE LOWER(m.name) LIKE '%' || $1 || '%' 
        OR LOWER(g.name) LIKE '%' || $1 || '%'`,
		query,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not search medicines"})
		return
	}
	defer rows.Close()

	type MedicineResponse struct {
		ID                   int     `json:"id"`
		Name                 string  `json:"name"`
		GenericID            int     `json:"generic_id"`
		GenericName          string  `json:"generic_name"`
		PrescriptionRequired bool    `json:"prescription_required"`
		Stock                int     `json:"stock"`
		Price                float64 `json:"price"`
	}

	var medicines []MedicineResponse
	for rows.Next() {
		var med MedicineResponse
		if err := rows.Scan(
			&med.ID,
			&med.Name,
			&med.GenericID,
			&med.GenericName,
			&med.PrescriptionRequired,
			&med.Stock,
			&med.Price,
		); err == nil {
			medicines = append(medicines, med)
		}
	}

	c.JSON(http.StatusOK, medicines)
}

// GetMedicineDetails retrieves details for a specific medicine
/*func GetMedicineDetails(c *gin.Context) {
	medicineID := c.Param("id")
	id, err := strconv.Atoi(medicineID)
>>>>>>> 420a7f163fd1339c30f8a0be7d5f4639739aeb3a
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.MedicineWithGeneric
	err = database.DB.QueryRow(
<<<<<<< HEAD
		`SELECT 
			m.id,
			m.brand_name,
			m.generic_id,
			gm.name as generic_name,
			m.description,
			m.category,
			m.quantity_in_pieces,
			m.supplier,
			m.selling_price,
			m.vat,
			m.prescription_required,
			gm.description as generic_description
		FROM medicines m
		JOIN generic_medicines gm ON m.generic_id = gm.id
		WHERE m.id = $1`,
		medicineID,
=======
		`SELECT id, name, generic_name, prescription_required, stock, price
		FROM medicines
		WHERE id = $1`,
		id,
>>>>>>> 420a7f163fd1339c30f8a0be7d5f4639739aeb3a
	).Scan(
		&medicine.ID,
		&medicine.BrandName,
		&medicine.GenericID,
		&medicine.Generic.Name,
		&medicine.Description,
		&medicine.Category,
		&medicine.QuantityInPieces,
		&medicine.Supplier,
		&medicine.SellingPrice,
		&medicine.Tax.VAT,
		&medicine.PrescriptionRequired,
		&medicine.Generic.Description,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get medicine details"})
		}
		return
	}

<<<<<<< HEAD
	c.JSON(http.StatusOK, medicine)
}

// UpdateProfile updates user profile
=======
	// Get alternatives with same generic name
	alternatives, err := database.DB.Query(
		`SELECT id, name, stock, price
		FROM medicines
		WHERE generic_name = $1 AND id != $2`,
		medicine.GenericName, medicine.ID,
	)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"medicine": medicine})
		return
	}
	defer alternatives.Close()

	type Alternative struct {
		ID    int     `json:"id"`
		Name  string  `json:"name"`
		Stock int     `json:"stock"`
		Price float64 `json:"price"`
	}

	var altMedicines []Alternative
	for alternatives.Next() {
		var alt Alternative
		if err := alternatives.Scan(&alt.ID, &alt.Name, &alt.Stock, &alt.Price); err == nil {
			altMedicines = append(altMedicines, alt)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"medicine":    medicine,
		"alternatives": altMedicines,
	})
}
*/
func GetMedicineDetails(c *gin.Context) {
	medicineID := c.Param("id")
	id, err := strconv.Atoi(medicineID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	type MedicineResponse struct {
		ID                   int     `json:"id"`
		Name                 string  `json:"name"`
		GenericID            int     `json:"generic_id"`
		GenericName          string  `json:"generic_name"`
		PrescriptionRequired bool    `json:"prescription_required"`
		Stock                int     `json:"stock"`
		Price                float64 `json:"price"`
	}

	var medicine MedicineResponse
	err = database.DB.QueryRow(
		`SELECT m.id, m.name, m.generic_id, g.name as generic_name, 
         m.prescription_required, m.stock, m.price 
        FROM medicines m
        LEFT JOIN generic_medicines g ON m.generic_id = g.id
        WHERE m.id = $1`,
		id,
	).Scan(
		&medicine.ID,
		&medicine.Name,
		&medicine.GenericID,
		&medicine.GenericName,
		&medicine.PrescriptionRequired,
		&medicine.Stock,
		&medicine.Price,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Get alternatives with same generic ID
	alternatives, err := database.DB.Query(
		`SELECT m.id, m.name, m.stock, m.price 
        FROM medicines m
        WHERE m.generic_id = $1 AND m.id != $2`,
		medicine.GenericID, medicine.ID,
	)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"medicine": medicine})
		return
	}
	defer alternatives.Close()

	type Alternative struct {
		ID    int     `json:"id"`
		Name  string  `json:"name"`
		Stock int     `json:"stock"`
		Price float64 `json:"price"`
	}

	var altMedicines []Alternative
	for alternatives.Next() {
		var alt Alternative
		if err := alternatives.Scan(&alt.ID, &alt.Name, &alt.Stock, &alt.Price); err == nil {
			altMedicines = append(altMedicines, alt)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"medicine":     medicine,
		"alternatives": altMedicines,
	})
}

// UpdateProfile updates user information
>>>>>>> 420a7f163fd1339c30f8a0be7d5f4639739aeb3a
func UpdateProfile(c *gin.Context) {
	userID := c.GetInt("userID")

	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Update user profile
	_, err := database.DB.Exec(
		"UPDATE users SET username = $1, email = $2 WHERE id = $3",
		req.Username, req.Email, userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}
<<<<<<< HEAD

// ListUsers lists all users
func ListUsers(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, username, email, created_at, last_login FROM users ORDER BY username",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(
			&u.ID, &u.Username, &u.Email, &u.CreatedAt, &u.LastLogin,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read users"})
			return
		}
		users = append(users, u)
	}

	c.JSON(http.StatusOK, users)
}

// ListAdmins lists all admins
func ListAdmins(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, name, email, created_at, last_login FROM admins ORDER BY name",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch admins"})
		return
	}
	defer rows.Close()

	var admins []models.Admin
	for rows.Next() {
		var a models.Admin
		if err := rows.Scan(
			&a.ID, &a.Name, &a.Email, &a.CreatedAt, &a.LastLogin,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read admins"})
			return
		}
		admins = append(admins, a)
	}

	c.JSON(http.StatusOK, admins)
}

// ListPharmacists lists all pharmacists
func ListPharmacists(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, name, email, created_at, last_login FROM pharmacists ORDER BY name",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pharmacists"})
		return
	}
	defer rows.Close()

	var pharmacists []models.Pharmacist
	for rows.Next() {
		var p models.Pharmacist
		if err := rows.Scan(
			&p.ID, &p.Name, &p.Email, &p.CreatedAt, &p.LastLogin,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read pharmacists"})
			return
		}
		pharmacists = append(pharmacists, p)
	}

	c.JSON(http.StatusOK, pharmacists)
}

// GetUserDetails gets details of a specific user
func GetUserDetails(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// Try to find in users table
	var user models.User
	err = database.DB.QueryRow(
		"SELECT id, username, email, created_at, last_login FROM users WHERE id = $1",
		id,
	).Scan(&user.ID, &user.Username, &user.Email, &user.CreatedAt, &user.LastLogin)

	if err == nil {
		c.JSON(http.StatusOK, gin.H{"user": user, "role": "user"})
		return
	}

	// Try to find in admins table
	var admin models.Admin
	err = database.DB.QueryRow(
		"SELECT id, name, email, created_at, last_login FROM admins WHERE id = $1",
		id,
	).Scan(&admin.ID, &admin.Name, &admin.Email, &admin.CreatedAt, &admin.LastLogin)

	if err == nil {
		c.JSON(http.StatusOK, gin.H{"user": admin, "role": "admin"})
		return
	}

	// Try to find in pharmacists table
	var pharmacist models.Pharmacist
	err = database.DB.QueryRow(
		"SELECT id, name, email, created_at, last_login FROM pharmacists WHERE id = $1",
		id,
	).Scan(&pharmacist.ID, &pharmacist.Name, &pharmacist.Email, &pharmacist.CreatedAt, &pharmacist.LastLogin)

	if err == nil {
		c.JSON(http.StatusOK, gin.H{"user": pharmacist, "role": "pharmacist"})
		return
	}

	if errors.Is(err, sql.ErrNoRows) {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user details"})
	}
}

// GetOrderStatistics gets order statistics
func GetOrderStatistics(c *gin.Context) {
	var stats struct {
		TotalOrders   int     `json:"total_orders"`
		TotalRevenue  float64 `json:"total_revenue"`
		PendingOrders int     `json:"pending_orders"`
		CompletedRate float64 `json:"completed_rate"`
	}

	err := database.DB.QueryRow(
		`SELECT 
			COUNT(*) as total_orders,
			COALESCE(SUM(total_price), 0) as total_revenue,
			SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders
		FROM orders`,
	).Scan(&stats.TotalOrders, &stats.TotalRevenue, &stats.PendingOrders)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order statistics"})
		return
	}

	if stats.TotalOrders > 0 {
		stats.CompletedRate = float64(stats.TotalOrders-stats.PendingOrders) / float64(stats.TotalOrders) * 100
	}

	c.JSON(http.StatusOK, stats)
}

// GetLowStockMedicines lists medicines with low stock
func GetLowStockMedicines(c *gin.Context) {
	rows, err := database.DB.Query(
		`SELECT m.id, m.brand_name, gm.name as generic_name, 
		m.quantity_in_pieces, m.minimum_threshold
		FROM medicines m
		JOIN generic_medicines gm ON m.generic_id = gm.id
		WHERE m.quantity_in_pieces < m.minimum_threshold
		ORDER BY m.quantity_in_pieces ASC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch low stock medicines"})
		return
	}
	defer rows.Close()

	var medicines []struct {
		ID               int     `json:"id"`
		BrandName        string  `json:"brand_name"`
		GenericName      string  `json:"generic_name"`
		Quantity         int     `json:"quantity"`
		MinimumThreshold int     `json:"minimum_threshold"`
		Percentage       float64 `json:"percentage"`
	}

	for rows.Next() {
		var m struct {
			ID               int     `json:"id"`
			BrandName        string  `json:"brand_name"`
			GenericName      string  `json:"generic_name"`
			Quantity         int     `json:"quantity"`
			MinimumThreshold int     `json:"minimum_threshold"`
			Percentage       float64 `json:"percentage"`
		}
		if err := rows.Scan(
			&m.ID, &m.BrandName, &m.GenericName,
			&m.Quantity, &m.MinimumThreshold,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read low stock medicines"})
			return
		}
		m.Percentage = float64(m.Quantity) / float64(m.MinimumThreshold) * 100
		medicines = append(medicines, m)
	}

	c.JSON(http.StatusOK, medicines)
}
=======
>>>>>>> 420a7f163fd1339c30f8a0be7d5f4639739aeb3a
