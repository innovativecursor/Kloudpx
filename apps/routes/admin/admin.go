package admin

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/generic"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/medicine"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/oauth"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/supplier"
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

	// Define handlers oauth
	apiV1.GET("/admin", func(c *gin.Context) {
		c.String(http.StatusOK, "admin Service Healthy")
	})

	apiV1.GET("/auth/google/callback", func(c *gin.Context) {
		oauth.GoogleCallbackHandler(c, db)
	})

	//generic
	apiV1.POST("/generic/add-generic", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		generic.AddGeneric(c, db)
	})

	apiV1.GET("/generic/get-generic", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		generic.GetAllGenerics(c, db)
	})

	apiV1.DELETE("/generic/delete-generic/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		generic.DeleteGeneric(c, db)
	})

	//supplier
	apiV1.POST("/supplier/add-supplier", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		supplier.AddSupplier(c, db)
	})

	apiV1.GET("/supplier/get-all-supplier", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		supplier.GetAllSuppliers(c, db)
	})

	apiV1.DELETE("/supplier/delete-supplier/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		supplier.DeleteSupplier(c, db)
	})

	//medicine
	apiV1.POST("/medicine/add-medicine", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		medicine.AddMedicine(c, db)
	})

	apiV1.GET("/medicine/get-all-medicine", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		medicine.GetAllMedicines(c, db)
	})

	apiV1.PUT("/medicine/update-medicine/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		medicine.UpdateMedicine(c, db)
	})

	apiV1.DELETE("/medicine/delete-medicine/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		medicine.DeleteMedicine(c, db)
	})

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
