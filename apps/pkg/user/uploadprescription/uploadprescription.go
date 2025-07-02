package uploadprescription

import (
	"encoding/base64"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	cfg "github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/getfileextension"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/innovativecursor/Kloudpx/apps/pkg/user/uploadprescription/config"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func UploadPrescription(c *gin.Context, db *gorm.DB) {
	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("User not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		logrus.Warn("Invalid user object from context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var uploadReq config.UploadPrescriptionImage
	if err := c.ShouldBindJSON(&uploadReq); err != nil {
		logrus.WithError(err).Error("Failed to bind request body")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	decodedImage, err := base64.StdEncoding.DecodeString(uploadReq.PrescriptionImage)
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

	profileType := "prescription"
	userType := "user"
	uniqueUUID := s3helper.GenerateUniqueID()
	uuidString := uniqueUUID.String()
	userIDString := fmt.Sprintf("%d", userObj.ID)
	imageName := userObj.FirstName

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

	// Save in database
	prescription := models.Prescription{
		UserID:        userObj.ID,
		UploadedImage: imageURL,
		Status:        "unsettled",
	}
	if err := db.Create(&prescription).Error; err != nil {
		logrus.WithError(err).Error("Failed to save prescription record in DB")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save prescription"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Prescription uploaded successfully",
		"url":     imageURL,
	})
}
