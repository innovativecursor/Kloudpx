package controllers

import (
	"net/http"
	"strconv"

	"kloudpx-api/internal/models"
	"kloudpx-api/internal/services"
	"kloudpx-api/internal/utils"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService services.UserService
}

func NewUserController(userService services.UserService) *UserController {
	return &UserController{userService: userService}
}

// @Summary Get user details
// @Description Get details of a specific user (Admin only)
// @Tags users
// @Produce json
// @Param id path int true "User ID"
// @Security BearerAuth
// @Success 200 {object} models.User
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Router /users/{id} [get]
func (uc *UserController) GetUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	user, err := uc.userService.GetByID(uint(id))
	if err != nil {
		utils.RespondWithError(c, http.StatusNotFound, "User not found")
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, user)
}

// @Summary Get all users
// @Description Get a list of all users (Admin only)
// @Tags users
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.User
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /users [get]
func (uc *UserController) GetAllUsers(c *gin.Context) {
	users, err := uc.userService.GetAll()
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, users)
}

// @Summary Update user role
// @Description Update user role (Admin only)
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param role body string true "New role"
// @Security BearerAuth
// @Success 200 {object} models.User
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /users/{id}/role [put]
func (uc *UserController) UpdateRole(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var request struct {
		Role models.Role `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	user, err := uc.userService.UpdateRole(uint(id), request.Role)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, user)
}

// @Summary Delete user
// @Description Delete a user (Admin only)
// @Tags users
// @Produce json
// @Param id path int true "User ID"
// @Security BearerAuth
// @Success 200 {object} map[string]string
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /users/{id} [delete]
func (uc *UserController) DeleteUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	if err := uc.userService.Delete(uint(id)); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, gin.H{"message": "User deleted successfully"})
}