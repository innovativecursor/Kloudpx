package database

import (
	"fmt"
	"log"
	"os"

	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// InitDB initializes a MySQL database connection using GORM
func InitDB() (*gorm.DB, error) {
	// Load .env file (optional)
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Environment variables
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// Create DSN: user:password@tcp(host:port)/dbname?parseTime=true
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&loc=Local",
		user, password, host, port, dbname)

	// Connect to MySQL using GORM
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MySQL: %w", err)
	}

	// Optional: Auto migrate all models
	err = db.AutoMigrate(
		&models.User{},
		&models.Admin{},
		&models.Pharmacist{},
		&models.Supplier{},
		&models.GenericMedicine{},
		&models.Medicine{},
		&models.Cart{},
		&models.CartItem{},
		&models.Prescription{},
		&models.Order{},
		&models.DirectOrder{},
		&models.InventoryLog{},
		&models.RefreshToken{},
	)
	if err != nil {
		return nil, fmt.Errorf("auto-migration failed: %w", err)
	}

	log.Println("Database connection and migration successful")
	return db, nil
}
