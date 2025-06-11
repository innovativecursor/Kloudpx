package controllers

import (
	"net/http"
	"time"

	"kloudpx-api/internal/models"
	"kloudpx-api/internal/services"
	"kloudpx-api/internal/utils"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService services.AuthService
}

func NewAuthController(authService services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

// @Summary Login with OAuth2
// @Description Redirects to OAuth provider for login
// @Tags auth
// @Produce json
// @Success 302
// @Router /auth/login [get]
func (ac *AuthController) Login(c *gin.Context) {
	state := time.Now().Unix()
	url := ac.authService.GetLoginURL(string(state))
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// @Summary OAuth2 callback
// @Description Handles OAuth2 callback and returns JWT token
// @Tags auth
// @Param code query string true "Authorization code"
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Router /auth/callback [get]
func (ac *AuthController) Callback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		utils.RespondWithError(c, http.StatusBadRequest, "Authorization code not provided")
		return
	}

	user, token, err := ac.authService.ExchangeCode(code)
	if err != nil {
		utils.RespondWithError(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, gin.H{
		"token": token,
		"user":  user,
	})
}

// @Summary Get current user profile
// @Description Returns the authenticated user's profile
// @Tags auth
// @Security BearerAuth
// @Produce json
// @Success 200 {object} models.User
// @Failure 401 {object} utils.ErrorResponse
// @Router /auth/profile [get]
func (ac *AuthController) Profile(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		utils.RespondWithError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, user)
}

// @Summary Refresh token
// @Description Refreshes an expired access token
// @Tags auth
// @Param refresh_token body string true "Refresh token"
// @Produce json
// @Success 200 {object} map[string]string
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Router /auth/refresh [post]
func (ac *AuthController) RefreshToken(c *gin.Context) {
	var request struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	newToken, err := ac.authService.RefreshToken(request.RefreshToken)
	if err != nil {
		utils.RespondWithError(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, gin.H{
		"token": newToken,
	})
}

// @Summary Logout
// @Description Invalidates the current session
// @Tags auth
// @Security BearerAuth
// @Produce json
// @Success 200 {object} map[string]string
// @Failure 401 {object} utils.ErrorResponse
// @Router /auth/logout [post]
func (ac *AuthController) Logout(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	if err := ac.authService.Logout(tokenString); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, "Failed to logout")
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, gin.H{
		"message": "Successfully logged out",
	})
}