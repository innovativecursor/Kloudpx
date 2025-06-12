package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

// ✅ Create a new cart for the user
func CreateCart(c *gin.Context) {
	userID := c.GetInt("user_id") // Must be set by auth middleware

	var cartID int
	err := database.DB.QueryRow(
		"INSERT INTO carts (user_id, status) VALUES ($1, $2) RETURNING id",
		userID, "active",
	).Scan(&cartID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Cart created successfully",
		"cart_id": cartID,
	})
}

// ✅ Add item to cart
func AddToCart(c *gin.Context) {
	var req struct {
		MedicineID int `json:"medicine_id"`
		Quantity   int `json:"quantity"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	cartID := c.Param("cartID")
	_, err := database.DB.Exec("INSERT INTO cart_items (cart_id, medicine_id, quantity) VALUES ($1, $2, $3)",
		cartID, req.MedicineID, req.Quantity)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item added to cart"})
}

// ✅ Upload prescription for a cart item
func UploadPrescription(c *gin.Context) {
	var req struct {
		ImageData []byte `json:"image_data"`
		Hash      string `json:"hash"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	itemID := c.Param("itemID")
	_, err := database.DB.Exec("INSERT INTO prescriptions (cart_item_id, image_data, hash) VALUES ($1, $2, $3)",
		itemID, req.ImageData, req.Hash)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload prescription"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Prescription uploaded successfully"})
}

// ✅ Checkout cart
func CheckoutCart(c *gin.Context) {
	cartID := c.Param("cartID")
	_, err := database.DB.Exec("UPDATE carts SET status='checkout' WHERE id=$1", cartID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to checkout cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart checked out successfully"})
}

// ✅ Get cart details
func GetCart(c *gin.Context) {
	cartID := c.Param("cartID")

	var id int
	var userID int
	var status string

	err := database.DB.QueryRow("SELECT id, user_id, status FROM carts WHERE id=$1", cartID).
		Scan(&id, &userID, &status)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	cart := map[string]interface{}{
		"id":      id,
		"user_id": userID,
		"status":  status,
	}

	c.JSON(http.StatusOK, cart)
}

// ✅ Confirm cart
func ConfirmCart(c *gin.Context) {
	cartID := c.Param("cartID")
	_, err := database.DB.Exec("UPDATE carts SET status='confirmed' WHERE id=$1", cartID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to confirm cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart confirmed successfully"})
}
