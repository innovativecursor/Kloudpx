package handlers

import (
	"bytes"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	//"os"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/models"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
)

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
			"error":          "Prescriptions missing for some items",
			"missing_items":  missingItems,
			"message":        "Please upload prescriptions for all required medicines",
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
func GetUserOrders(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	rows, err := database.DB.Query(
		`SELECT o.id, o.total_price, o.created_at
		FROM orders o
		WHERE o.user_id = $1
		ORDER BY o.created_at DESC`,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve orders"})
		return
	}
	defer rows.Close()

	type Order struct {
		ID         int       `json:"id"`
		TotalPrice float64   `json:"total_price"`
		CreatedAt  time.Time `json:"created_at"`
	}

	var orders []Order
	for rows.Next() {
		var order Order
		if err := rows.Scan(&order.ID, &order.TotalPrice, &order.CreatedAt); err == nil {
			orders = append(orders, order)
		}
	}

	c.JSON(http.StatusOK, orders)
}

// GetOrderDetails retrieves details of a specific order
func GetOrderDetails(c *gin.Context) {
	orderID := c.Param("orderID")
	userID := c.MustGet("userID").(int)

	// Verify order belongs to user
	var orderUserID int
	err := database.DB.QueryRow(
		"SELECT user_id FROM orders WHERE id = $1",
		orderID,
	).Scan(&orderUserID)

	if err != nil || orderUserID != userID {
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve order details"})
		return
	}
	defer rows.Close()

	type OrderItem struct {
		Name        string  `json:"name"`
		GenericName string  `json:"generic_name"`
		Quantity    int     `json:"quantity"`
		Price       float64 `json:"price"`
		ItemTotal   float64 `json:"item_total"`
	}

	var items []OrderItem
	var total float64

	for rows.Next() {
		var item OrderItem
		if err := rows.Scan(
			&item.Name,
			&item.GenericName,
			&item.Quantity,
			&item.Price,
		); err == nil {
			item.ItemTotal = float64(item.Quantity) * item.Price
			total += item.ItemTotal
			items = append(items, item)
		}
	}

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

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve order"})
		return
	}

	response := struct {
		OrderID int         `json:"order_id"`
		Date    time.Time   `json:"date"`
		Items   []OrderItem `json:"items"`
		Total   float64     `json:"total"`
	}{
		OrderID: order.ID,
		Date:    order.CreatedAt,
		Items:   items,
		Total:   total,
	}

	c.JSON(http.StatusOK, response)
}

// SearchMedicines allows users to search for medicines
/*func SearchMedicines(c *gin.Context) {
	query := strings.ToLower(c.Query("q"))
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query required"})
		return
	}

	rows, err := database.DB.Query(
		`SELECT id, name, generic_name, prescription_required, stock, price 
		FROM medicines 
		WHERE LOWER(name) LIKE '%' || $1 || '%' 
		OR LOWER(generic_name) LIKE '%' || $1 || '%'`,
		query,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not search medicines"})
		return
	}
	defer rows.Close()

	var medicines []models.Medicine
	for rows.Next() {
		var med models.Medicine
		if err := rows.Scan(
			&med.ID,
			&med.BrandName,
			&med.GenericName,
			&med.PrescriptionRequired,
			&med.QuantityInPieces,
			&med.SellingPrice,
		); err == nil {
			medicines = append(medicines, med)
		}
	}

	c.JSON(http.StatusOK, medicines)
}
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
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.Medicine
	err = database.DB.QueryRow(
		`SELECT id, name, generic_name, prescription_required, stock, price 
		FROM medicines 
		WHERE id = $1`,
		id,
	).Scan(
		&medicine.ID,
		&medicine.BrandName,
		&medicine.GenericName,
		&medicine.PrescriptionRequired,
		&medicine.QuantityInPieces,
		&medicine.SellingPrice,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

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
        "medicine":    medicine,
        "alternatives": altMedicines,
    })
}
// UpdateProfile updates user information
func UpdateProfile(c *gin.Context) {
	userID := c.MustGet("userID").(int)

	var updateData struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction"})
		return
	}

	// Update username if provided
	if updateData.Username != "" {
		_, err = tx.Exec(
			"UPDATE users SET username = $1 WHERE id = $2",
			updateData.Username, userID,
		)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
			return
		}
	}

	// Update email if provided
	if updateData.Email != "" {
		_, err = tx.Exec(
			"UPDATE users SET email = $1 WHERE id = $2",
			updateData.Email, userID,
		)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
			return
		}
	}

	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}