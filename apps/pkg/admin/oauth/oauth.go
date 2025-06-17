package oauth

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/adminhelper/admininformation"
	"github.com/markbates/goth/providers/google"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

// type ProviderIndex struct {
// 	Providers    []string
// 	ProvidersMap map[string]string
// }

// var userTemplate = `
// <html>
// <body>
//   <h1>User</h1>
//   <p>{{.}}</p>
// </body>
// </html>
// `

// var indexTemplate = `
// <html>
// <body>
//   <h1>Home</h1>
//   <p>{{.}}</p>
// </body>
// </html>
// `

// // InitProviders initializes Google as an auth provider
// func InitProviders() *ProviderIndex {
// 	const GOOGLE_KEY = "573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com"
// 	const GOOGLE_SECRET = "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"

// 	goth.UseProviders(
// 		google.New(GOOGLE_KEY, GOOGLE_SECRET, "http://localhost:10001/v1/auth/google/callback", "email", "profile"),
// 	)

// 	m := map[string]string{
// 		"google": "Google",
// 	}

// 	var keys []string
// 	for k := range m {
// 		keys = append(keys, k)
// 	}
// 	sort.Strings(keys)

// 	return &ProviderIndex{Providers: keys, ProvidersMap: m}
// }
// func AuthCallbackHandler(c *gin.Context, db *gorm.DB) {
// 	provider := c.Param("provider")
// 	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
// 	r := c.Request.WithContext(ctx)

// 	user, err := gothic.CompleteUserAuth(c.Writer, r)
// 	if err != nil {
// 		fmt.Fprintln(c.Writer, err)
// 		return
// 	}

// 	email := user.Email
// 	firstName := user.FirstName
// 	lastName := user.LastName

// 	jwtToken, err := admininformation.AddAdminInfo(c, db, email, firstName, lastName)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Final response — JSON only
// 	c.JSON(http.StatusOK, gin.H{
// 		"message":     "Google authentication successful",
// 		"jwtoken":     jwtToken,
// 		"accessToken": user.AccessToken,
// 		"firstName":   firstName,
// 		"lastName":    lastName,
// 	})
// }

// func LogoutHandler(c *gin.Context) {
// 	provider := c.Param("provider")
// 	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
// 	r := c.Request.WithContext(ctx)

// 	gothic.Logout(c.Writer, r)
// 	c.Redirect(http.StatusTemporaryRedirect, "/")
// }

// func AuthHandler(c *gin.Context) {
// 	provider := c.Param("provider")
// 	ctx := context.WithValue(c.Request.Context(), gothic.ProviderParamKey, provider)
// 	r := c.Request.WithContext(ctx)

// 	if gothUser, err := gothic.CompleteUserAuth(c.Writer, r); err == nil {
// 		t, _ := template.New("foo").Parse(userTemplate)
// 		t.Execute(c.Writer, gothUser)
// 	} else {
// 		gothic.BeginAuthHandler(c.Writer, r)
// 	}
// }

// func IndexHandler(c *gin.Context) {
// 	t, _ := template.New("foo").Parse(indexTemplate)
// 	t.Execute(c.Writer, "Welcome to the Google home page")
// }

// OAuth2 Config for Google
var googleOauthConfig = &oauth2.Config{
	ClientID:     "573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com",
	ClientSecret: "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",
	RedirectURL:  "http://localhost:10001/v1/auth/google/callback",
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
	Endpoint:     google.Endpoint,
}

const oauthGoogleUserInfoURL = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

// GoogleLoginHandler redirects user to Google's OAuth2 consent screen
func GoogleLoginHandler(c *gin.Context) {
	state := "randomstate" // TODO: Use secure random state and store it in session or Redis
	url := googleOauthConfig.AuthCodeURL(state)
	c.JSON(http.StatusOK, gin.H{"redirect_url": url})
}

// GoogleCallbackHandler handles Google callback, retrieves user info, and issues JWT
func GoogleCallbackHandler(c *gin.Context, db *gorm.DB) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Authorization code not found"})
		return
	}

	// Exchange code for token
	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token exchange failed", "details": err.Error()})
		return
	}

	// Get user info
	client := googleOauthConfig.Client(context.Background(), token)
	resp, err := client.Get(oauthGoogleUserInfoURL + token.AccessToken)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info"})
		return
	}
	defer resp.Body.Close()

	var userInfo struct {
		Email     string `json:"email"`
		FirstName string `json:"given_name"`
		LastName  string `json:"family_name"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode user info"})
		return
	}

	// Create or fetch admin and generate JWT
	jwtToken, err := admininformation.AddAdminInfo(c, db, userInfo.Email, userInfo.FirstName, userInfo.LastName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create or fetch admin info", "details": err.Error()})
		return
	}

	// Final Response
	c.JSON(http.StatusOK, gin.H{
		"message":   "Google authentication successful",
		"jwtoken":   jwtToken,
		"email":     userInfo.Email,
		"firstName": userInfo.FirstName,
		"lastName":  userInfo.LastName,
	})
}
