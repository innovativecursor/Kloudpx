package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
}

var (
	OAuthConfig = &oauth2.Config{
		ClientID:     os.Getenv("573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com"),
		ClientSecret: os.Getenv("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"),
		RedirectURL:  os.Getenv("postmessage"),
		Scopes:       []string{"email", "profile"},
		Endpoint:     google.Endpoint,
	}
	AdminDomains = strings.Split(os.Getenv("ADMIN_DOMAINS"), ",")
)

// AdminInfo represents OAuth admin information
type AdminInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// OAuthState generates a secure state token
func OAuthState() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

// GetAdminInfo retrieves admin info from OAuth provider
func GetAdminInfo(accessToken string) (*AdminInfo, error) {
	req, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get admin info: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var adminInfo AdminInfo
	if err := json.Unmarshal(body, &adminInfo); err != nil {
		return nil, err
	}

	// Verify admin domain
	isAdmin := false
	for _, domain := range AdminDomains {
		if strings.HasSuffix(adminInfo.Email, domain) {
			isAdmin = true
			break
		}
	}

	if !isAdmin {
		return nil, errors.New("user is not an admin")
	}

	return &adminInfo, nil
}

// FindOrCreateAdmin finds or creates an admin based on OAuth info
func FindOrCreateAdmin(info *AdminInfo) (*models.Admin, error) {
	var admin models.Admin
	err := database.DB.QueryRow(
		"SELECT id, name, email FROM admins WHERE email = $1",
		info.Email,
	).Scan(&admin.ID, &admin.Name, &admin.Email)

	if err == nil {
		return &admin, nil
	}

	if errors.Is(err, sql.ErrNoRows) {
		// Create new admin
		err = database.DB.QueryRow(
			`INSERT INTO admins (name, email, oauth_id, oauth_provider) 
			VALUES ($1, $2, $3, 'google') 
			RETURNING id, name, email`,
			info.Name, info.Email, info.ID,
		).Scan(&admin.ID, &admin.Name, &admin.Email)

		if err != nil {
			return nil, err
		}
		return &admin, nil
	}

	return nil, err
}

// Token generation functions
func GenerateAdminAccessToken(adminID int, name string) (string, error) {
	expiry, _ := time.ParseDuration(os.Getenv("ACCESS_TOKEN_EXPIRY"))
	if expiry == 0 {
		expiry = 15 * time.Minute
	}

	claims := jwt.MapClaims{
		"admin_id": adminID,
		"name":     name,
		"role":     "admin",
		"exp":      time.Now().Add(expiry).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GenerateAdminRefreshToken(adminID int) (string, time.Time, error) {
	b := make([]byte, 64)
	_, err := rand.Read(b)
	if err != nil {
		return "", time.Time{}, err
	}
	token := base64.URLEncoding.EncodeToString(b)

	expiry, _ := time.ParseDuration(os.Getenv("REFRESH_TOKEN_EXPIRY"))
	if expiry == 0 {
		expiry = 7 * 24 * time.Hour // 7 days
	}
	expiresAt := time.Now().Add(expiry)

	_, err = database.DB.Exec(
		"INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
		adminID, token, expiresAt,
	)

	if err != nil {
		return "", time.Time{}, err
	}

	return token, expiresAt, nil
}

func SetRefreshTokenCookie(c *gin.Context, token string, expires time.Time) {
	secure := os.Getenv("SECURE_COOKIE") == "true"
	c.SetCookie("refresh_token", token, int(time.Until(expires).Seconds()), "/",
		os.Getenv("COOKIE_DOMAIN"), secure, true)
}

// OAuthLoginHandler initiates OAuth flow for admins
func AdminOAuthLoginHandler(c *gin.Context) {
	state := OAuthState()
	secure := os.Getenv("SECURE_COOKIE") == "true"
	c.SetCookie("oauth_state", state, 600, "/", os.Getenv("COOKIE_DOMAIN"), secure, true)
	url := OAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// AdminOAuthCallbackHandler handles OAuth callback for admins
func AdminOAuthCallbackHandler(c *gin.Context) {
	state := c.Query("state")
	cookieState, err := c.Cookie("oauth_state")
	if err != nil || state != cookieState {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid state parameter"})
		return
	}

	code := c.Query("code")
	token, err := OAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		log.Printf("Token exchange error: %v", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	adminInfo, err := GetAdminInfo(token.AccessToken)
	if err != nil {
		log.Printf("Admin info error: %v", err)
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access restricted to admins only"})
		return
	}

	admin, err := FindOrCreateAdmin(adminInfo)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to process admin"})
		return
	}

	accessToken, err := GenerateAdminAccessToken(admin.ID, admin.Name)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, expiresAt, err := GenerateAdminRefreshToken(admin.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	// Set refresh token in cookie
	SetRefreshTokenCookie(c, refreshToken, expiresAt)

	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
		"admin_id":     admin.ID,
		"name":         admin.Name,
		"email":        admin.Email,
	})
}

// Logout handles token invalidation
func Logout(c *gin.Context) {
	// Get refresh token from cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No refresh token found"})
		return
	}

	// Delete refresh token from database
	_, err = database.DB.Exec("DELETE FROM refresh_tokens WHERE token = $1", refreshToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to logout"})
		return
	}

	// Clear the cookie
	c.SetCookie("refresh_token", "", -1, "/", os.Getenv("COOKIE_DOMAIN"), os.Getenv("SECURE_COOKIE") == "true", true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// UserLogin handles JWT login for regular users
func UserLogin(c *gin.Context) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Authenticate user
	var user models.User
	err := database.DB.QueryRow(
		"SELECT id, username FROM users WHERE username = $1 AND password = crypt($2, password)",
		credentials.Username, credentials.Password,
	).Scan(&user.ID, &user.Username)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Generate tokens
	accessToken, err := GenerateAccessToken(user.ID, user.Username, "user")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	refreshToken, expiresAt, err := GenerateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Refresh token generation failed"})
		return
	}

	SetRefreshTokenCookie(c, refreshToken, expiresAt)

	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
		},
	})
}

// PharmacistLogin handles JWT login for pharmacists
func PharmacistLogin(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Authenticate pharmacist
	var pharmacist models.Pharmacist
	err := database.DB.QueryRow(
		"SELECT id, name, email FROM pharmacists WHERE email = $1 AND password = crypt($2, password)",
		credentials.Email, credentials.Password,
	).Scan(&pharmacist.ID, &pharmacist.Name, &pharmacist.Email)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Generate tokens
	accessToken, err := GenerateAccessToken(pharmacist.ID, pharmacist.Name, "pharmacist")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	refreshToken, expiresAt, err := GenerateRefreshToken(pharmacist.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Refresh token generation failed"})
		return
	}

	SetRefreshTokenCookie(c, refreshToken, expiresAt)

	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
		"pharmacist": gin.H{
			"id":    pharmacist.ID,
			"name":  pharmacist.Name,
			"email": pharmacist.Email,
		},
	})
}

// GenerateAccessToken (updated to handle all roles)
func GenerateAccessToken(userID int, username, role string) (string, error) {
	expiry := 15 * time.Minute
	claims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(expiry).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// GenerateRefreshToken (generic for all user types)
func GenerateRefreshToken(userID int) (string, time.Time, error) {
	b := make([]byte, 64)
	_, err := rand.Read(b)
	if err != nil {
		return "", time.Time{}, err
	}
	token := base64.URLEncoding.EncodeToString(b)

	expiry := 7 * 24 * time.Hour
	expiresAt := time.Now().Add(expiry)

	_, err = database.DB.Exec(
		"INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
		userID, token, expiresAt,
	)
	if err != nil {
		return "", time.Time{}, err
	}

	return token, expiresAt, nil
}

// GeneratePrescriptionHash creates a unique hash for prescription
func GeneratePrescriptionHash(adminID, medicineID int) string {
	data := []byte(fmt.Sprintf("%d-%d-%d", adminID, medicineID, time.Now().UnixNano()))
	hash := sha256.Sum256(data)
	return fmt.Sprintf("%x", hash)
}
