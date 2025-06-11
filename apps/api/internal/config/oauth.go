package config

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"os"
)

var (
	GoogleOAuthConfig *oauth2.Config
)

func SetupOAuthConfig() {
	GoogleOAuthConfig = &oauth2.Config{
		RedirectURL:  os.Getenv("OAUTH_REDIRECT_URL"),
		ClientID:     os.Getenv("OAUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("OAUTH_CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
}