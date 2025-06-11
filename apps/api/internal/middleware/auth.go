package middleware

import (
	"net/http"
	"strings"

	"kloudpx-api/internal/services"
	"kloudpx-api/internal/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService services.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.RespondWithError(c, http.StatusUnauthorized, "Authorization header is required")
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			utils.RespondWithError(c, http.StatusUnauthorized, "Invalid token format")
			c.Abort()
			return
		}

		user, err := authService.ValidateToken(tokenString)
		if err != nil {
			utils.RespondWithError(c, http.StatusUnauthorized, "Invalid token")
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

func AdminMiddleware(authService services.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			utils.RespondWithError(c, http.StatusUnauthorized, "User not authenticated")
			c.Abort()
			return
		}

		if !authService.IsAdmin(user.(*models.User)) {
			utils.RespondWithError(c, http.StatusForbidden, "Admin access required")
			c.Abort()
			return
		}

		c.Next()
	}
}