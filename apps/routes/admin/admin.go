package admin

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/category"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/cms"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/generic"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/itemimage"
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

	//category
	apiV1.POST("/category/add-category", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		category.AddCategory(c, db)
	})

	apiV1.GET("/category/get-all-category", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		category.GetAllCategories(c, db)
	})

	apiV1.DELETE("/category/delete-category/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		category.DeleteCategory(c, db)
	})

	apiV1.POST("/category/add-category-icon", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		category.AddCategoryIcon(c, db)
	})

	apiV1.GET("/category/get-all-category-icon", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		category.GetAllCategoryIcons(c, db)
	})
	//upload images
	apiV1.POST("/itemimage/add-itemimage", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		itemimage.UploadProdutImages(c, db)
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

	//cms
	//carousel
	apiV1.POST("/carousel/add-carousel-img", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		cms.CarouselImageUpload(c, db)
	})

	apiV1.GET("/carousel/get-all-carousel-img", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		cms.GetAllCarouselImagesForAdmin(c, db)
	})

	apiV1.PUT("/carousel/update-status/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		cms.ToggleCarouselImageStatus(c, db)
	})

	apiV1.DELETE("/carousel/delete-carousel-img/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		cms.DeleteCarouselImage(c, db)
	})

	//gallery
	apiV1.POST("/gallery/add-gallery-img", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		cms.GalleryImageUpload(c, db)
	})

	apiV1.GET("/gallery/get-all-gallery-img", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		cms.GetAllGalleryImagesForAdmin(c, db)
	})

	apiV1.PUT("/gallery/update-status/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		cms.ToggleGalleryImageStatus(c, db)
	})

	apiV1.DELETE("/gallery/delete-gallery-img/:id", middleware.JWTMiddlewareAdmin(db), func(c *gin.Context) {
		cms.DeleteGalleryImage(c, db)
	})

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
