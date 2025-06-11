package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"kloudpx-api/internal/config"
	"kloudpx-api/internal/models"
	"kloudpx-api/internal/repositories"
	"golang.org/x/oauth2"
)

type AuthService struct {
	userRepo *repositories.UserRepository
	oauthCfg *oauth2.Config
}

func NewAuthService(userRepo *repositories.UserRepository, oauthCfg *oauth2.Config) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		oauthCfg: oauthCfg,
	}
}

func (s *AuthService) Register(user *models.User) error {
	// Check if user already exists
	_, err := s.userRepo.FindByEmail(user.Email)
	if err == nil {
		return errors.New("user already exists")
	}

	// Hash password
	if err := user.HashPassword(); err != nil {
		return err
	}

	// Create user
	return s.userRepo.Create(user)
}

func (s *AuthService) Login(email, password string) (*models.User, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := user.CheckPassword(password); err != nil {
		return nil, errors.New("invalid credentials")
	}

	return &user, nil
}

func (s *AuthService) GetUserProfile(userID uint) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *AuthService) GetOAuthLoginURL(state string) string {
	return s.oauthCfg.AuthCodeURL(state)
}

func (s *AuthService) HandleOAuthCallback(ctx context.Context, code string, provider string) (*models.User, error) {
	token, err := s.oauthCfg.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("oauth exchange failed: %v", err)
	}

	client := s.oauthCfg.Client(ctx, token)
	
	// Get user info from provider (example for Google)
	userInfo, err := getGoogleUserInfo(client)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %v", err)
	}

	// Create or update user
	user := &models.User{
		Name:       userInfo.Name,
		Email:      userInfo.Email,
		Provider:   provider,
		ProviderID: userInfo.ID,
		Avatar:     userInfo.Picture,
	}

	if err := s.userRepo.CreateOrUpdateFromOAuth(user); err != nil {
		return nil, fmt.Errorf("failed to create/update user: %v", err)
	}

	return user, nil
}

type GoogleUserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

func getGoogleUserInfo(client *http.Client) (*GoogleUserInfo, error) {
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userInfo GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}