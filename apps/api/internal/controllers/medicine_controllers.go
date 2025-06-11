package controllers

import (
	"net/http"
	"strconv"

	"kloudpx-api/internal/models"
	"kloudpx-api/internal/services"
	"kloudpx-api/internal/utils"

	"github.com/gin-gonic/gin"
)

type MedicineController struct {
	medicineService services.MedicineService
}

func NewMedicineController(medicineService services.MedicineService) *MedicineController {
	return &MedicineController{medicineService: medicineService}
}

// @Summary Add new medicine
// @Description Add a new medicine to the inventory (Admin only)
// @Tags medicines
// @Accept json
// @Produce json
// @Param medicine body models.Medicine true "Medicine details"
// @Security BearerAuth
// @Success 201 {object} models.Medicine
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /medicines [post]
func (mc *MedicineController) AddMedicine(c *gin.Context) {
	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := mc.medicineService.Create(&medicine); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusCreated, medicine)
}

// @Summary Get medicine details
// @Description Get details of a specific medicine
// @Tags medicines
// @Produce json
// @Param id path int true "Medicine ID"
// @Security BearerAuth
// @Success 200 {object} models.Medicine
// @Failure 400 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Router /medicines/{id} [get]
func (mc *MedicineController) GetMedicine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid medicine ID")
		return
	}

	medicine, err := mc.medicineService.GetByID(uint(id))
	if err != nil {
		utils.RespondWithError(c, http.StatusNotFound, "Medicine not found")
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, medicine)
}

// @Summary Get all medicines
// @Description Get a list of all medicines
// @Tags medicines
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Medicine
// @Failure 500 {object} utils.ErrorResponse
// @Router /medicines [get]
func (mc *MedicineController) GetAllMedicines(c *gin.Context) {
	medicines, err := mc.medicineService.GetAll()
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, medicines)
}

// @Summary Update medicine
// @Description Update details of a medicine (Admin only)
// @Tags medicines
// @Accept json
// @Produce json
// @Param id path int true "Medicine ID"
// @Param medicine body models.Medicine true "Updated medicine details"
// @Security BearerAuth
// @Success 200 {object} models.Medicine
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /medicines/{id} [put]
func (mc *MedicineController) UpdateMedicine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid medicine ID")
		return
	}

	var medicine models.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}
	medicine.ID = uint(id)

	if err := mc.medicineService.Update(&medicine); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, medicine)
}

// @Summary Delete medicine
// @Description Delete a medicine from inventory (Admin only)
// @Tags medicines
// @Produce json
// @Param id path int true "Medicine ID"
// @Security BearerAuth
// @Success 200 {object} map[string]string
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /medicines/{id} [delete]
func (mc *MedicineController) DeleteMedicine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid medicine ID")
		return
	}

	if err := mc.medicineService.Delete(uint(id)); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}

// @Summary Get alternative medicines
// @Description Get alternative medicines with same generic name
// @Tags medicines
// @Produce json
// @Param id path int true "Medicine ID"
// @Security BearerAuth
// @Success 200 {array} models.Medicine
// @Failure 400 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /medicines/{id}/alternatives [get]
func (mc *MedicineController) GetAlternatives(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid medicine ID")
		return
	}

	medicine, err := mc.medicineService.GetByID(uint(id))
	if err != nil {
		utils.RespondWithError(c, http.StatusNotFound, "Medicine not found")
		return
	}

	alternatives, err := mc.medicineService.GetByGenericName(medicine.GenericName)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Filter out the current medicine
	var result []models.Medicine
	for _, alt := range alternatives {
		if alt.ID != medicine.ID {
			result = append(result, alt)
		}
	}

	utils.RespondWithJSON(c, http.StatusOK, result)
}