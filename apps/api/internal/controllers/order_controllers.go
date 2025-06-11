package controllers

import (
	"net/http"
	"strconv"

	"kloudpx-api/internal/models"
	"kloudpx-api/internal/services"
	"kloudpx-api/internal/utils"

	"github.com/gin-gonic/gin"
)

type OrderController struct {
	orderService services.OrderService
}

func NewOrderController(orderService services.OrderService) *OrderController {
	return &OrderController{orderService: orderService}
}

// @Summary Create new order
// @Description Create a new order from prescription
// @Tags orders
// @Accept json
// @Produce json
// @Param prescription_id body int true "Prescription ID"
// @Security BearerAuth
// @Success 201 {object} models.Order
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /orders [post]
func (oc *OrderController) CreateOrder(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		utils.RespondWithError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var request struct {
		PrescriptionID uint `json:"prescription_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	order, err := oc.orderService.Create(user.(*models.User).ID, request.PrescriptionID)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusCreated, order)
}

// @Summary Get order details
// @Description Get details of a specific order
// @Tags orders
// @Produce json
// @Param id path int true "Order ID"
// @Security BearerAuth
// @Success 200 {object} models.Order
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Router /orders/{id} [get]
func (oc *OrderController) GetOrder(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		utils.RespondWithError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	order, err := oc.orderService.GetByID(uint(id))
	if err != nil {
		utils.RespondWithError(c, http.StatusNotFound, "Order not found")
		return
	}

	// Check authorization
	if user.(*models.User).Role != models.RoleAdmin && 
	   user.(*models.User).Role != models.RoleChemist && 
	   order.CustomerID != user.(*models.User).ID {
		utils.RespondWithError(c, http.StatusForbidden, "Not authorized to view this order")
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, order)
}

// @Summary Get user's orders
// @Description Get all orders for the current user
// @Tags orders
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Order
// @Failure 401 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /orders [get]
func (oc *OrderController) GetUserOrders(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		utils.RespondWithError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	orders, err := oc.orderService.GetByCustomerID(user.(*models.User).ID)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, orders)
}

// @Summary Update order status
// @Description Update the status of an order (Admin/Chemist only)
// @Tags orders
// @Accept json
// @Produce json
// @Param id path int true "Order ID"
// @Param status body string true "New status"
// @Security BearerAuth
// @Success 200 {object} models.Order
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /orders/{id}/status [put]
func (oc *OrderController) UpdateStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	var request struct {
		Status models.OrderStatus `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	order, err := oc.orderService.UpdateStatus(uint(id), request.Status)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, order)
}

// @Summary Add alternative medicine
// @Description Add alternative medicine to an order item (Chemist only)
// @Tags orders
// @Accept json
// @Produce json
// @Param id path int true "Order ID"
// @Param itemId path int true "Order Item ID"
// @Param alternative_id body int true "Alternative Medicine ID"
// @Security BearerAuth
// @Success 200 {object} models.Order
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /orders/{id}/items/{itemId}/alternative [put]
func (oc *OrderController) AddAlternative(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	itemID, err := strconv.Atoi(c.Param("itemId"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid item ID")
		return
	}

	var request struct {
		AlternativeID uint `json:"alternative_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := oc.orderService.AddAlternative(uint(orderID), uint(itemID), request.AlternativeID); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	order, err := oc.orderService.GetByID(uint(orderID))
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, order)
}

// @Summary Download invoice
// @Description Download the invoice for an order
// @Tags orders
// @Produce application/pdf
// @Param id path int true "Order ID"
// @Security BearerAuth
// @Success 200 {file} file
// @Failure 400 {object} utils.ErrorResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 403 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Router /orders/{id}/invoice [get]
func (oc *OrderController) DownloadInvoice(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		utils.RespondWithError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	order, err := oc.orderService.GetByID(uint(id))
	if err != nil {
		utils.RespondWithError(c, http.StatusNotFound, "Order not found")
		return
	}

	// Check authorization
	if user.(*models.User).Role != models.RoleAdmin && 
	   user.(*models.User).Role != models.RoleChemist && 
	   order.CustomerID != user.(*models.User).ID {
		utils.RespondWithError(c, http.StatusForbidden, "Not authorized to download this invoice")
		return
	}

	if order.InvoiceURL == "" {
		utils.RespondWithError(c, http.StatusNotFound, "Invoice not available")
		return
	}

	c.File(order.InvoiceURL)
	c.Header("Content-Type", "application/pdf")
}