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
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
	)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	createTables()
	log.Println("Database connection established")
}

func createTables() {
	tables := []string{
		// Users table
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			password TEXT,
			email VARCHAR(255),
			oauth_id VARCHAR(255),
			oauth_provider VARCHAR(50),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			last_login TIMESTAMP
		)`,

		// Admins table
		`CREATE TABLE IF NOT EXISTS admins (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			oauth_id VARCHAR(255),
			oauth_provider VARCHAR(50),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			last_login TIMESTAMP
		)`,

		// Suppliers table
		`CREATE TABLE IF NOT EXISTS suppliers (
			id SERIAL PRIMARY KEY,
			admin_id INT NOT NULL REFERENCES admins(id),
			supplier_name VARCHAR(100) NOT NULL,
			cost DECIMAL(10,2),
			discount_provided DECIMAL(10,2),
			quantity_in_piece INT,
			quantity_in_box INT,
			cost_price DECIMAL(10,2),
			taxes DECIMAL(10,2),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Generic medicines table
		`CREATE TABLE IF NOT EXISTS generic_medicines (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Medicines table
		`CREATE TABLE IF NOT EXISTS medicines (
			id SERIAL PRIMARY KEY,
			brand_name VARCHAR(100) NOT NULL,
			generic_id INT NOT NULL REFERENCES generic_medicines(id),
			description TEXT,
			category VARCHAR(100),
			quantity_in_pieces INT,
			supplier VARCHAR(100),
			purchase_price DECIMAL(10,2),
			selling_price DECIMAL(10,2),
			tax_type VARCHAR(50),
			vat DECIMAL(10,2),
			minimum_threshold INT,
			maximum_threshold INT,
			estimated_lead_time INT,
			prescription_required BOOLEAN NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Pharmacists table
		`CREATE TABLE IF NOT EXISTS pharmacists (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			oauth_id VARCHAR(255),
			oauth_provider VARCHAR(50),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			last_login TIMESTAMP
		)`,

		// Carts table
		`CREATE TABLE IF NOT EXISTS carts (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL REFERENCES users(id),
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Cart items table
		`CREATE TABLE IF NOT EXISTS cart_items (
			id SERIAL PRIMARY KEY,
			cart_id INT NOT NULL REFERENCES carts(id),
			medicine_id INT NOT NULL REFERENCES medicines(id),
			quantity INT NOT NULL,
			original_medicine_id INT REFERENCES medicines(id),
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Prescriptions table
		`CREATE TABLE IF NOT EXISTS prescriptions (
			id SERIAL PRIMARY KEY,
			cart_item_id INT NOT NULL REFERENCES cart_items(id),
			image_data BYTEA NOT NULL,
			hash TEXT NOT NULL UNIQUE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Orders table
		`CREATE TABLE IF NOT EXISTS orders (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL REFERENCES users(id),
			cart_id INT NOT NULL REFERENCES carts(id),
			total_price DECIMAL(10,2) NOT NULL,
			status VARCHAR(20) NOT NULL DEFAULT 'completed',
			vat DECIMAL(10,2),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Refresh tokens table
		`CREATE TABLE IF NOT EXISTS refresh_tokens (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL,
			token TEXT NOT NULL UNIQUE,
			expires_at TIMESTAMP NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		)`,
	}

	for _, table := range tables {
		_, err := DB.Exec(table)
		if err != nil {
			log.Printf("Error creating table: %v\nQuery: %s", err, table)
		}
	}
	log.Println("Database tables verified/created")
}
/*package database

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
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("SSL_MODE"),
	)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	createTables()
	log.Println("Database connection established")
}

func createTables() {
	tables := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			password TEXT,
			email VARCHAR(255),
			oauth_id VARCHAR(255),
			oauth_provider VARCHAR(50),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			last_login TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS admins (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			oauth_id VARCHAR(255),
			oauth_provider VARCHAR(50),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			last_login TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS suppliers (
			id SERIAL PRIMARY KEY,
			admin_id INT NOT NULL REFERENCES admins(id),
			supplier_name VARCHAR(100) NOT NULL,
			cost DECIMAL(10,2),
			discount_provided DECIMAL(10,2),
			quantity_in_piece INT,
			quantity_in_box INT,
			cost_price DECIMAL(10,2),
			taxes DECIMAL(10,2),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS generic_medicines (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS medicines (
			id SERIAL PRIMARY KEY,
			brand_name VARCHAR(100) NOT NULL,
			generic_id INT NOT NULL REFERENCES generic_medicines(id),
			description TEXT,
			category VARCHAR(100),
			quantity_in_pieces INT,
			supplier VARCHAR(100),
			purchase_price DECIMAL(10,2),
			selling_price DECIMAL(10,2),
			tax_type VARCHAR(50),
			vat DECIMAL(10,2),
			minimum_threshold INT,
			maximum_threshold INT,
			estimated_lead_time INT,
			prescription_required BOOLEAN NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS pharmacists (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			oauth_id VARCHAR(255),
			oauth_provider VARCHAR(50),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			last_login TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS carts (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL REFERENCES users(id),
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS cart_items (
			id SERIAL PRIMARY KEY,
			cart_id INT NOT NULL REFERENCES carts(id),
			medicine_id INT NOT NULL REFERENCES medicines(id),
			quantity INT NOT NULL,
			original_medicine_id INT REFERENCES medicines(id),
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS prescriptions (
			id SERIAL PRIMARY KEY,
			cart_item_id INT NOT NULL REFERENCES cart_items(id),
			image_data BYTEA NOT NULL,
			hash TEXT NOT NULL UNIQUE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS orders (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL REFERENCES users(id),
			cart_id INT NOT NULL REFERENCES carts(id),
			total_price DECIMAL(10,2) NOT NULL,
			status VARCHAR(20) NOT NULL DEFAULT 'completed',
			vat DECIMAL(10,2),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS refresh_tokens (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL,
			token TEXT NOT NULL UNIQUE,
			expires_at TIMESTAMP NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		)`,
	}

	for _, table := range tables {
		_, err := DB.Exec(table)
		if err != nil {
			log.Printf("Error creating table: %v\nQuery: %s", err, table)
		}
	}
	log.Println("Database tables verified/created")
}
*/