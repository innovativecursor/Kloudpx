package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
//	"github.com/innovativecursor/Kloudpx.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/database"
	"github.com/hashmi846003/online-med.git/internal/routes"
	
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	database.InitDB()
	defer database.DB.Close()

	// Create Gin router
	r := gin.Default()

	// Setup routes
	routes.SetupRoutes(r)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}