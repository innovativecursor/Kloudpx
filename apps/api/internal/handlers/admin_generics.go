package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

// Struct for generic medicine
type GenericMedicine struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Create a generic medicine
func CreateGenericMedicine(c *gin.Context) {
	var req GenericMedicine
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.DB.Exec("INSERT INTO generic_medicines (name, description) VALUES ($1, $2)", req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add generic medicine"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Generic medicine added successfully"})
}

// List all generic medicines
func ListGenericMedicines(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, description FROM generic_medicines")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch generic medicines"})
		return
	}
	defer rows.Close()

	var generics []GenericMedicine
	for rows.Next() {
		var generic GenericMedicine
		rows.Scan(&generic.ID, &generic.Name, &generic.Description)
		generics = append(generics, generic)
	}

	c.JSON(http.StatusOK, gin.H{"generic_medicines": generics})
}

// Get details of a specific generic medicine
func GetGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	var generic GenericMedicine

	err := database.DB.QueryRow("SELECT id, name, description FROM generic_medicines WHERE id=$1", id).
		Scan(&generic.ID, &generic.Name, &generic.Description)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Generic medicine not found"})
		return
	}

	c.JSON(http.StatusOK, generic)
}

// Update a generic medicine
func UpdateGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	var req GenericMedicine
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.DB.Exec("UPDATE generic_medicines SET name=$1, description=$2 WHERE id=$3", req.Name, req.Description, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update generic medicine"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Generic medicine updated successfully"})
}

// Delete a generic medicine
func DeleteGenericMedicine(c *gin.Context) {
	id := c.Param("id")
	_, err := database.DB.Exec("DELETE FROM generic_medicines WHERE id=$1", id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete generic medicine"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Generic medicine deleted successfully"})
}