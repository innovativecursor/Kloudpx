package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/database"
)

// Update user profile
func UpdateProfile(c *gin.Context) {
	userID := c.GetInt("userID")
	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.DB.Exec("UPDATE users SET username=$1, email=$2 WHERE id=$3", req.Username, req.Email, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}