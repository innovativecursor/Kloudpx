package admin

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/database"
	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"github.com/innovativecursor/Kloudpx/apps/pkg/middleware"
	"github.com/innovativecursor/Kloudpx/apps/pkg/oauth"
	"github.com/innovativecursor/Kloudpx/apps/routes"
	"gorm.io/gorm"
)

func StartAdminServer() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10001"
		log.Printf("Defaulting to port %s", port)
	}

	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// Create route groups
	api := router.Group("/v1")
	public := api.Group("")
	protected := api.Group("")
	protected.Use(middleware.JWTAuth())

	// Auth routes
	public.GET("/auth/:provider", oauth.AuthHandler)
	public.GET("/auth/:provider/callback", func(c *gin.Context) {
		oauth.AuthCallbackHandler(c, db)
	})

	// Initialize handlers
	adminHandler := handlers.NewAdminHandler(db)
	medicineHandler := handlers.NewMedicineHandler(db) // Implement similarly

	// Admin routes
	protected.GET("/admins", adminHandler.GetAdmins)
	protected.POST("/admins", adminHandler.CreateAdmin)

	// Medicine routes
	protected.POST("/medicines", medicineHandler.CreateMedicine)
	protected.GET("/medicines", medicineHandler.GetMedicines)

	// Start server
	log.Printf("Admin service running on port %s", port)
	router.Run(":" + port)
}
/*package admin

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/oauth"
	"github.com/innovativecursor/Kloudpx/apps/pkg/database"
	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"github.com/innovativecursor/Kloudpx/apps/routes/getapiroutes"
	"gorm.io/gorm"
)

func Admin() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10001"
	}

	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	apiV1, router := getapiroutes.GetApiRoutes()

	// Health check
	apiV1.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Auth routes
	apiV1.GET("/auth/:provider", oauth.AuthHandler)
	apiV1.GET("/auth/:provider/callback", func(c *gin.Context) {
		oauth.AuthCallbackHandler(c, db)
	})

	// Admin CRUD
	adminGroup := apiV1.Group("/admins")
	{
		adminGroup.GET("", func(c *gin.Context) {
			handlers.GetAdmins(c, db)
		})
		adminGroup.POST("", func(c *gin.Context) {
			handlers.CreateAdmin(c, db)
		})
	}

	// Medicine CRUD
	medicineGroup := apiV1.Group("/medicines")
	{
		medicineGroup.POST("", func(c *gin.Context) {
			handlers.CreateMedicine(c, db)
		})
		medicineGroup.GET("", func(c *gin.Context) {
			handlers.GetMedicines(c, db)
		})
	}

	log.Printf("Server running on port %s", port)
	router.Run(":" + port)
}*/
/*package admin

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/oauth"
	"github.com/innovativecursor/Kloudpx/apps/routes/getapiroutes"
	"gorm.io/gorm"
)

func Admin(db *gorm.DB) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10001"
		log.Printf("Defaulting to port %s", port)
	}

	apiV1, router := getapiroutes.GetApiRoutes()

	// Define handlers
	apiV1.GET("/admin", func(c *gin.Context) {
		c.String(http.StatusOK, "admin Service Healthy")
	})

	apiV1.GET("/auth/:provider", func(c *gin.Context) {
		oauth.AuthHandler(c)
	})

	//handle Handle Facebook callback
	apiV1.GET("/auth/:provider/callback", func(c *gin.Context) {
		oauth.AuthCallbackHandler(c, db)
	})

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
*/