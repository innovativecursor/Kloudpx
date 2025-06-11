package routes

import (
	"kloudpx-api/internal/controllers"
	"kloudpx-api/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine,
	authController *controllers.AuthController,
	userController *controllers.UserController,
	medicineController *controllers.MedicineController,
	supplierController *controllers.SupplierController,
	orderController *controllers.OrderController) {

	// Public routes (no authentication required)
	public := router.Group("/api")
	{
		public.POST("/login", authController.Login)
		public.POST("/register", authController.Register)
	}

	// Protected routes (require authentication)
	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// User routes
		protected.GET("/users", userController.GetAllUsers)
		protected.GET("/users/:id", userController.GetUserByID)
		protected.PUT("/users/:id", userController.UpdateUser)
		protected.DELETE("/users/:id", userController.DeleteUser)

		// Medicine routes
		protected.GET("/medicines", medicineController.GetAllMedicines)
		protected.GET("/medicines/:id", medicineController.GetMedicineByID)
		protected.POST("/medicines", medicineController.CreateMedicine)
		protected.PUT("/medicines/:id", medicineController.UpdateMedicine)
		protected.DELETE("/medicines/:id", medicineController.DeleteMedicine)

		// Supplier routes
		protected.GET("/suppliers", supplierController.GetAllSuppliers)
		protected.GET("/suppliers/:id", supplierController.GetSupplierByID)
		protected.POST("/suppliers", supplierController.CreateSupplier)
		protected.PUT("/suppliers/:id", supplierController.UpdateSupplier)
		protected.DELETE("/suppliers/:id", supplierController.DeleteSupplier)

		// Order routes
		protected.GET("/orders", orderController.GetAllOrders)
		protected.GET("/orders/:id", orderController.GetOrderByID)
		protected.POST("/orders", orderController.CreateOrder)
		protected.PUT("/orders/:id", orderController.UpdateOrder)
		protected.DELETE("/orders/:id", orderController.DeleteOrder)
		protected.GET("/orders/user/:userId", orderController.GetOrdersByUserID)
		protected.GET("/orders/supplier/:supplierId", orderController.GetOrdersBySupplierID)
	}

	// Health check route
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "OK",
		})
	})
}

/*package routes

import (
	"kloudpx-api/internal/config"
	"kloudpx-api/internal/controllers"
	"kloudpx-api/internal/middleware"
	"kloudpx-api/internal/repositories"
	"kloudpx-api/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, cfg *config.Config) *gin.Engine {
	router := gin.Default()

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	medicineRepo := repositories.NewMedicineRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, cfg)
	medicineService := services.NewMedicineService(medicineRepo)

	// Initialize controllers
	authController := controllers.NewAuthController(authService)
	medicineController := controllers.NewMedicineController(medicineService)

	// Public routes
	public := router.Group("/auth")
	{
		public.GET("/login", authController.Login)
		public.GET("/callback", authController.Callback)
	}

	// Authenticated routes
	api := router.Group("/api")
	api.Use(middleware.AuthMiddleware(authService))
	{
		api.GET("/profile", authController.Profile)

		// Medicine routes
		api.GET("/medicines/:id", medicineController.GetMedicine)
		api.GET("/medicines/:id/alternatives", medicineController.GetAlternatives)

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(middleware.AdminMiddleware(authService))
		{
			admin.POST("/medicines", medicineController.AddMedicine)
		}
	}

	return router
}*/
