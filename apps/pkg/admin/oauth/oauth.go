package oauth

import (
	"context"
	"fmt"
	"html/template"
	"net/http"
	"sort"

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
func AuthCallbackHandler(c *gin.Context, db *gorm.DB) {
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
