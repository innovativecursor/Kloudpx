package user

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/middleware"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/checkoutflow"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/oauthuser"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/uploadprescription"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/userflow"
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

	apiV1.GET("/user/get-medicines", func(c *gin.Context) {
		userflow.GetMedicinesForUser(c, db)
	})

	apiV1.GET("/user/get-all-brands", func(c *gin.Context) {
		userflow.GetAllBrandNames(c, db)
	})

	apiV1.GET("/user/medicine-details/:medicine_id", func(c *gin.Context) {
		userflow.GetMedicineDetailsByID(c, db)
	})

	apiV1.GET("/user/get-current-userinfo", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		userflow.GetCurrentUserInfo(c, db)
	})

	apiV1.POST("/user/add-to-cart-otc", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		userflow.AddToCartOTC(c, db)
	})

	apiV1.POST("/user/add-to-cart-medicine", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		userflow.AddToCartMedicine(c, db)
	})

	apiV1.GET("/user/get-cart", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		userflow.GetUserCart(c, db)
	})

	apiV1.DELETE("/user/remove-item-cart/:id", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		userflow.RemoveItemFromCart(c, db)
	})

	apiV1.GET("/user/get-categories-for-user", func(c *gin.Context) {
		userflow.GetAllCategoriesForUser(c, db)
	})

	apiV1.GET("/user/get-two-categories-for-user", func(c *gin.Context) {
		userflow.GetTwoCategoriesWithItems(c, db)
	})

	apiV1.GET("/user/get-items-by-categories/:category_id", func(c *gin.Context) {
		userflow.GetItemsByCategory(c, db)
	})

	apiV1.GET("/user/get-carousel-img-user", func(c *gin.Context) {
		userflow.GetAllActiveCarouselImages(c, db)
	})

	apiV1.GET("/user/get-gallery-img-user", func(c *gin.Context) {
		userflow.GetAllActiveGalleryImages(c, db)
	})

	apiV1.GET("/user/get-branded-medicine", func(c *gin.Context) {
		userflow.GetBrandedMedicinesForUser(c, db)
	})

	apiV1.GET("/user/get-feature-products", func(c *gin.Context) {
		userflow.GetFeaturedProductForUser(c, db)
	})

	apiV1.GET("/user/search-medicine", func(c *gin.Context) {
		userflow.SearchMedicinesForUser(c, db)
	})

	apiV1.GET("/user/trending-medicines", func(c *gin.Context) {
		userflow.GetTrendingMedicines(c, db)
	})
	apiV1.GET("/user/popular-medicines", func(c *gin.Context) {
		userflow.GetPopularMedicines(c, db)
	})

	// apiV1.GET("/user/sorting", func(c *gin.Context) {
	// 	userflow.GetItemsByCategoryWithSortAndFilter(c, db)
	// })

	apiV1.GET("/user/filter", func(c *gin.Context) {
		userflow.GetFilteredAndSortedMedicines(c, db)
	})
	//checkout flow

	apiV1.PUT("/user/save-for-later/:id", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		checkoutflow.ToggleSaveForLater(c, db)
	})

	apiV1.POST("/user/check-out", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		checkoutflow.InitiateCheckout(c, db)
	})

	apiV1.POST("/user/add-update-address", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		checkoutflow.AddOrUpdateAddress(c, db)
	})

	apiV1.GET("/user/get-address", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		checkoutflow.GetUserAddresses(c, db)
	})

	apiV1.POST("/user/select-address", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		checkoutflow.SelectAddressForCheckout(c, db)
	})

	apiV1.POST("/user/select-delivery-type", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		checkoutflow.SelectDeliveryType(c, db)
	})

	apiV1.POST("/user/submit-payment", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		checkoutflow.SubmitPayment(c, db)
	})

	apiV1.GET("/user/get-payment-slip", middleware.JWTMiddlewareUser(db), func(c *gin.Context) {
		checkoutflow.PreviewPaymentScreenshot(c, db)
	})
	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
