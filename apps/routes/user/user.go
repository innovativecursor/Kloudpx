package user

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/middleware"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/oauthuser"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/uploadprescription"
	"github.com/innovativecursor/Kloudpx/apps/routes/getapiroutes"
	"gorm.io/gorm"
)

func User(db *gorm.DB) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10003"
		log.Printf("Defaulting to port %s", port)
	}

	apiV1, router := getapiroutes.GetApiRoutes()

	// Define handlers oauth
	apiV1.GET("/users", func(c *gin.Context) {
		c.String(http.StatusOK, "users Service Healthy")
	})

	apiV1.GET("/auth/google/callback/user", func(c *gin.Context) {
		oauthuser.GoogleUserCallbackHandler(c, db)
	})

	apiV1.POST("/user/upload-prescription", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		uploadprescription.UploadPrescription(c, db)
	})

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
