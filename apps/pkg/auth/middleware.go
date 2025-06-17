package auth

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/jwt"
)

// AuthMiddleware verifies JWT tokens and sets user context
func AuthMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := jwt.ParseToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Check if user has required role
		if len(roles) > 0 {
			userRole, ok := claims["role"].(string)
			if !ok {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid role claim"})
				return
			}

			roleValid := false
			for _, r := range roles {
				if r == userRole {
					roleValid = true
					break
				}
			}

			if !roleValid {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
				return
			}
		}

		c.Set("user_id", claims["user_id"])
		c.Set("role", claims["role"])
		c.Next()
	}
}