package auth

import (
	"context"
	"crypto/rand"
	"fmt"
	//"log"
	"net/http"
	//"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var oauthConf = &oauth2.Config{
	ClientID:     "573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com",
	ClientSecret: "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",
	RedirectURL:  "postmessage",
	Scopes:       []string{"email", "profile"},
	Endpoint:     google.Endpoint,
}

// Generate a random state token for security
func generateStateToken() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

// Admin Login (OAuth2)
func HandleAdminLogin(w http.ResponseWriter, r *http.Request) {
	state := generateStateToken()
	url := oauthConf.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusFound)
}

// OAuth2 Callback for Admins
func HandleAdminCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	token, err := oauthConf.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to get token", http.StatusInternalServerError)
		return
	}
	// Store refresh token securely
	fmt.Fprintf(w, "Access Token: %s\nRefresh Token: %s", token.AccessToken, token.RefreshToken)
}

// Refresh Access Token
func RefreshAccessToken(refreshToken string) (*oauth2.Token, error) {
	tokenSource := oauthConf.TokenSource(context.Background(), &oauth2.Token{
		RefreshToken: refreshToken,
	})

	newToken, err := tokenSource.Token()
	if err != nil {
		return nil, err
	}
	return newToken, nil
}