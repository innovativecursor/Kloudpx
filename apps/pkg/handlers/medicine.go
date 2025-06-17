package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"gorm.io/gorm"
)

type MedicineHandler struct {
	DB *gorm.DB
}

func (h *MedicineHandler) SearchMedicines(c *gin.Context) {
	// Implementation for medicine search
}

func (h *MedicineHandler) GetMedicineDetails(c *gin.Context) {
	// Implementation for medicine details
}