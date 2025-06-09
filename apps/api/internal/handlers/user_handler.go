package handlers

import (
	"time"
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/models"
)

// GetUserOrders retrieves user's order history
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

	// Get VAT rate
	var vatRate float64
	err = database.DB.QueryRow("SELECT vat FROM orders WHERE id = $1", orderID).Scan(&vatRate)
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

// GetMedicineDetails retrieves details of a specific medicine
func GetMedicineDetails(c *gin.Context) {
	medicineID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medicine ID"})
		return
	}

	var medicine models.MedicineWithGeneric
	err = database.DB.QueryRow(
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

	c.JSON(http.StatusOK, medicine)
}

// UpdateProfile updates user profile
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