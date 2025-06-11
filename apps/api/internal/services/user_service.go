package services

import (
	"errors"
	"kloudpx-api/internal/models"
	"kloudpx-api/internal/repositories"
)

type UserService struct {
	userRepo *repositories.UserRepository
}

func NewUserService(userRepo *repositories.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

func (s *UserService) CreateUser(user *models.User) error {
	// Check if email already exists
	_, err := s.userRepo.FindByEmail(user.Email)
	if err == nil {
		return errors.New("user with this email already exists")
	}

	// Hash password
	if err := user.HashPassword(); err != nil {
		return err
	}

	return s.userRepo.Create(user)
}

func (s *UserService) GetAllUsers() ([]models.User, error) {
	return s.userRepo.FindAll()
}

func (s *UserService) GetUserByID(id uint) (*models.User, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserService) UpdateUser(id uint, updatedUser *models.User) error {
	existing, err := s.userRepo.FindByID(id)
	if err != nil {
		return err
	}

	// Check if email is being changed to an existing one
	if existing.Email != updatedUser.Email {
		_, err := s.userRepo.FindByEmail(updatedUser.Email)
		if err == nil {
			return errors.New("user with this email already exists")
		}
	}

	// Update fields
	existing.Name = updatedUser.Name
	existing.Email = updatedUser.Email
	existing.Role = updatedUser.Role

	// Only update password if provided
	if updatedUser.Password != "" {
		existing.Password = updatedUser.Password
		if err := existing.HashPassword(); err != nil {
			return err
		}
	}

	return s.userRepo.Update(&existing)
}

func (s *UserService) DeleteUser(id uint) error {
	return s.userRepo.Delete(id)
}

func (s *UserService) ChangePassword(userID uint, currentPassword, newPassword string) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	if err := user.CheckPassword(currentPassword); err != nil {
		return errors.New("current password is incorrect")
	}

	user.Password = newPassword
	if err := user.HashPassword(); err != nil {
		return err
	}

	return s.userRepo.Update(&user)
}

func (s *UserService) GetUserByProviderID(provider, providerID string) (*models.User, error) {
	user, err := s.userRepo.FindByProvider(provider, providerID)
	if err != nil {
		return nil, err
	}
	return &user, nil
}