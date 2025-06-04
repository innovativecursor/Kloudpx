package routes

import (
	"github.com/hashmi846003/online-med.git/internal/auth"
	"github.com/hashmi846003/online-med.git/internal/handlers"
	//"github.com/hashmi846003/online-med.git/internal/models"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Authentication routes
//	r.POST("/user/register", handlers.UserRegister)
//	r.POST("/user/login", handlers.UserLogin)
	r.POST("/admin/register", handlers.AdminRegister)
	r.POST("/admin/login", handlers.AdminLogin)
	r.POST("/pharmacist/register", handlers.PharmacistRegister)
	r.POST("/pharmacist/login", handlers.PharmacistLogin)
	
	// OAuth routes
	r.GET("/oauth/login", auth.OAuthLoginHandler)
	r.GET("/oauth/callback", auth.OAuthCallbackHandler)
	r.POST("/oauth/login", handlers.OAuthLogin)

	// Token management
	r.POST("/refresh", handlers.RefreshToken)
	r.POST("/logout", handlers.Logout)
}

	// User routes
/*
	user := r.Group("/user")
	user.Use(auth.AuthMiddleware("user"))
	
{
		user.POST("/buy-now", handlers.BuyNow)
		user.GET("/direct-orders/:orderID", handlers.GetDirectOrder)
		user.GET("/direct-orders/:orderID/invoice", handlers.GenerateDirectOrderInvoice)
		user.POST("/cart", handlers.CreateCart)
		user.POST("/cart/:cartID/item", handlers.AddToCart)
		user.POST("/cart/:cartID/item/:itemID/prescription", handlers.UploadPrescription)
		user.POST("/cart/:cartID/checkout", handlers.CheckoutCart)
		user.GET("/cart/:cartID", handlers.GetCart)
		user.POST("/cart/:cartID/confirm", handlers.ConfirmCart)
		user.GET("/orders", handlers.GetUserOrders)
		user.GET("/orders/:orderID", handlers.GetOrderDetails)
		user.GET("/orders/:orderID/invoice", handlers.GenerateInvoice) // New invoice endpoint
		user.GET("/medicines", handlers.SearchMedicines)
		user.GET("/medicines/:id", handlers.GetMedicineDetails)
		user.PUT("/profile", handlers.UpdateProfile)
}

	// Pharmacist routes
	pharmacist := r.Group("/pharmacist")
	pharmacist.Use(auth.AuthMiddleware("pharmacist"))
	{
		pharmacist.GET("/carts", handlers.GetPendingCarts)
		pharmacist.GET("/cart/:cartID", handlers.GetCartDetails)
		pharmacist.POST("/cart/:cartID/review", handlers.ReviewCart)
	}

	// Admin routes
	admin := r.Group("/admin")
	admin.Use(auth.AuthMiddleware("admin"))
	{
		admin.POST("/medicine", handlers.AddMedicine)
		admin.GET("/medicines", handlers.ListMedicines)
		admin.PUT("/medicine/:id", handlers.UpdateMedicine)
		admin.DELETE("/medicine/:id", handlers.DeleteMedicine)
		admin.GET("/users", handlers.ListUsers)
		admin.GET("/admins", handlers.ListAdmins)
		admin.GET("/pharmacists", handlers.ListPharmacists)
		admin.POST("/reset-password", handlers.ResetPassword)
		admin.GET("/user/:id", handlers.GetUserDetails)
		admin.GET("/medicine/:id", handlers.GetMedicineDetails)
		admin.GET("/statistics", handlers.GetOrderStatistics)
		admin.GET("/low-stock", handlers.GetLowStockMedicines)
	}

	// Public routes (no auth required)
	public := r.Group("/public")
	{
		public.GET("/medicines", handlers.ListMedicinesPublic)
		public.GET("/medicine/:id", handlers.GetMedicineDetailsPublic)
	}
*/ 
	