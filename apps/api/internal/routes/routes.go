package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/handlers"
)

func SetupRoutes(
	r *gin.Engine,
	genericHandler *handlers.GenericMedicineHandler,
	supplierHandler *handlers.SupplierHandler,
	taxHandler *handlers.TaxHandler,
) {
	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
	

	// Authentication routes
	authGroup := r.Group("/auth")
	{
		authGroup.GET("/oauth/login", auth.OAuthLoginHandler)
		authGroup.GET("/oauth/callback", auth.OAuthCallbackHandler)
		authGroup.POST("/admin/oauth", handlers.AdminOAuthLogin)
		authGroup.POST("/pharmacist/oauth", handlers.PharmacistOAuthLogin)
		authGroup.POST("/refresh", handlers.RefreshToken)
		authGroup.POST("/logout", handlers.Logout)
	}

	// User routes
	user := r.Group("/user")
	user.Use(auth.AuthMiddleware("user"))
	{
		user.POST("/cart", handlers.CreateCart)
		user.POST("/cart/:cartID/item", handlers.AddToCart)
		user.POST("/cart/:cartID/item/:itemID/prescription", handlers.UploadPrescription)
		user.POST("/cart/:cartID/checkout", handlers.CheckoutCart)
		user.GET("/cart/:cartID", handlers.GetCart)
		user.POST("/cart/:cartID/confirm", handlers.ConfirmCart)
		user.GET("/orders", handlers.GetUserOrders)
		user.GET("/orders/:orderID", handlers.GetOrderDetails)
		user.GET("/orders/:orderID/invoice", handlers.GenerateInvoice)
		user.GET("/medicines", handlers.SearchMedicines)
		user.GET("/medicines/:id", handlers.GetMedicineDetails)
		user.PUT("/profile", handlers.UpdateProfile)
	}

	// Pharmacist routes
	pharmacist := r.Group("/pharmacist")
	pharmacist.Use(auth.AuthMiddleware("pharmacist"))
	{
		pharmacist.GET("/carts/pending", handlers.GetPendingCarts)
		pharmacist.GET("/carts/:cartID", handlers.GetCartDetails)
		pharmacist.POST("/carts/:cartID/review", handlers.ReviewCart)
	}

	// Admin routes
	admin := r.Group("/admin")
	admin.Use(auth.AuthMiddleware("admin"))
	{
		// Generic Medicines
		admin.POST("/generics", genericHandler.CreateGenericMedicine)
		admin.GET("/generics", genericHandler.ListGenericMedicines)
		admin.GET("/generics/:id", genericHandler.GetGenericMedicine)
		admin.PUT("/generics/:id", genericHandler.UpdateGenericMedicine)
		admin.DELETE("/generics/:id", genericHandler.DeleteGenericMedicine)

		// Suppliers
		admin.POST("/suppliers", supplierHandler.CreateSupplier)
		admin.GET("/suppliers", supplierHandler.ListSuppliers)
		admin.GET("/suppliers/:id", supplierHandler.GetSupplier)
		admin.PUT("/suppliers/:id", supplierHandler.UpdateSupplier)
		admin.DELETE("/suppliers/:id", supplierHandler.DeleteSupplier)

		// Tax
		admin.GET("/tax", taxHandler.GetTax)
		admin.PUT("/tax", taxHandler.UpdateTax)

		// Medicines
		admin.POST("/medicines", handlers.AddMedicine)
		admin.GET("/medicines", handlers.ListMedicines)
		admin.PUT("/medicines/:id", handlers.UpdateMedicine)
		admin.DELETE("/medicines/:id", handlers.DeleteMedicine)
		admin.GET("/medicines/low-stock", handlers.GetLowStockMedicines)

		// User Management
		admin.GET("/users", handlers.ListUsers)
		admin.GET("/admins", handlers.ListAdmins)
		admin.GET("/pharmacists", handlers.ListPharmacists)
		admin.GET("/users/:id", handlers.GetUserDetails)
		admin.GET("/statistics/orders", handlers.GetOrderStatistics)
	}
}