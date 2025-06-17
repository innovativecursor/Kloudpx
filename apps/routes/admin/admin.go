package admin

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/generic"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/oauth"
	"github.com/innovativecursor/Kloudpx/apps/pkg/middleware"
	"github.com/innovativecursor/Kloudpx/apps/routes/getapiroutes"
	"gorm.io/gorm"
)

func Admin(db *gorm.DB) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10001"
		log.Printf("Defaulting to port %s", port)
	}

	apiV1, router := getapiroutes.GetApiRoutes()

	// Define handlers
	apiV1.GET("/admin", func(c *gin.Context) {
		c.String(http.StatusOK, "admin Service Healthy")
	})

	// apiV1.GET("/auth/:provider", func(c *gin.Context) {
	// 	oauth.AuthHandler(c)
	// })

	// //handle Handle google callback
	// apiV1.GET("/auth/:provider/callback", func(c *gin.Context) {
	// 	oauth.AuthCallbackHandler(c, db)
	// })

	// apiV1.GET("/auth/google", func(c *gin.Context) {
	// 	oauth.GoogleLoginHandler(c)
	// })

	apiV1.GET("/auth/google/callback", func(c *gin.Context) {
		oauth.GoogleCallbackHandler(c, db)
	})

	//add generic
	apiV1.POST("/generic/add-generic", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		generic.AddGeneric(c, db)
	})

	//add generic
	apiV1.GET("/generic/get-generic", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		generic.GetAllGenerics(c, db)
	})

	//add generic
	apiV1.GET("/generic/delete-generic/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		generic.DeleteGeneric(c, db)
	})
	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
