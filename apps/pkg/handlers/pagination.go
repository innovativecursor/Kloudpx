package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetPaginationParams(c *gin.Context) (int, int) {
	page := 1
	if p := c.Query("page"); p != "" {
		if pInt, err := strconv.Atoi(p); err == nil && pInt > 0 {
			page = pInt
		}
	}

	pageSize := 20
	if ps := c.Query("page_size"); ps != "" {
		if psInt, err := strconv.Atoi(ps); err == nil && psInt > 0 {
			if psInt > 100 {
				psInt = 100
			}
			pageSize = psInt
		}
	}

	return page, pageSize
}