package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/routes"
	"github.com/innovativecursor/Kloudpx/internal/handlers"

)

func main() {
	r := gin.Default()
	database.InitDB()

	// Enable CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	genericHandler := &handlers.GenericMedicineHandler{}
	supplierHandler := &handlers.SupplierHandler{}
	taxHandler := &handlers.TaxHandler{}

	// Pass all required handlers to route registration
	routes.RegisterRoutes(r, genericHandler, supplierHandler, taxHandler)

	// Register all routes
//	routes.RegisterRoutes(r)

	log.Println("Server running on :8080")
	r.Run(":8080")
}