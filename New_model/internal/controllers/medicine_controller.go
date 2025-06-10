package controllers

import (
	"net/http"
	"strconv"

	"kloudpx-api/internal/services"
	"kloudpx-api/internal/utils"

	"github.com/gin-gonic/gin"
)

type MedicineController struct {
	service services.MedicineService
}

func NewMedicineController(service services.MedicineService) *MedicineController {
	return &MedicineController{service: service}
}

func (mc *MedicineController) ListMedicines(c *gin.Context) {
	medicines, err := mc.service.ListMedicines()
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, medicines)
}

func (mc *MedicineController) GetMedicine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid medicine ID")
		return
	}

	medicine, err := mc.service.GetMedicine(id)
	if err != nil {
		utils.RespondWithError(c, http.StatusNotFound, "Medicine not found")
		return
	}

	c.JSON(http.StatusOK, medicine)
}

func (mc *MedicineController) CreateMedicine(c *gin.Context) {
	var input services.MedicineInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, err.Error())
		return
	}

	medicine, err := mc.service.CreateMedicine(input)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, medicine)
}

// Similar methods for UpdateMedicine and DeleteMedicine