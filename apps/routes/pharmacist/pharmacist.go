package pharmacist

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/middleware"
	"github.com/innovativecursor/Kloudpx/apps/pkg/pharmacist/oauthpharma"
	"github.com/innovativecursor/Kloudpx/apps/pkg/pharmacist/pharmacistflow"
	"github.com/innovativecursor/Kloudpx/apps/routes/getapiroutes"
	"gorm.io/gorm"
)

func Pharmacist(db *gorm.DB) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10002"
		log.Printf("Defaulting to port %s", port)
	}

	apiV1, router := getapiroutes.GetApiRoutes()

	// Define handlers oauth
	apiV1.GET("/pharmacist", func(c *gin.Context) {
		c.String(http.StatusOK, "pharmacist Service Healthy")
	})

	apiV1.GET("/auth/google/callback/pharmacist", func(c *gin.Context) {
		oauthpharma.GooglePharmacistCallbackHandler(c, db)
	})

	apiV1.GET("/pharmacist/all-prescriptions", middleware.JWTMiddlewarePharmacist(db), func(c *gin.Context) {
		pharmacistflow.GetUsersWithPrescriptionSummary(c, db)
	})

	apiV1.GET("/pharmacist/prescriptions-details/:user_id", middleware.JWTMiddlewarePharmacist(db), func(c *gin.Context) {
		pharmacistflow.GetUserPrescriptionHistory(c, db)
	})

	apiV1.GET("/pharmacist/get-prescriptions-cart/:id", middleware.JWTMiddlewarePharmacist(db), func(c *gin.Context) {
		pharmacistflow.GetPrescriptionCart(c, db)
	})

	apiV1.POST("/pharmacist/submit-prescriptions/:id", middleware.JWTMiddlewarePharmacist(db), func(c *gin.Context) {
		pharmacistflow.SubmitPrescription(c, db)
	})

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
