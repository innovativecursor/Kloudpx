package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"kloudpx-api/internal/config"
	"kloudpx-api/internal/models"
	"kloudpx-api/internal/repositories"
	"net/http"
	//"net/url"
	//"strings"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

type OAuthService interface {
	GetLoginURL(provider, state string) string
	ExchangeCodeForToken(provider, code string) (*oauth2.Token, error)
	GetUserInfo(provider string, token *oauth2.Token) (*models.User, error)
}

type oauthService struct {
	config      *config.Config
	userRepo    repositories.UserRepository
	providers   map[string]*oauth2.Config
	userInfoURL map[string]string
}

func NewOAuthService(cfg *config.Config, userRepo repositories.UserRepository) OAuthService {
	// Initialize provider configurations
	providers := make(map[string]*oauth2.Config)
	userInfoURLs := make(map[string]string)

	// Google configuration
	providers["google"] = &oauth2.Config{
		ClientID:     cfg.ClientID,
		ClientSecret: cfg.ClientSecret,
		RedirectURL:  cfg.RedirectURL,
		Scopes:       cfg.Scopes,
		Endpoint:     google.Endpoint,
	}
	userInfoURLs["google"] = cfg.UserInfoURL

	// GitHub configuration (example of adding another provider)
	providers["github"] = &oauth2.Config{
		ClientID:     cfg.ClientID,
		ClientSecret: cfg.ClientSecret,
		RedirectURL:  cfg.RedirectURL,
		Scopes:       []string{"user:email"},
		Endpoint:     github.Endpoint,
	}
	userInfoURLs["github"] = "https://api.github.com/user"

	return &oauthService{
		config:      cfg,
		userRepo:    userRepo,
		providers:   providers,
		userInfoURL: userInfoURLs,
	}
}

func (s *oauthService) GetLoginURL(provider, state string) string {
	if config, ok := s.providers[provider]; ok {
		return config.AuthCodeURL(state)
	}
	return ""
}

func (s *oauthService) ExchangeCodeForToken(provider, code string) (*oauth2.Token, error) {
	if config, ok := s.providers[provider]; ok {
		return config.Exchange(context.Background(), code)
	}
	return nil, fmt.Errorf("provider %s not configured", provider)
}

func (s *oauthService) GetUserInfo(provider string, token *oauth2.Token) (*models.User, error) {
	userInfoURL, ok := s.userInfoURL[provider]
	if !ok {
		return nil, fmt.Errorf("provider %s not supported", provider)
	}

	client := s.providers[provider].Client(context.Background(), token)
	req, err := http.NewRequest("GET", userInfoURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Set appropriate headers based on provider
	switch provider {
	case "github":
		req.Header.Set("Accept", "application/vnd.github.v3+json")
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("failed to get user info: status %d, body: %s", resp.StatusCode, string(body))
	}

	var userInfo struct {
		Sub       string `json:"sub"`       // Google
		ID        int    `json:"id"`        // GitHub
		Name      string `json:"name"`
		Email     string `json:"email"`
		AvatarURL string `json:"picture"`   // Google
		Avatar    string `json:"avatar_url"` // GitHub
		Login     string `json:"login"`     // GitHub username
	}

	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, fmt.Errorf("failed to decode user info: %v", err)
	}

	// Normalize user data
	email := userInfo.Email
	name := userInfo.Name
	avatar := userInfo.AvatarURL

	if provider == "github" {
		if email == "" {
			// GitHub might not return email in the first request
			email = fmt.Sprintf("%d@users.noreply.github.com", userInfo.ID)
		}
		if name == "" {
			name = userInfo.Login
		}
		if avatar == "" {
			avatar = userInfo.Avatar
		}
	}

	if email == "" {
		return nil, errors.New("email not available from OAuth2 provider")
	}

	// Check if user exists, if not create a new one
	user, err := s.userRepo.GetByEmail(email)
	if err == nil {
		return user, nil
	}

	// Create new user
	newUser := &models.User{
		Name:      name,
		Email:     email,
		AvatarURL: avatar,
		Provider:  provider,
		Role:      "user",
	}

	if err := s.userRepo.Create(newUser); err != nil {
		return nil, fmt.Errorf("failed to create user: %v", err)
	}

	return newUser, nil
}