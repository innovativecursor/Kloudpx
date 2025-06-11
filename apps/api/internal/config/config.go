package config

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"os"
//	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	ServerAddress  string
	JWTSecret      string
	TokenExpiresIn int
	
	// OAuth Configuration
	OAuthProvider       string
	ClientID           string
	ClientSecret       string
	RedirectURL        string
	AuthURL            string
	TokenURL           string
	UserInfoURL        string
	AllowedAdminDomains []string
	
	// File Upload
	UploadDir        string
	MaxUploadSize    int64
	AllowedFileTypes []string
}

func LoadConfig() *Config {
	return &Config{
		DBHost:         getEnv("DB_HOST", "localhost"),
		DBPort:         getEnv("DB_PORT", "5432"),
		DBUser:         getEnv("DB_USER", "postgres"),
		DBPassword:     getEnv("DB_PASSWORD", "postgres"),
		DBName:         getEnv("DB_NAME", "kloudpx"),
		ServerAddress:  getEnv("SERVER_ADDRESS", ":8080"),
		JWTSecret:      getEnv("JWT_SECRET", generateRandomKey(32)),
		TokenExpiresIn: 24,
		
		OAuthProvider:       getEnv("OAUTH_PROVIDER", "google"),
		ClientID:           getEnv("OAUTH_CLIENT_ID", ""),
		ClientSecret:       getEnv("OAUTH_CLIENT_SECRET", ""),
		RedirectURL:        getEnv("OAUTH_REDIRECT_URL", "http://localhost:8080/auth/callback"),
		AuthURL:            getEnv("OAUTH_AUTH_URL", "https://accounts.google.com/o/oauth2/auth"),
		TokenURL:           getEnv("OAUTH_TOKEN_URL", "https://oauth2.googleapis.com/token"),
		UserInfoURL:        getEnv("OAUTH_USERINFO_URL", "https://www.googleapis.com/oauth2/v3/userinfo"),
		AllowedAdminDomains: []string{getEnv("ADMIN_DOMAIN", "yourpharmacy.com")},
		
		UploadDir:        getEnv("UPLOAD_DIR", "./uploads"),
		MaxUploadSize:    10 << 20, // 10MB
		AllowedFileTypes: []string{"jpg", "jpeg", "pdf"},
	}
}

func InitDB(cfg *Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Connected to database successfully")
	return db, nil
}

func generateRandomKey(length int) string {
	key := make([]byte, length)
	if _, err := rand.Read(key); err != nil {
		panic("failed to generate random key: " + err.Error())
	}
	return base64.URLEncoding.EncodeToString(key)
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}