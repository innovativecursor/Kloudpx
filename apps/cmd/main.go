package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/auth"
	"github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/database"
	"github.com/innovativecursor/Kloudpx/apps/pkg/middleware"
	"github.com/innovativecursor/Kloudpx/apps/routes"
)

func main() {
	// Load configuration
	cfg, err := config.Env()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize OAuth providers
	auth.InitProviders()

	// Create Gin router
	router := gin.Default()

	// Apply middleware
	router.Use(middleware.CORSMiddleware())

	// Set up routes
	routes.RegisterRoutes(router, db)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "10001"
	}
	log.Printf("Server running on port %s", port)
	router.Run(":" + port)
}

/*ckage main

import (
	"fmt"
	"os"

	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/oauth"
	"github.com/innovativecursor/Kloudpx/apps/pkg/database"
	"github.com/innovativecursor/Kloudpx/apps/routes/admin"
)

func main() {
	dbConn, err := database.InitDB()
	if err != nil {
		fmt.Printf("Failed to initialize database: %v\n", err)

		return
	}

	providers := oauth.InitProviders()
	_ = providers

	var serviceName string

	// Check if the SERVICE_NAME environment variable is set
	if envServiceName := os.Getenv("SERVICE_NAME"); envServiceName != "" {
		serviceName = envServiceName
	} else {
		// Check if a command-line argument is provided
		if len(os.Args) < 2 {
			fmt.Println("Service name not provided")
			return
		}
		serviceName = os.Args[1]
	}

	switch serviceName {
	case "admin":
		admin.Admin(dbConn)
	}
}
*/