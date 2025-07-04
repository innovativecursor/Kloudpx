package cms

import (
	"encoding/base64"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/cms/config"
	cfg "github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/getfileextension"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func CarouselImageUpload(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user", user).Warn("Unauthorized or invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can add medicine"})
		return
	}

	var uploadReq config.CarouselImageData
	if err := c.ShouldBindJSON(&uploadReq); err != nil {
		logrus.WithError(err).Error("Failed to bind request body")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	decodedImage, err := base64.StdEncoding.DecodeString(uploadReq.CarouselImage)
	if err != nil {
		logrus.WithError(err).Error("Base64 image decoding failed")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid base64 image"})
		return
	}

	// Prepare S3 upload
	cfg, err := cfg.Env()
	if err != nil {
		logrus.WithError(err).Error("Failed to load env config")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Configuration error"})
		return
	}

	profileType := "carousel"
	userType := "admin"
	uniqueUUID := s3helper.GenerateUniqueID()
	uuidString := uniqueUUID.String()
	userIDString := fmt.Sprintf("%d", userObj.ID)
	imageName := "carousel"

	// Upload to S3
	if err := s3helper.UploadToS3(
		c.Request.Context(),
		profileType,
		userType,
		cfg.S3.BucketName,
		uuidString,
		userIDString,
		imageName,
		decodedImage,
	); err != nil {
		logrus.WithError(err).Error("Failed to upload prescription image to S3")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload prescription"})
		return
	}

	extension, err := getfileextension.GetFileExtension(decodedImage)
	if err != nil {
		logrus.WithError(err).Error("Failed to extract image extension")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image format"})
		return
	}

	// Construct image URL
	imageURL := "https://" + cfg.S3.BucketName + ".s3." + cfg.S3.Region + ".amazonaws.com/" +
		profileType + "/" + userType + "/" + uuidString + "/" + userIDString + "/" + imageName + "." + extension

	carousel := models.CarouselImage{
		IsActive: false,
		ImageURL: imageURL,
	}

	if err := db.Create(&carousel).Error; err != nil {
		logrus.WithError(err).Error("Failed to save carousel image to database")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Carousel image uploaded successfully",
		"image_url":   imageURL,
		"carousel_id": carousel.ID,
	})
}

func GetAllCarouselImagesForAdmin(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user", user).Warn("Unauthorized or invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can add medicine"})
		return
	}

	var images []models.CarouselImage

	if err := db.Order("created_at desc").Find(&images).Error; err != nil {
		logrus.WithError(err).Error("Failed to fetch carousel images from DB")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch images"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Carousel images fetched successfully",
		"data":    images,
	})
}

func ToggleCarouselImageStatus(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user", user).Warn("Unauthorized or invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can toggle carousel status"})
		return
	}

	id := c.Param("id")
	var image models.CarouselImage

	if err := db.First(&image, id).Error; err != nil {
		logrus.WithError(err).WithField("carousel_id", id).Error("Carousel image not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Carousel image not found"})
		return
	}

	image.IsActive = !image.IsActive

	if err := db.Save(&image).Error; err != nil {
		logrus.WithError(err).WithField("carousel_id", id).Error("Failed to update carousel status")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update carousel status"})
		return
	}

	status := "deactivated"
	if image.IsActive {
		status = "activated"
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     fmt.Sprintf("Carousel image %s successfully", status),
		"carousel_id": image.ID,
		"image_url":   image.ImageURL,
		"isactive":    image.IsActive,
	})
}

func DeleteCarouselImage(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userObj, ok := user.(*models.Admin)
	if !ok || userObj.ApplicationRole != "admin" {
		logrus.WithField("user", user).Warn("Unauthorized or invalid user object")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete carousel images"})
		return
	}

	id := c.Param("id")
	var image models.CarouselImage

	if err := db.First(&image, id).Error; err != nil {
		logrus.WithError(err).WithField("carousel_id", id).Error("Carousel image not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Carousel image not found"})
		return
	}

	// Prevent deletion if the image is active
	if image.IsActive {
		logrus.WithField("carousel_id", id).Warn("Attempt to delete active carousel image")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please deactivate the image before deletion"})
		return
	}

	if err := db.Unscoped().Delete(&image).Error; err != nil {
		logrus.WithError(err).WithField("carousel_id", id).Error("Failed to delete carousel image")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete carousel image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Carousel image deleted successfully",
		"carousel_id": image.ID,
		"image_url":   image.ImageURL,
	})
}
