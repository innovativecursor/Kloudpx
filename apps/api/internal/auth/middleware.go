package auth

import (
	"net/http"
	"os"
	"strings"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Middleware to enforce role-based access control
func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists || userRole != role {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			c.Abort()
			return
		}
		c.Next()
	}
}

// AuthMiddleware verifies JWT tokens based on user role
func AuthMiddleware(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := extractToken(c)
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || token == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		// Check expiration
		if exp, ok := claims["exp"].(float64); !ok || float64(time.Now().Unix()) > exp {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
			return
		}

		// Role-based access control
		tokenRole, ok := claims["role"].(string)
		if role != "" && (tokenRole != role || !ok) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			return
		}

		setUserContext(c, claims, tokenRole)
		c.Next()
	}
}

// OAuthMiddleware for Admins
func OAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := extractToken(c)
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			return
		}

		// Verify OAuth token with provider
		adminInfo, err := GetAdminInfo(strings.TrimPrefix(tokenString, "Bearer "))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid OAuth token"})
			return
		}

		// Type assertion to extract values
		adminID, ok := adminInfo["ID"].(float64)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid admin ID"})
			return
		}

		name, ok := adminInfo["Name"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid name"})
			return
		}

		// Set admin information in context
		c.Set("adminID", int(adminID))
		c.Set("name", name)
		c.Set("role", "admin")
		c.Set("oauth", true)
		c.Next()
	}
}

// Extract Token from Header, Query, or Cookie
func extractToken(c *gin.Context) string {
	token := c.GetHeader("Authorization")
	if token == "" {
		token = c.Query("token")
	}
	if token == "" {
		cookie, err := c.Cookie("auth_token")
		if err == nil {
			token = cookie
		}
	}
	return strings.TrimPrefix(token, "Bearer ")
}

// Set User Context Based on Role
func setUserContext(c *gin.Context, claims jwt.MapClaims, role string) {
	if role == "admin" {
		adminID, ok := claims["admin_id"].(float64)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid admin ID"})
			return
		}
		name, ok := claims["name"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid name"})
			return
		}
		c.Set("adminID", int(adminID))
		c.Set("name", name)
	} else {
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
	}
}