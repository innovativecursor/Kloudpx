package auth

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/jwt"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"gorm.io/gorm"
)

func InitProviders() {
	cfg, err := config.Env()
	if err != nil {
		panic(fmt.Errorf("failed to load config for OAuth: %v", err))
	}

	goth.UseProviders(
		google.New(
			cfg.GoogleOAuth.ClientID,
			cfg.GoogleOAuth.ClientSecret,
			cfg.GoogleOAuth.RedirectURL,
			"email", "profile",
		),
	)
}

func AuthCallbackHandler(c *gin.Context, db *gorm.DB) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	user, err := gothic.CompleteUserAuth(c.Writer, r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create or update Admin
	admin := models.Admin{
		Name:          user.Name,
		Email:         &user.Email,
		OAuthID:       &user.UserID,
		OAuthProvider: &provider,
		LastLogin:     time.Now(),
	}

	result := db.Where(models.Admin{Email: &user.Email}).
		Attrs(admin).
		FirstOrCreate(&admin)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Generate JWT token
	token, err := jwt.GenerateToken(admin.ID, "admin")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Authentication successful",
		"token":   token,
		"admin":   admin,
	})
}

func AuthHandler(c *gin.Context) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	if _, err := gothic.CompleteUserAuth(c.Writer, r); err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "User already authenticated"})
	} else {
		gothic.BeginAuthHandler(c.Writer, r)
	}
}

func LogoutHandler(c *gin.Context) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	gothic.Logout(c.Writer, r)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

/*package oauth

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/jwthelper"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"gorm.io/gorm"
)

type ProviderIndex struct {
	Providers    []string
	ProvidersMap map[string]string
}

var userTemplate = `
<html>
<body>
  <h1>User</h1>
  <p>{{.}}</p>
</body>
</html>
`

var indexTemplate = `
<html>
<body>
  <h1>Home</h1>
  <p>{{.}}</p>
</body>
</html>
`

// InitProviders initializes Google as an auth provider
func InitProviders() *ProviderIndex {
	googleKey := os.Getenv("GOOGLE_KEY")
	googleSecret := os.Getenv("GOOGLE_SECRET")
	callbackURL := os.Getenv("GOOGLE_CALLBACK_URL") // Example: http://localhost:10001/v1/auth/google/callback

	if googleKey == "" || googleSecret == "" || callbackURL == "" {
		log.Fatal("OAuth credentials or callback URL missing in environment variables")
	}

	goth.UseProviders(
		google.New(googleKey, googleSecret, callbackURL, "email", "profile"),
	)

	m := map[string]string{
		"google": "Google",
	}

	var keys []string
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	return &ProviderIndex{Providers: keys, ProvidersMap: m}
}

func AuthCallbackHandler(c *gin.Context, db *gorm.DB) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	user, err := gothic.CompleteUserAuth(c.Writer, r)
	if err != nil {
		log.Println("OAuth callback error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	now := time.Now()

	// Create or update Admin
	admin := models.Admin{
		FirstName:     user.FirstName,
		LastName:      user.LastName,
		Email:         user.Email,
		EmailVerified: true,
		OAuthID:       &user.UserID,
		OAuthProvider: &provider,
		LastLogin:     &now,
	}

	result := db.Where("email = ?", user.Email).Attrs(admin).FirstOrCreate(&admin)
	if result.Error != nil {
		log.Println("Database error:", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Generate JWT token
	jwtToken, err := jwthelper.GenerateJWTToken(admin.ID)
	if err != nil {
		log.Println("JWT generation error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Authentication successful",
		"token":   jwtToken,
		"admin": gin.H{
			"id":         admin.ID,
			"first_name": admin.FirstName,
			"last_name":  admin.LastName,
			"email":      admin.Email,
		},
	})
}

func LogoutHandler(c *gin.Context) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	if err := gothic.Logout(c.Writer, r); err != nil {
		log.Println("Logout error:", err)
	}
	c.Redirect(http.StatusTemporaryRedirect, "/")
}

func AuthHandler(c *gin.Context) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	if gothUser, err := gothic.CompleteUserAuth(c.Writer, r); err == nil {
		tmpl, err := template.New("user").Parse(userTemplate)
		if err != nil {
			log.Println("Template parse error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Template parsing failed"})
			return
		}
		if err := tmpl.Execute(c.Writer, gothUser); err != nil {
			log.Println("Template execute error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Template execution failed"})
		}
	} else {
		gothic.BeginAuthHandler(c.Writer, r)
	}
}

func IndexHandler(c *gin.Context) {
	tmpl, err := template.New("index").Parse(indexTemplate)
	if err != nil {
		log.Println("Template parse error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load home page"})
		return
	}
	if err := tmpl.Execute(c.Writer, "Welcome to the Google home page"); err != nil {
		log.Println("Template execute error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to render home page"})
	}
}


/*package oauth

import (
	"context"
	"fmt"
	"html/template"
	"net/http"
	"sort"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/jwthelper"
	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/admininformation"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"gorm.io/gorm"
)

type ProviderIndex struct {
	Providers    []string
	ProvidersMap map[string]string
}

var userTemplate = `
<html>
<body>
  <h1>User</h1>
  <p>{{.}}</p>
</body>
</html>
`

var indexTemplate = `
<html>
<body>
  <h1>Home</h1>
  <p>{{.}}</p>
</body>
</html>
`

// InitProviders initializes Google as an auth provider
func InitProviders() *ProviderIndex {
	const GOOGLE_KEY = "573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com"
	const GOOGLE_SECRET = "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"

	goth.UseProviders(
		google.New(GOOGLE_KEY, GOOGLE_SECRET, "http://localhost:10001/v1/auth/google/callback", "email", "profile"),
	)

	m := map[string]string{
		"google": "Google",
	}

	var keys []string
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	return &ProviderIndex{Providers: keys, ProvidersMap: m}
}
/*func AuthCallbackHandler(c *gin.Context, db *gorm.DB) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	user, err := gothic.CompleteUserAuth(c.Writer, r)
	if err != nil {
		fmt.Fprintln(c.Writer, err)
		return
	}

	email := user.Email
	firstName := user.FirstName
	lastName := user.LastName

	jwtToken, err := admininformation.AddAdminInfo(c, db, email, firstName, lastName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Final response — JSON only
	c.JSON(http.StatusOK, gin.H{
		"message":     "Google authentication successful",
		"jwtoken":     jwtToken,
		"accessToken": user.AccessToken,
		"firstName":   firstName,
		"lastName":    lastName,
	})
}
*/
/*
func AuthCallbackHandler(c *gin.Context, db *gorm.DB) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	user, err := gothic.CompleteUserAuth(c.Writer, r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create or update Admin
	admin := models.Admin{
		Name:          user.FirstName + " " + user.LastName,
		Email:         &user.Email,
		OAuthID:       &user.UserID,
		OAuthProvider: &provider,
		LastLogin:     time.Now(),
	}

	result := db.Where(models.Admin{Email: &user.Email}).
		Attrs(admin).
		FirstOrCreate(&admin)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Generate JWT token
	jwtToken, err := jwthelper.GenerateJWTToken(admin.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Authentication successful",
		"token":   jwtToken,
		"admin":   admin,
	})
}

func LogoutHandler(c *gin.Context) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	gothic.Logout(c.Writer, r)
	c.Redirect(http.StatusTemporaryRedirect, "/")
}

func AuthHandler(c *gin.Context) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
	r := c.Request.WithContext(ctx)

	if gothUser, err := gothic.CompleteUserAuth(c.Writer, r); err == nil {
		t, _ := template.New("foo").Parse(userTemplate)
		t.Execute(c.Writer, gothUser)
	} else {
		gothic.BeginAuthHandler(c.Writer, r)
	}
}

func IndexHandler(c *gin.Context) {
	t, _ := template.New("foo").Parse(indexTemplate)
	t.Execute(c.Writer, "Welcome to the Google home page")
}
*/