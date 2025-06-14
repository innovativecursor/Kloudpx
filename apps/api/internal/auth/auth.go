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

var OAuthConfig = &oauth2.Config{
	ClientID:     "573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com",
	ClientSecret: "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",
	RedirectURL:  "postmessage",
	Scopes:       []string{"email", "profile"},
	Endpoint:     google.Endpoint,
}

// OAuthState generates a secure state token
func OAuthState() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

// OAuthLoginHandler initiates OAuth flow
func OAuthLoginHandler(c *gin.Context) {
	state := OAuthState()
	secure := os.Getenv("SECURE_COOKIE") == "true"
	c.SetCookie("oauth_state", state, 600, "/", os.Getenv("COOKIE_DOMAIN"), secure, true)
	url := OAuthConfig.AuthCodeURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// OAuthCallbackHandler handles OAuth callback
func OAuthCallbackHandler(c *gin.Context) {
	code := c.Query("code")
	log.Printf("OAuthConfig==> %s\n", OAuthConfig.RedirectURL)
	token, err := OAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	userInfo, err := GetUserInfo(token.AccessToken)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}

	// Find or create user based on OAuth ID
	user, err := FindOrCreateOAuthUser(userInfo)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user"})
		return
	}

	// Generate tokens
	accessToken, err := GenerateAccessToken(user.ID, user.Username, "user")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, expiresAt, err := GenerateRefreshToken(user.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	// Set refresh token in cookie
	SetRefreshTokenCookie(c, refreshToken, expiresAt)

	// Redirect to frontend with tokens
	c.JSON(http.StatusOK, gin.H{"access_token": accessToken, "user": user})

}

// UserInfo represents OAuth user information
type UserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// GetUserInfo retrieves user info from OAuth provider
func GetUserInfo(accessToken string) (*UserInfo, error) {
	req, err := http.NewRequest("GET", os.Getenv("OAUTH_USER_INFO_URL"), nil)
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
		return nil, fmt.Errorf("failed to get user info: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var userInfo UserInfo
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}

// FindOrCreateOAuthUser finds or creates a user based on OAuth info
func FindOrCreateOAuthUser(info *UserInfo) (*models.User, error) {
	var user models.User
	err := database.DB.QueryRow(
		"SELECT id, username, email FROM users WHERE oauth_id = $1",
		info.ID,
	).Scan(&user.ID, &user.Username, &user.Email)

	if err == nil {
		return &user, nil
	}

	if errors.Is(err, sql.ErrNoRows) {
		// Create new user
		username := generateUsername(info.Name)
		err = database.DB.QueryRow(
			`INSERT INTO users (username, email, oauth_id, oauth_provider) 
			VALUES ($1, $2, $3, 'oauth') 
			RETURNING id, username, email`,
			username, info.Email, info.ID,
		).Scan(&user.ID, &user.Username, &user.Email)

		if err != nil {
			return nil, err
		}
		return &user, nil
	}

	return nil, err
}

func generateUsername(name string) string {
	base := strings.ToLower(strings.ReplaceAll(name, " ", "_"))
	return fmt.Sprintf("%s_%d", base, time.Now().Unix())
}

// Token generation functions
func GenerateAccessToken(userID int, username, role string) (string, error) {
	expiry, _ := time.ParseDuration(os.Getenv("ACCESS_TOKEN_EXPIRY"))
	if expiry == 0 {
		expiry = 15 * time.Minute
	}

	claims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(expiry).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GenerateRefreshToken(userID int) (string, time.Time, error) {
	// Generate random token
	b := make([]byte, 64)
	_, err := rand.Read(b)
	if err != nil {
		return "", time.Time{}, err
	}
	token := base64.URLEncoding.EncodeToString(b)

	// Calculate expiration
	expiry, _ := time.ParseDuration(os.Getenv("REFRESH_TOKEN_EXPIRY"))
	if expiry == 0 {
		expiry = 7 * 24 * time.Hour // 7 days
	}
	expiresAt := time.Now().Add(expiry)

	// Store in database
	_, err = database.DB.Exec(
		"INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
		userID, token, expiresAt,
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

// LoginWithTokens handles token generation for authenticated users
func LoginWithTokens(userID int, username, role string, c *gin.Context) error {
	// Generate tokens
	accessToken, err := GenerateAccessToken(userID, username, role)
	if err != nil {
		return err
	}

	refreshToken, expiresAt, err := GenerateRefreshToken(userID)
	if err != nil {
		return err
	}

	// Set refresh token in cookie
	SetRefreshTokenCookie(c, refreshToken, expiresAt)

	// Update last login
	_, err = database.DB.Exec(
		"UPDATE users SET last_login = $1 WHERE id = $2",
		time.Now(), userID,
	)

	if err != nil {
		return err
	}

	// Return tokens
	c.JSON(http.StatusOK, models.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})

	return nil
}

// GeneratePrescriptionHash creates a unique hash for prescription
func GeneratePrescriptionHash(userID, medicineID int) string {
	data := []byte(fmt.Sprintf("%d-%d-%d", userID, medicineID, time.Now().UnixNano()))
	hash := sha256.Sum256(data)
	return fmt.Sprintf("%x", hash)
}

/*package auth

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
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"github.com/innovativecursor/Kloudpx/internal/database"
	"github.com/innovativecursor/Kloudpx/internal/models"
)

// OAuthConfig holds OAuth 2.0 configuration
var OAuthConfig = &oauth2.Config{
	ClientID:     os.Getenv("OAUTH_CLIENT_ID"),
	ClientSecret: os.Getenv("OAUTH_CLIENT_SECRET"),
	RedirectURL:  os.Getenv("OAUTH_REDIRECT_URL"),
	Scopes:       []string{"openid", "profile", "email"},
	Endpoint: oauth2.Endpoint{
		AuthURL:  os.Getenv("OAUTH_AUTH_URL"),
		TokenURL: os.Getenv("OAUTH_TOKEN_URL"),
	},
}

// OAuthState generates a secure state token
func OAuthState() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

// OAuthLoginHandler initiates OAuth flow
func OAuthLoginHandler(c *gin.Context) {
	state := OAuthState()
	secure := os.Getenv("SECURE_COOKIE") == "true"
	c.SetCookie("oauth_state", state, 600, "/", os.Getenv("COOKIE_DOMAIN"), secure, true)
	url := OAuthConfig.AuthCodeURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// OAuthCallbackHandler handles OAuth callback
func OAuthCallbackHandler(c *gin.Context) {
	state := c.Query("state")
	cookieState, err := c.Cookie("oauth_state")
	if err != nil || state != cookieState {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid state"})
		return
	}

	code := c.Query("code")
	token, err := OAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	userInfo, err := GetUserInfo(token.AccessToken)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}

	// Find or create user based on OAuth ID
	user, err := FindOrCreateOAuthUser(userInfo)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user"})
		return
	}

	// Generate tokens
	accessToken, err := GenerateAccessToken(user.ID, user.Username, "user")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, expiresAt, err := GenerateRefreshToken(user.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	// Set refresh token in cookie
	SetRefreshTokenCookie(c, refreshToken, expiresAt)

	// Redirect to frontend with tokens
	redirectURL := fmt.Sprintf("%s/login/success?access_token=%s", os.Getenv("FRONTEND_URL"), accessToken)
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

// UserInfo represents OAuth user information
type UserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// GetUserInfo retrieves user info from OAuth provider
func GetUserInfo(accessToken string) (*UserInfo, error) {
	req, err := http.NewRequest("GET", os.Getenv("OAUTH_USER_INFO_URL"), nil)
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
		return nil, fmt.Errorf("failed to get user info: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var userInfo UserInfo
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}

// FindOrCreateOAuthUser finds or creates a user based on OAuth info
func FindOrCreateOAuthUser(info *UserInfo) (*models.User, error) {
	var user models.User
	err := database.DB.QueryRow(
		"SELECT id, username, email FROM users WHERE oauth_id = $1",
		info.ID,
	).Scan(&user.ID, &user.Username, &user.Email)

	if err == nil {
		return &user, nil
	}

	if errors.Is(err, sql.ErrNoRows) {
		// Create new user
		username := generateUsername(info.Name)
		err = database.DB.QueryRow(
			`INSERT INTO users (username, email, oauth_id, oauth_provider)
			VALUES ($1, $2, $3, 'oauth')
			RETURNING id, username, email`,
			username, info.Email, info.ID,
		).Scan(&user.ID, &user.Username, &user.Email)

		if err != nil {
			return nil, err
		}
		return &user, nil
	}

	return nil, err
}

func generateUsername(name string) string {
	base := strings.ToLower(strings.ReplaceAll(name, " ", "_"))
	return fmt.Sprintf("%s_%d", base, time.Now().Unix())
}

// HashPassword generates a bcrypt hash of the password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash compares a password with its hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Token generation functions
func GenerateAccessToken(userID int, username, role string) (string, error) {
	expiry, _ := time.ParseDuration(os.Getenv("ACCESS_TOKEN_EXPIRY"))
	if expiry == 0 {
		expiry = 15 * time.Minute
	}

	claims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(expiry).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GenerateRefreshToken(userID int) (string, time.Time, error) {
	// Generate random token
	b := make([]byte, 64)
	_, err := rand.Read(b)
	if err != nil {
		return "", time.Time{}, err
	}
	token := base64.URLEncoding.EncodeToString(b)

	// Calculate expiration
	expiry, _ := time.ParseDuration(os.Getenv("REFRESH_TOKEN_EXPIRY"))
	if expiry == 0 {
		expiry = 7 * 24 * time.Hour // 7 days
	}
	expiresAt := time.Now().Add(expiry)

	// Store in database
	_, err = database.DB.Exec(
		"INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
		userID, token, expiresAt,
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

// AuthMiddleware verifies JWT tokens
/*func AuthMiddleware(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Try to get token from Authorization header
		tokenString := c.GetHeader("Authorization")

		// If not found in header, try from query parameter
		if tokenString == "" {
			tokenString = c.Query("token")
		}

		// If still not found, try from cookie
		if tokenString == "" {
			cookie, err := c.Cookie("auth_token")
			if err == nil {
				tokenString = cookie
			}
		}

		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			return
		}

		// Remove Bearer prefix if present
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		// Check token expiration
		exp, ok := claims["exp"].(float64)
		if !ok || float64(time.Now().Unix()) > exp {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
			return
		}

		// Role-based access control
		tokenRole, ok := claims["role"].(string)
		if role != "" && (tokenRole != role || !ok) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			return
		}

		// Set user information in context
		userID, ok := claims["user_id"].(float64)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
			return
		}

		username, ok := claims["username"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid username"})
			return
		}

		c.Set("userID", int(userID))
		c.Set("username", username)
		c.Set("role", tokenRole)
		c.Next()
	}
}*/

// LoginWithTokens handles token generation for authenticated users
/*func LoginWithTokens(userID int, username, role string, c *gin.Context) error {
	// Generate tokens
	accessToken, err := GenerateAccessToken(userID, username, role)
	if err != nil {
		return err
	}

	refreshToken, expiresAt, err := GenerateRefreshToken(userID)
	if err != nil {
		return err
	}

	// Set refresh token in cookie
	SetRefreshTokenCookie(c, refreshToken, expiresAt)

	// Update last login
	_, err = database.DB.Exec(
		"UPDATE users SET last_login = $1 WHERE id = $2",
		time.Now(), userID,
	)

	if err != nil {
		return err
	}

	// Return tokens
	c.JSON(http.StatusOK, models.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})

	return nil
}

// GeneratePrescriptionHash creates a unique hash for prescription
func GeneratePrescriptionHash(userID, medicineID int) string {
	data := []byte(fmt.Sprintf("%d-%d-%d", userID, medicineID, time.Now().UnixNano()))
	hash := sha256.Sum256(data)
	return fmt.Sprintf("%x", hash)
}
*/
