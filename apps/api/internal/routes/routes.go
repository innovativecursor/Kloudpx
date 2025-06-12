package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/internal/auth"
	"github.com/innovativecursor/Kloudpx/internal/handlers"
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
		authGroup.POST("/admin/oauth", auth.OAuthMiddleware(), handlers.AdminOAuthLogin)
		authGroup.POST("/pharmacist/oauth", auth.OAuthMiddleware(), handlers.PharmacistOAuthLogin)
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
		admin.POST("/generics", genericHandler.CreateGenericMedicine)
		admin.GET("/generics", genericHandler.ListGenericMedicines)
		admin.GET("/generics/:id", genericHandler.GetGenericMedicine)
		admin.PUT("/generics/:id", genericHandler.UpdateGenericMedicine)
		admin.DELETE("/generics/:id", genericHandler.DeleteGenericMedicine)

		admin.POST("/suppliers", supplierHandler.CreateSupplier)
		admin.GET("/suppliers", supplierHandler.ListSuppliers)
		admin.GET("/suppliers/:id", supplierHandler.GetSupplier)
		admin.PUT("/suppliers/:id", supplierHandler.UpdateSupplier)
		admin.DELETE("/suppliers/:id", supplierHandler.DeleteSupplier)

		admin.GET("/tax", taxHandler.GetTax)
		admin.PUT("/tax", taxHandler.UpdateTax)

		admin.POST("/medicines", handlers.AddMedicine)
		admin.GET("/medicines", handlers.ListMedicines)
		admin.PUT("/medicines/:id", handlers.UpdateMedicine)
		admin.DELETE("/medicines/:id", handlers.DeleteMedicine)
		admin.GET("/medicines/low-stock", handlers.GetLowStockMedicines)

		admin.GET("/users", handlers.ListUsers)
		admin.GET("/admins", handlers.ListAdmins)
		admin.GET("/pharmacists", handlers.ListPharmacists)
		admin.GET("/users/:id", handlers.GetUserDetails)
		admin.GET("/statistics/orders", handlers.GetOrderStatistics)
	}
}
