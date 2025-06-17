package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/auth"
	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
	"gorm.io/gorm"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB) {
	// Initialize handlers
	authHandler := &handlers.AuthHandler{DB: db}
	adminHandler := &handlers.AdminHandler{DB: db}
	userHandler := &handlers.UserHandler{DB: db}
	medicineHandler := &handlers.MedicineHandler{DB: db}
	cartHandler := &handlers.CartHandler{DB: db}
	orderHandler := &handlers.OrderHandler{DB: db}
	pharmacistHandler := &handlers.PharmacistHandler{DB: db}

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Auth routes
	authGroup := router.Group("/auth")
	{
		// Admin OAuth
		authGroup.GET("/admin/oauth/:provider", auth.AuthHandler)
		authGroup.GET("/admin/oauth/:provider/callback", func(c *gin.Context) {
			auth.AuthCallbackHandler(c, db)
		})
		authGroup.POST("/admin/logout", auth.LogoutHandler)

		// User and pharmacist login
		authGroup.POST("/user/login", authHandler.UserLogin)
		authGroup.POST("/pharmacist/login", authHandler.PharmacistLogin)

		// Token operations
		authGroup.POST("/refresh", authHandler.RefreshToken)
		authGroup.POST("/logout", authHandler.Logout)
	}

	// User routes (JWT protected)
	user := router.Group("/user")
	user.Use(auth.AuthMiddleware("user"))
	{
		user.POST("/cart", cartHandler.CreateCart)
		user.POST("/cart/:cartID/item", cartHandler.AddToCart)
		user.POST("/cart/:cartID/item/:itemID/prescription", cartHandler.UploadPrescription)
		user.POST("/cart/:cartID/checkout", cartHandler.CheckoutCart)
		user.GET("/cart/:cartID", cartHandler.GetCart)
		user.POST("/cart/:cartID/confirm", cartHandler.ConfirmCart)

		user.GET("/orders", orderHandler.GetUserOrders)
		user.GET("/orders/:orderID", orderHandler.GetOrderDetails)
		user.GET("/orders/:orderID/invoice", orderHandler.GenerateInvoice)

		user.GET("/medicines", medicineHandler.SearchMedicines)
		user.GET("/medicines/:id", medicineHandler.GetMedicineDetails)

		user.PUT("/profile", userHandler.UpdateProfile)
	}

	// Pharmacist routes (JWT protected)
	pharmacist := router.Group("/pharmacist")
	pharmacist.Use(auth.AuthMiddleware("pharmacist"))
	{
		pharmacist.GET("/carts/pending", pharmacistHandler.GetPendingCarts)
		pharmacist.GET("/carts/:cartID", pharmacistHandler.GetCartDetails)
		pharmacist.POST("/carts/:cartID/review", pharmacistHandler.ReviewCart)
	}

	// Admin routes (JWT protected)
	admin := router.Group("/admin")
	admin.Use(auth.AuthMiddleware("admin"))
	{
		// Generic medicines
		admin.POST("/generics", adminHandler.CreateGenericMedicine)
		admin.GET("/generics", adminHandler.ListGenericMedicines)
		admin.GET("/generics/:id", adminHandler.GetGenericMedicine)
		admin.PUT("/generics/:id", adminHandler.UpdateGenericMedicine)
		admin.DELETE("/generics/:id", adminHandler.DeleteGenericMedicine)

		// Suppliers
		admin.POST("/suppliers", adminHandler.CreateSupplier)
		admin.GET("/suppliers", adminHandler.ListSuppliers)
		admin.GET("/suppliers/:id", adminHandler.GetSupplier)
		admin.PUT("/suppliers/:id", adminHandler.UpdateSupplier)
		admin.DELETE("/suppliers/:id", adminHandler.DeleteSupplier)

		// Tax
		admin.GET("/tax", adminHandler.GetTax)
		admin.PUT("/tax", adminHandler.UpdateTax)

		// Medicines
		admin.POST("/medicines", adminHandler.AddMedicine)
		admin.GET("/medicines", adminHandler.ListMedicines)
		admin.PUT("/medicines/:id", adminHandler.UpdateMedicine)
		admin.DELETE("/medicines/:id", adminHandler.DeleteMedicine)
		admin.GET("/medicines/low-stock", adminHandler.GetLowStockMedicines)

		// User management
		admin.GET("/users", adminHandler.ListUsers)
		admin.GET("/admins", adminHandler.ListAdmins)
		admin.GET("/pharmacists", adminHandler.ListPharmacists)
		admin.GET("/users/:id", adminHandler.GetUserDetails)
		
		// Statistics
		admin.GET("/statistics/orders", adminHandler.GetOrderStatistics)
	}
}