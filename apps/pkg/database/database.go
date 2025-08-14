package database

import (
	"fmt"
	"time"

	"github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitDB() (*gorm.DB, error) {
	var err error

	// Open database connection
	cfg, err := config.Env()
	if err != nil {
		return nil, fmt.Errorf("Failed to load config: %v", err)
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", cfg.Database.Username, cfg.Database.Password, cfg.Database.Host, cfg.Database.Port, cfg.Database.DatabaseName)
	dbConn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Set database connection settings
	sqlDB, err := dbConn.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get DB instance: %v", err)
	}
	sqlDB.SetMaxIdleConns(10)                 // Maximum number of idle connections in the connection pool
	sqlDB.SetMaxOpenConns(100)                // Maximum number of open connections
	sqlDB.SetConnMaxLifetime(5 * time.Minute) // Maximum lifetime of a connection

	// Create database tables
	err = dbConn.AutoMigrate(&models.Admin{}, &models.Generic{}, &models.Supplier{}, &models.Category{}, &models.CategoryIcon{}, &models.Medicine{}, &models.ItemImage{}, &models.Pharmacist{}, &models.User{}, &models.Prescription{}, &models.CheckoutSession{}, &models.Cart{}, &models.CarouselImage{}, &models.GalleryImage{}, &models.Midwives{}, &models.Hospital{}, &models.Physician{}, &models.KonsultaProvider{}, &models.Dentist{}, &models.Address{}, &models.Payment{}, &models.Order{}, &models.CartHistory{}, &models.RegionSetting{})
	if err != nil {
		return nil, fmt.Errorf("failed to auto migrate User table: %v", err)
	}

	return dbConn, nil
}
