package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

// GET /admin/users
func ListUsers(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, email FROM users WHERE role = 'user'")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer rows.Close()

	var users []map[string]interface{}
	for rows.Next() {
		var id int
		var name, email string
		if err := rows.Scan(&id, &name, &email); err == nil {
			users = append(users, gin.H{
				"id":    id,
				"name":  name,
				"email": email,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

// GET /admin/admins
func ListAdmins(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, email FROM users WHERE role = 'admin'")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch admins"})
		return
	}
	defer rows.Close()

	var admins []map[string]interface{}
	for rows.Next() {
		var id int
		var name, email string
		if err := rows.Scan(&id, &name, &email); err == nil {
			admins = append(admins, gin.H{
				"id":    id,
				"name":  name,
				"email": email,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"admins": admins})
}

// GET /admin/pharmacists
func ListPharmacists(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, email FROM users WHERE role = 'pharmacist'")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pharmacists"})
		return
	}
	defer rows.Close()

	var pharmacists []map[string]interface{}
	for rows.Next() {
		var id int
		var name, email string
		if err := rows.Scan(&id, &name, &email); err == nil {
			pharmacists = append(pharmacists, gin.H{
				"id":    id,
				"name":  name,
				"email": email,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"pharmacists": pharmacists})
}

// GET /admin/users/:id
func GetUserDetails(c *gin.Context) {
	userID := c.Param("id")

	var id int
	var name, email, role string
	err := database.DB.QueryRow("SELECT id, name, email, role FROM users WHERE id = $1", userID).
		Scan(&id, &name, &email, &role)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":    id,
		"name":  name,
		"email": email,
		"role":  role,
	})
}

// GET /admin/statistics/orders
func GetOrderStatistics(c *gin.Context) {
	var totalOrders int
	var totalRevenue float64

	err := database.DB.QueryRow(`
		SELECT COUNT(*), COALESCE(SUM(total_amount), 0)
		FROM orders
		WHERE status = 'confirmed'
	`).Scan(&totalOrders, &totalRevenue)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order statistics"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total_orders":  totalOrders,
		"total_revenue": totalRevenue,
	})
}
