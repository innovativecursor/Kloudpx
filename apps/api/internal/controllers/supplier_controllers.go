package controllers

import (
	"net/http"
	"strconv"

	"kloudpx-api/internal/models"
	"kloudpx-api/internal/services"
	"kloudpx-api/internal/utils"

	"github.com/gin-gonic/gin"
)

type SupplierController struct {
	supplierService services.SupplierService
}

func NewSupplierController(supplierService services.SupplierService) *SupplierController {
	return &SupplierController{supplierService: supplierService}
}

// @Summary Add new supplier
// @Description Add a new supplier (Admin only)
// @Tags suppliers
// @Accept json
// @Produce json
// @Param supplier body models.Supplier true "Supplier details"
// @Security BearerAuth
// @Success 201 {object} models.Supplier
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /suppliers [post]
func (sc *SupplierController) AddSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := sc.supplierService.Create(&supplier); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusCreated, supplier)
}

// @Summary Get supplier details
// @Description Get details of a specific supplier
// @Tags suppliers
// @Produce json
// @Param id path int true "Supplier ID"
// @Security BearerAuth
// @Success 200 {object} models.Supplier
// @Failure 400 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Router /suppliers/{id} [get]
func (sc *SupplierController) GetSupplier(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid supplier ID")
		return
	}

	supplier, err := sc.supplierService.GetByID(uint(id))
	if err != nil {
		utils.RespondWithError(c, http.StatusNotFound, "Supplier not found")
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, supplier)
}

// @Summary Get all suppliers
// @Description Get a list of all suppliers
// @Tags suppliers
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Supplier
// @Failure 500 {object} utils.ErrorResponse
// @Router /suppliers [get]
func (sc *SupplierController) GetAllSuppliers(c *gin.Context) {
	suppliers, err := sc.supplierService.GetAll()
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, suppliers)
}

// @Summary Update supplier
// @Description Update details of a supplier (Admin only)
// @Tags suppliers
// @Accept json
// @Produce json
// @Param id path int true "Supplier ID"
// @Param supplier body models.Supplier true "Updated supplier details"
// @Security BearerAuth
// @Success 200 {object} models.Supplier
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /suppliers/{id} [put]
func (sc *SupplierController) UpdateSupplier(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid supplier ID")
		return
	}

	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}
	supplier.ID = uint(id)

	if err := sc.supplierService.Update(&supplier); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, supplier)
}

// @Summary Delete supplier
// @Description Delete a supplier (Admin only)
// @Tags suppliers
// @Produce json
// @Param id path int true "Supplier ID"
// @Security BearerAuth
// @Success 200 {object} map[string]string
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /suppliers/{id} [delete]
func (sc *SupplierController) DeleteSupplier(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid supplier ID")
		return
	}

	if err := sc.supplierService.Delete(uint(id)); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, gin.H{"message": "Supplier deleted successfully"})
}