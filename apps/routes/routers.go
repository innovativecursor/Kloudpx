package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/innovativecursor/Kloudpx/apps/pkg/handlers"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB) {
	// Initialize all handlers
	userHandler := handlers.NewUserHandler(db)
	adminHandler := handlers.NewAdminHandler(db)
	pharmacistHandler := handlers.NewPharmacistHandler(db)
	supplierHandler := handlers.NewSupplierHandler(db)
	medicineHandler := handlers.NewMedicineHandler(db)
	cartHandler := handlers.NewCartHandler(db)
	orderHandler := handlers.NewOrderHandler(db)

	api := router.Group("/api")

	// User routes
	userRoutes := api.Group("/users")
	{
		userRoutes.POST("/register", userHandler.Register)
		userRoutes.POST("/login", userHandler.Login)
		userRoutes.POST("/refresh", userHandler.RefreshToken)
		userRoutes.GET("/profile", userHandler.GetProfile)
		userRoutes.PUT("/profile", userHandler.UpdateProfile)
	}

	// Admin routes
	adminRoutes := api.Group("/admin")
	{
		adminRoutes.GET("/profile", adminHandler.GetProfile)
		adminRoutes.PUT("/profile", adminHandler.UpdateProfile)
		adminRoutes.GET("/suppliers", adminHandler.GetSuppliers)
		adminRoutes.GET("/medicines", adminHandler.GetMedicines)
		adminRoutes.GET("/inventory", adminHandler.GetInventory)
	}

	// Pharmacist routes
	pharmacistRoutes := api.Group("/pharmacists")
	{
		pharmacistRoutes.POST("/", pharmacistHandler.CreatePharmacist)
		pharmacistRoutes.GET("/:id", pharmacistHandler.GetPharmacist)
		pharmacistRoutes.PUT("/:id", pharmacistHandler.UpdatePharmacist)
		pharmacistRoutes.DELETE("/:id", pharmacistHandler.DeletePharmacist)
		pharmacistRoutes.GET("/", pharmacistHandler.GetPharmacists)
	}

	// Supplier routes
	supplierRoutes := api.Group("/suppliers")
	{
		supplierRoutes.POST("/", supplierHandler.CreateSupplier)
		supplierRoutes.GET("/:id", supplierHandler.GetSupplier)
		supplierRoutes.PUT("/:id", supplierHandler.UpdateSupplier)
		supplierRoutes.DELETE("/:id", supplierHandler.DeleteSupplier)
		supplierRoutes.GET("/", supplierHandler.GetSuppliers)
	}

	// Medicine routes
	medicineRoutes := api.Group("/medicines")
	{
		medicineRoutes.POST("/", medicineHandler.CreateMedicine)
		medicineRoutes.GET("/:id", medicineHandler.GetMedicine)
		medicineRoutes.PUT("/:id", medicineHandler.UpdateMedicine)
		medicineRoutes.DELETE("/:id", medicineHandler.DeleteMedicine)
		medicineRoutes.GET("/", medicineHandler.GetMedicines)
		medicineRoutes.PUT("/:id/inventory", medicineHandler.UpdateInventory)
		medicineRoutes.GET("/search", medicineHandler.SearchMedicines)
	}

	// Cart routes
	cartRoutes := api.Group("/carts")
	{
		cartRoutes.POST("/", cartHandler.CreateCart)
		cartRoutes.POST("/:id/items", cartHandler.AddItem)
		cartRoutes.PUT("/items/:itemId", cartHandler.UpdateItem)
		cartRoutes.DELETE("/items/:itemId", cartHandler.RemoveItem)
		cartRoutes.GET("/:id", cartHandler.GetCart)
		cartRoutes.POST("/:id/checkout", cartHandler.CheckoutCart)
	}

	// Order routes
	orderRoutes := api.Group("/orders")
	{
		orderRoutes.POST("/", orderHandler.CreateOrder)
		orderRoutes.GET("/:id", orderHandler.GetOrder)
		orderRoutes.PUT("/:id/status", orderHandler.UpdateOrderStatus)
		orderRoutes.GET("/user/:userId", orderHandler.GetUserOrders)
		orderRoutes.POST("/direct", orderHandler.CreateDirectOrder)
	}
}