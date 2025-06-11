package repositories

import (
	"errors"
	"gorm.io/gorm"
	"kloudpx-api/internal/models"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *OrderRepository) FindAll() ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Preload("User").Preload("Medicine").Find(&orders).Error
	return orders, err
}

func (r *OrderRepository) FindByID(id uint) (models.Order, error) {
	var order models.Order
	err := r.db.Preload("User").Preload("Medicine").First(&order, id).Error
	return order, err
}

func (r *OrderRepository) Update(order *models.Order) error {
	return r.db.Save(order).Error
}

func (r *OrderRepository) Delete(id uint) error {
	result := r.db.Delete(&models.Order{}, id)
	if result.RowsAffected == 0 {
		return errors.New("order not found")
	}
	return result.Error
}

func (r *OrderRepository) FindByUserID(userID uint) ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Preload("Medicine").Where("user_id = ?", userID).Find(&orders).Error
	return orders, err
}