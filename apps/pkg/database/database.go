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
	err = dbConn.AutoMigrate(&models.Admin{}, &models.Generic{}, &models.Supplier{}, &models.Category{}, &models.CategoryIcon{}, &models.Medicine{}, &models.ItemImage{}, &models.Pharmacist{}, &models.User{}, &models.Prescription{}, &models.CheckoutSession{}, &models.Cart{}, &models.CarouselImage{}, &models.GalleryImage{}, &models.Midwives{}, &models.Hospital{}, &models.Physician{}, &models.KonsultaProvider{}, &models.Dentist{}, &models.Address{}, &models.Payment{}, &models.Order{}, &models.CartHistory{}, &models.OTP{}, &models.LoginSession{}, &models.OrderExplanationVideo{}, &models.PwdCard{}, &models.RegionSetting{}, &models.SeniorCitizenCard{})
	if err != nil {
		return nil, fmt.Errorf("failed to auto migrate User table: %v", err)
	}

	// Seed default region settings
	if err := seedRegionSettings(dbConn); err != nil {
		return nil, fmt.Errorf("failed to seed region settings: %v", err)
	}
	return dbConn, nil
}

func seedRegionSettings(db *gorm.DB) error {
	defaultRegions := []models.RegionSetting{
		{RegionName: "NCR", ZipStart: 1000, ZipEnd: 1749, DeliveryTime: "2-3 days", FreeShippingLimit: 800, StandardRate: 85},
		{RegionName: "Luzon", ZipStart: 2000, ZipEnd: 4999, DeliveryTime: "3-5 days", FreeShippingLimit: 1200, StandardRate: 95},
		{RegionName: "Visayas", ZipStart: 5000, ZipEnd: 6700, DeliveryTime: "3-7 days", FreeShippingLimit: 1600, StandardRate: 100},
		{RegionName: "Mindanao", ZipStart: 7000, ZipEnd: 9800, DeliveryTime: "3-7 days", FreeShippingLimit: 2000, StandardRate: 105},
	}

	for _, region := range defaultRegions {
		var existing models.RegionSetting
		err := db.Where("region_name = ?", region.RegionName).First(&existing).Error
		if err == gorm.ErrRecordNotFound {
			if err := db.Create(&region).Error; err != nil {
				return err
			}
		}
		// If exists → do nothing (preserve edits)
	}

	return nil
}
