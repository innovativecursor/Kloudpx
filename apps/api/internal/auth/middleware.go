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

// AuthMiddleware verifies JWT tokens
func AuthMiddleware(requiredRole string) gin.HandlerFunc {
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
		if requiredRole != "" && (tokenRole != requiredRole || !ok) {
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
}

// OAuthMiddleware handles OAuth authentication
func OAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			return
		}

		// Verify OAuth token with provider
		userInfo, err := GetUserInfo(strings.TrimPrefix(tokenString, "Bearer "))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid OAuth token"})
			return
		}

		// Find or create user
		user, err := FindOrCreateOAuthUser(userInfo)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "User processing failed"})
			return
		}

		// Set user information in context
		c.Set("userID", user.ID)
		c.Set("username", user.Username)
		c.Set("role", "user")
		c.Set("oauth", true)
		c.Next()
	}
}

/*
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

// AuthMiddleware verifies JWT tokens
func AuthMiddleware(role string) gin.HandlerFunc {
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
}

// OAuthMiddleware handles OAuth authentication
func OAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			return
		}

		// Verify OAuth token with provider
		userInfo, err := GetUserInfo(strings.TrimPrefix(tokenString, "Bearer "))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid OAuth token"})
			return
		}

		// Find or create user
		user, err := FindOrCreateOAuthUser(userInfo)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "User processing failed"})
			return
		}

		// Set user information in context
		c.Set("userID", user.ID)
		c.Set("username", user.Username)
		c.Set("role", "user")
		c.Set("oauth", true)
		c.Next()
	}
}*/