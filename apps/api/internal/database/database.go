package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "secret"),
		getEnv("DB_NAME", "your_database_name"),
		getEnv("SSL_MODE", "disable"),
	)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(0)

	if err = DB.Ping(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	log.Println("Database connection established successfully!")
	createTables()
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func createTables() {
	tables := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			password TEXT NOT NULL,
			email VARCHAR(255),
			role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'supplier', 'user', 'pharmacist')),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS medicines (
			id SERIAL PRIMARY KEY,
			brand_name VARCHAR(100) NOT NULL,
			generic_name VARCHAR(100) NOT NULL,
			description TEXT,
			category VARCHAR(100),
			prescription_required BOOLEAN NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS carts (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL REFERENCES users(id),
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS prescriptions (
			id SERIAL PRIMARY KEY,
			cart_id INT NOT NULL REFERENCES carts(id),
			pharmacist_id INT NOT NULL REFERENCES users(id),
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, table := range tables {
		_, err := DB.Exec(table)
		if err != nil {
			log.Printf("Error creating table: %v\nQuery: %s", err, table)
		}
	}
	log.Println("Database tables verified/created successfully!")
}