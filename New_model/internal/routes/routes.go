package routes

import (
	"kloudpx-api/internal/controllers"
	"kloudpx-api/internal/middleware"
	"kloudpx-api/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

func SetupRouter(db *sqlx.DB, cfg *config.Config) *gin.Engine {
	router := gin.Default()

	// Initialize services
	authService := services.NewAuthService(db, cfg)
	userService := services.NewUserService(db)
	medicineService := services.NewMedicineService(db)
	orderService := services.NewOrderService(db)
	supplierService := services.NewSupplierService(db)

	// Initialize controllers
	authCtrl := controllers.NewAuthController(authService)
	userCtrl := controllers.NewUserController(userService)
	medicineCtrl := controllers.NewMedicineController(medicineService)
	orderCtrl := controllers.NewOrderController(orderService)
	supplierCtrl := controllers.NewSupplierController(supplierService)

	// Public routes
	public := router.Group("/api")
	{
		public.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		// Auth routes
		public.POST("/auth/login", authCtrl.Login)
		public.POST("/auth/register", authCtrl.Register)
		public.GET("/auth/oauth/login", authCtrl.OAuthLogin)
		public.GET("/auth/oauth/callback", authCtrl.OAuthCallback)
		public.POST("/auth/refresh", authCtrl.RefreshToken)

		// Public medicine routes
		public.GET("/medicines", medicineCtrl.ListMedicines)
		public.GET("/medicines/:id", medicineCtrl.GetMedicine)
	}

	// Authenticated routes
	auth := router.Group("/api")
	auth.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		// User routes
		user := auth.Group("/user")
		{
			user.GET("/profile", userCtrl.GetProfile)
			user.PUT("/profile", userCtrl.UpdateProfile)

			// Cart routes
			user.POST("/cart", orderCtrl.CreateCart)
			user.POST("/cart/:id/items", orderCtrl.AddToCart)
			user.POST("/cart/:id/checkout", orderCtrl.Checkout)
		}

		// Admin routes
		admin := auth.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		{
			// Medicine management
			admin.POST("/medicines", medicineCtrl.CreateMedicine)
			admin.PUT("/medicines/:id", medicineCtrl.UpdateMedicine)
			admin.DELETE("/medicines/:id", medicineCtrl.DeleteMedicine)

			// Supplier management
			admin.POST("/suppliers", supplierCtrl.CreateSupplier)
			admin.GET("/suppliers", supplierCtrl.ListSuppliers)
			admin.PUT("/suppliers/:id", supplierCtrl.UpdateSupplier)
			admin.DELETE("/suppliers/:id", supplierCtrl.DeleteSupplier)
		}

		// Pharmacist routes
		pharmacist := auth.Group("/pharmacist")
		pharmacist.Use(middleware.PharmacistMiddleware())
		{
			pharmacist.GET("/orders", orderCtrl.ListOrders)
			pharmacist.PUT("/orders/:id/approve", orderCtrl.ApproveOrder)
			pharmacist.PUT("/orders/:id/reject", orderCtrl.RejectOrder)
		}
	}

	return router
}