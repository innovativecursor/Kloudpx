package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/innovativecursor/Kloudpx/internal/models"
)

var DB *gorm.DB

func InitDB() {
	// Static config (you can switch back to os.Getenv if using .env later)
	dbUser := "postgres"
	dbPass := "secret"
	dbHost := "localhost"
	dbPort := "5432" // FIXED: this should be the actual Postgres port, not :8080
	dbName := "yourapp"

	if dbUser == "" || dbPass == "" || dbHost == "" || dbPort == "" || dbName == "" {
		log.Fatal("Database environment variables are not fully set")
	}

	dsn := fmt.Sprintf(
		"user=%s password=%s host=%s port=%s dbname=%s sslmode=disable TimeZone=Asia/Kolkata",
		dbUser, dbPass, dbHost, dbPort, dbName,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("❌ Failed to get generic DB object:", err)
	}

	// Connection pool settings
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	err = autoMigrate()
	if err != nil {
		log.Fatal("❌ Auto migration failed:", err)
	}

	log.Println("✅ Database connected and migrated")
}

func autoMigrate() error {
	return DB.AutoMigrate(
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
		&models.RefreshToken{},
		&models.DirectOrder{},
		&models.InventoryLog{},
	)
}


/*package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/innovativecursor/Kloudpx/internal/models"
)

var DB *gorm.DB

func InitDB() {
	// Hardcoded DB config (replace with os.Getenv for production)
	dbUser := "postgres"
	dbPass := "secret"
	dbHost := "localhost"
	dbPort := "5432" // ✅ removed colon
	dbName := "yourapp"

	if dbUser == "" || dbPass == "" || dbHost == "" || dbPort == "" || dbName == "" {
		log.Fatal("Database environment variables are not fully set")
	}

	dsn := fmt.Sprintf(
		"user=%s password=%s host=%s port=%s dbname=%s sslmode=disable TimeZone=Asia/Kolkata",
		dbUser, dbPass, dbHost, dbPort, dbName,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get generic DB object:", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	err = autoMigrate()
	if err != nil {
		log.Fatal("Auto migration failed:", err)
	}

	log.Println("🚀 Database connected and migrated")
}

func autoMigrate() error {
	return DB.AutoMigrate(
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
		&models.RefreshToken{},
		&models.DirectOrder{},
		&models.InventoryLog{},
	)
}
*/

/*package database

import (
	"fmt"
	"log"
//	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/innovativecursor/Kloudpx/internal/models"
)

var DB *gorm.DB

func InitDB() {
	// Load .env file if exists
	_ = godotenv.Load()

	dbUser := "postgres"
	dbPass := "secret"
	dbHost := "localhost"
	dbPort := ":8080"
	dbName := "yourapp"

	if dbUser == "" || dbPass == "" || dbHost == "" || dbPort == "" || dbName == "" {
		log.Fatal("Database environment variables are not fully set")
	}

	dsn := fmt.Sprintf(
		"user=%s password=%s host=%s port=%s dbname=%s sslmode=disable TimeZone=Asia/Kolkata",
		dbUser, dbPass, dbHost, dbPort, dbName,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get generic DB object:", err)
	}

	// Optional connection pool settings
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	err = autoMigrate()
	if err != nil {
		log.Fatal("Auto migration failed:", err)
	}

	log.Println("🚀 Database connected and migrated")
}

func autoMigrate() error {
	return DB.AutoMigrate(
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
		&models.RefreshToken{},
		&models.DirectOrder{},
		&models.InventoryLog{},
	)
}
*/