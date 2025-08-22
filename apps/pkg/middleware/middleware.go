package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

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

func JWTMiddlewareUser(db *gorm.DB) gin.HandlerFunc {
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

		// Remove "Bearer " prefix if present
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
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

		var user models.User
		var dbErr error

		// Try email or phone
		if email, ok := claims["email"].(string); ok && email != "" {
			dbErr = db.Where("LOWER(email) = ?", strings.ToLower(email)).First(&user).Error
		} else if phone, ok := claims["phone"].(string); ok && phone != "" {
			dbErr = db.Where("phone = ?", phone).First(&user).Error
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No email or phone in token claims"})
			return
		}

		if dbErr != nil {
			if errors.Is(dbErr, gorm.ErrRecordNotFound) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			} else {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", dbErr)})
			}
			return
		}

		// Set user in context
		c.Set("user", &user)

		c.Next()
	}
}

//TODO! Deprecated: This version of JWTMiddlewareUser only works when an email is always present in the JWT claims.
// In our case, users can log in using either email or phone.
// When the JWT is generated using phone login, there is no email in the claims,
// which causes the middleware to fail with "Invalid email claim".
// Replaced with a newer implementation that first checks for "email" in claims,
// and falls back to "phone" if email is not present.
// func JWTMiddlewareUser(db *gorm.DB) gin.HandlerFunc {
// 	// Load JWT secret from config
// 	cfg, err := env.Env()
// 	if err != nil {
// 		return func(c *gin.Context) {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to load config: %v", err)})
// 			c.Abort()
// 		}
// 	}

// 	jwtSecret := []byte(cfg.JWT.Secret)

// 	return func(c *gin.Context) {
// 		// Extract token from Authorization header
// 		tokenString := c.GetHeader("Authorization")
// 		if tokenString == "" {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
// 			return
// 		}

// 		// Parse and validate the token
// 		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
// 			// Validate the signing method
// 			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 				return nil, errors.New("invalid signing method")
// 			}
// 			return jwtSecret, nil
// 		})

// 		if err != nil || !token.Valid {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
// 			return
// 		}

// 		// Extract claims
// 		claims, ok := token.Claims.(jwt.MapClaims)
// 		if !ok {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
// 			return
// 		}

// 		email, ok := claims["email"].(string)
// 		if !ok {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid email claim"})
// 			return
// 		}

// 		// Fetch the user from the database
// 		var user models.User
// 		if err := db.Where("email = ?", email).First(&user).Error; err != nil {
// 			if errors.Is(err, gorm.ErrRecordNotFound) {
// 				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 			} else {
// 				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
// 			}
// 			return
// 		}

// 		// Set user in context
// 		c.Set("user", &user)

// 		// Continue to next handler
// 		c.Next()
// 	}
// }
