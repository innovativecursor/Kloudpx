package middleware

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	env "github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

func JWTMiddlewareAdmin(db *gorm.DB) gin.HandlerFunc {
	// Load JWT secret from config
	cfg, err := env.Env()
	if err != nil {
		return func(c *gin.Context) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to load config: %v", err)})
			c.Abort()
		}
	}

	jwtSecret := []byte(cfg.JWT.Secret)

	return func(c *gin.Context) {
		// Extract token from Authorization header
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
			return
		}

		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("invalid signing method")
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		email, ok := claims["email"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid email claim"})
			return
		}

		// Fetch the user from the database
		var admin models.Admin
		if err := db.Where("email = ?", email).First(&admin).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			} else {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
			}
			return
		}

		// Set user in context
		c.Set("user", &admin)

		// Continue to next handler
		c.Next()
	}
}

func JWTMiddlewarePharmacist(db *gorm.DB) gin.HandlerFunc {
	// Load JWT secret from config
	cfg, err := env.Env()
	if err != nil {
		return func(c *gin.Context) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to load config: %v", err)})
			c.Abort()
		}
	}

	jwtSecret := []byte(cfg.JWT.Secret)

	return func(c *gin.Context) {
		// Extract token from Authorization header
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
			return
		}

		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("invalid signing method")
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		email, ok := claims["email"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid email claim"})
			return
		}

		// Fetch the user from the database
		var pharmacist models.Pharmacist
		if err := db.Where("email = ?", email).First(&pharmacist).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			} else {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
			}
			return
		}

		// Set user in context
		c.Set("user", &pharmacist)

		// Continue to next handler
		c.Next()
	}
}
