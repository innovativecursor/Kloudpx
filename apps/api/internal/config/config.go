package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config struct holds environment variables
type Config struct {
	Port        string
	DBHost      string
	DBPort      string
	DBUser      string
	DBPassword  string
	DBName      string
	JWTSecret   string
	OAuthClientID     string
	OAuthClientSecret string
	OAuthRedirectURL  string
}

// LoadConfig loads environment variables from `.env` file
func LoadConfig() *Config {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Warning: No .env file found, using system environment variables")
	}

	return &Config{
		Port:        getEnv("PORT", "8080"),
		DBHost:      getEnv("DB_HOST", "localhost"),
		DBPort:      getEnv("DB_PORT", "5432"),
		DBUser:      getEnv("DB_USER", "postgres"),
		DBPassword:  getEnv("DB_PASSWORD", ""),
		DBName:      getEnv("DB_NAME", "mydb"),
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"),
		OAuthClientID:     getEnv("OAUTH_CLIENT_ID", ""),
		OAuthClientSecret: getEnv("OAUTH_CLIENT_SECRET", ""),
		OAuthRedirectURL:  getEnv("OAUTH_REDIRECT_URL", ""),
	}
}

// getEnv retrieves environment variables or defaults
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}