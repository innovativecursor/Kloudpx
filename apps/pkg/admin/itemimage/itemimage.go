package itemimage

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/Kloudpx/apps/pkg/admin/itemimage/config"
	cfg "github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/getfileextension"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/s3helper"
	"github.com/innovativecursor/Kloudpx/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// func UploadMedicineImages(c *gin.Context, db *gorm.DB) {
// 	form, err := c.MultipartForm()
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid multipart form", "details": err.Error()})
// 		return
// 	}

// 	files := form.File["images"]
// 	if len(files) == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "No files uploaded"})
// 		return
// 	}

// 	uploadDir := "uploads/"
// 	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
// 		os.Mkdir(uploadDir, 0755)
// 	}

// 	var imageIDs []uint
// 	for _, file := range files {
// 		dst := uploadDir + file.Filename
// 		if err := c.SaveUploadedFile(file, dst); err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file", "details": err.Error()})
// 			return
// 		}

// 		image := models.ItemImage{
// 			FileName: file.Filename,
// 		}
// 		if err := db.Create(&image).Error; err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
// 			return
// 		}

// 		imageIDs = append(imageIDs, image.ID)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":   "Images uploaded successfully",
// 		"image_ids": imageIDs,
// 	})
// }

// func UploadProdutImages(c *gin.Context, db *gorm.DB) {
// 	user, exists := c.Get("user")
// 	if !exists {
// 		logrus.Warn("Unauthorized access: user not found in context")
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 		return
// 	}

// 	userObj, ok := user.(*models.Admin)
// 	if !ok {
// 		logrus.WithField("user", user).Warn("Unauthorized access: invalid user object")
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}

// 	if userObj.ApplicationRole != "admin" {
// 		logrus.WithField("user_id", userObj.ID).Warn("Unauthorized access: non-admin tried to add medicine")
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can add medicine"})
// 		return
// 	}
// 	var payload config.UploadImagesPayload
// 	if err := c.ShouldBindJSON(&payload); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
// 		return
// 	}

// 	if len(payload.Images) == 0 || len(payload.Images) > 5 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "You must upload between 1 and 5 images"})
// 		return
// 	}

// 	envCfg, err := cfg.Env()
// 	if err != nil {
// 		logrus.WithError(err).Error("Failed to load environment config")
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Configuration error"})
// 		return
// 	}

// 	var imageIDs []uint
// 	var imageURLs []string

// 	for index, base64Str := range payload.Images {
// 		decodedImage, err := base64.StdEncoding.DecodeString(base64Str)
// 		if err != nil {
// 			logrus.WithError(err).Errorf("Failed to decode image %d", index+1)
// 			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid base64 image at index %d", index)})
// 			return
// 		}

// 		extension, err := getfileextension.GetFileExtension(decodedImage)
// 		if err != nil {
// 			logrus.WithError(err).Errorf("Failed to detect extension for image %d", index+1)
// 			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Unsupported image format at index %d", index)})
// 			return
// 		}

// 		uniqueUUID := s3helper.GenerateUniqueID().String()
// 		imageName := fmt.Sprintf("image_%d", index+1)
// 		profileType := "medicine"
// 		userType := "inventory"
// 		userIDString := fmt.Sprintf("%d", userObj.ID)

// 		err = s3helper.UploadToS3(
// 			c.Request.Context(),
// 			profileType,
// 			userType,
// 			envCfg.S3.BucketName,
// 			uniqueUUID,
// 			userIDString,
// 			imageName,
// 			decodedImage,
// 		)
// 		if err != nil {
// 			logrus.WithError(err).Errorf("Failed to upload image %d to S3", index+1)
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("S3 upload failed for image %d", index+1)})
// 			return
// 		}

// 		imagePath := fmt.Sprintf(
// 			"https://%s.s3.%s.amazonaws.com/%s/%s/%s/%s.%s",
// 			envCfg.S3.BucketName,
// 			envCfg.S3.Region,
// 			profileType,
// 			userType,
// 			uniqueUUID,
// 			imageName,
// 			extension,
// 		)

// 		// Save in DB
// 		img := models.ItemImage{
// 			FileName: imagePath,
// 		}
// 		if err := db.Create(&img).Error; err != nil {
// 			logrus.WithError(err).Errorf("Failed to save image %d in DB", index+1)
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB save failed for image %d", index+1)})
// 			return
// 		}

// 		imageIDs = append(imageIDs, img.ID)
// 		imageURLs = append(imageURLs, imagePath)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":    "Images uploaded successfully",
// 		"image_ids":  imageIDs,
// 		"image_urls": imageURLs,
// 	})
// }

func UploadProdutImages(c *gin.Context, db *gorm.DB) {
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

	var payload config.UploadImagesPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	if len(payload.Images) == 0 || len(payload.Images) > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You must upload between 1 and 5 images"})
		return
	}

	envCfg, err := cfg.Env()
	if err != nil {
		logrus.WithError(err).Error("Failed to load environment config")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Configuration error"})
		return
	}

	type UploadResult struct {
		Index    int
		ImageID  uint
		ImageURL string
		Error    error
	}

	resultCh := make(chan UploadResult, len(payload.Images))
	var wg sync.WaitGroup

	for index, base64Str := range payload.Images {
		wg.Add(1)
		go func(index int, base64Str string) {
			defer wg.Done()

			decodedImage, err := base64.StdEncoding.DecodeString(base64Str)
			if err != nil {
				resultCh <- UploadResult{Index: index, Error: fmt.Errorf("invalid base64 image at index %d", index)}
				return
			}

			extension, err := getfileextension.GetFileExtension(decodedImage)
			if err != nil {
				resultCh <- UploadResult{Index: index, Error: fmt.Errorf("unsupported image format at index %d", index)}
				return
			}

			uniqueUUID := s3helper.GenerateUniqueID().String()
			imageName := fmt.Sprintf("image_%d", index+1)
			profileType := "medicine"
			userType := "inventory"
			userIDString := fmt.Sprintf("%d", userObj.ID)

			err = s3helper.UploadToS3(
				c.Request.Context(),
				profileType,
				userType,
				envCfg.S3.BucketName,
				uniqueUUID,
				userIDString,
				imageName,
				decodedImage,
			)
			if err != nil {
				resultCh <- UploadResult{Index: index, Error: fmt.Errorf("S3 upload failed for image %d", index+1)}
				return
			}

			imagePath := fmt.Sprintf(
				"https://%s.s3.%s.amazonaws.com/%s/%s/%s/%s/%s.%s",
				envCfg.S3.BucketName,
				envCfg.S3.Region,
				profileType,
				userType,
				uniqueUUID,
				userIDString,
				imageName,
				extension,
			)

			img := models.ItemImage{
				FileName: imagePath,
			}
			if err := db.Create(&img).Error; err != nil {
				resultCh <- UploadResult{Index: index, Error: fmt.Errorf("DB save failed for image %d", index+1)}
				return
			}

			resultCh <- UploadResult{
				Index:    index,
				ImageID:  img.ID,
				ImageURL: imagePath,
				Error:    nil,
			}
		}(index, base64Str)
	}

	wg.Wait()
	close(resultCh)

	var imageIDs []uint
	var imageURLs []string
	for res := range resultCh {
		if res.Error != nil {
			logrus.WithError(res.Error).Error("Error in uploading image")
			c.JSON(http.StatusInternalServerError, gin.H{"error": res.Error.Error()})
			return
		}
		imageIDs = append(imageIDs, res.ImageID)
		imageURLs = append(imageURLs, res.ImageURL)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Images uploaded successfully",
		"image_ids":  imageIDs,
		"image_urls": imageURLs,
	})
}

func DeleteItemImage(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		logrus.Warn("Unauthorized access")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	admin, ok := user.(*models.Admin)
	if !ok || admin.ApplicationRole != "admin" {
		logrus.Warn("Access denied: not an admin")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only admins can delete images"})
		return
	}

	imageIDParam := c.Param("image_id")
	imageID, err := strconv.Atoi(imageIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	// Optional: Fetch image info before delete for S3 deletion
	var image models.ItemImage
	if err := db.First(&image, imageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	// Delete from DB permanently
	if err := db.Unscoped().Delete(&models.ItemImage{}, imageID).Error; err != nil {
		logrus.WithError(err).Error("Failed to delete image")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Image deleted successfully",
		"image_id": imageID,
	})
}
