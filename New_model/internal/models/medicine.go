package models

import "time"

type Medicine struct {
	ID                   int       `json:"id"`
	Name                 string    `json:"name"`
	GenericName          string    `json:"generic_name"`
	Description          string    `json:"description"`
	Price                float64   `json:"price"`
	Stock                int       `json:"stock"`
	PrescriptionRequired bool      `json:"prescription_required"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}