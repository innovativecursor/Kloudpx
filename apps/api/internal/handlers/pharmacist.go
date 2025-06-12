package handlers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

func PharmacistApproveHandler(c *gin.Context) {
	var req struct {
		CartID      int  `json:"cart_id"`
		MedicineID  int  `json:"medicine_id"`
		Approved    bool `json:"approved"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if !req.Approved {
		var alternativeMedicine string
		err := database.DB.QueryRow("SELECT brand_name FROM medicines WHERE generic_name = (SELECT generic_name FROM medicines WHERE id=$1) LIMIT 1", req.MedicineID).Scan(&alternativeMedicine)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "No alternative medicine found"})
			return
		} else if err != nil {
			log.Println("Error fetching alternative medicine:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"alternative_medicine": alternativeMedicine})
		return
	}

	_, err := database.DB.Exec("UPDATE prescriptions SET status='approved' WHERE cart_id=$1", req.CartID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve prescription"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Prescription approved"})
}