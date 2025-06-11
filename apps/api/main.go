package main

import (
	"log"
	"kloudpx-api/internal/config"
	"kloudpx-api/internal/models"
	"kloudpx-api/routes"

	//"gorm.io/gorm"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()
	
	// Initialize database
	db, err := config.InitDB(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Auto-migrate models
	if err := db.AutoMigrate(
		&models.User{},
		&models.Admin{},
		&models.Chemist{},
		&models.Customer{},
		&models.Medicine{},
		&models.MedicineAlternative{},
		&models.Prescription{},
		&models.Order{},
		&models.OrderItem{},
	); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Setup routes
	router := routes.SetupRouter(db, cfg)
	
	// Start server
	log.Printf("Starting server on %s", cfg.ServerAddress)
	if err := router.Run(cfg.ServerAddress); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}