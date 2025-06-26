package s3helper

import (
	"bytes"
	"context"
	"fmt"
	"mime"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
	"github.com/innovativecursor/Kloudpx/apps/pkg/config"
	"github.com/innovativecursor/Kloudpx/apps/pkg/helper/userhelper/getfileextension"
)

func UploadToS3(ctx context.Context, profileType, userType, bucketName, imageUniqueCode, userID, imageName string, image []byte) error {
	// Load AWS credentials from env.yaml
	cfg, err := config.Env()
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}

	awsAccessKeyID := cfg.S3.AccessKey
	awsSecretAccessKey := cfg.S3.SecretKey
	awsRegion := cfg.S3.Region

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(awsRegion),
		Credentials: credentials.NewStaticCredentials(
			awsAccessKeyID, awsSecretAccessKey, "",
		),
	})
	//handling error
	if err != nil {
		return fmt.Errorf("error creating session: %w", err)
	}
	// Create a new S3 client
	svc := s3.New(sess)
	// Get the file extension
	extension, err := getfileextension.GetFileExtension(image)
	if err != nil {
		return fmt.Errorf("error getting file extension: %w", err)
	}

	// Specify the key (path) for the file in the S3 bucket
	key := fmt.Sprintf("%s/%s/%s/%s/%s.%s", profileType, userType, imageUniqueCode, userID, imageName, extension)
	// Determine the content type based on the file extension
	contentType := mime.TypeByExtension("." + extension)
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	// Create a reader for the image data.
	reader := bytes.NewReader(image)
	//Create the input parameters for the S3 PutObject operation
	params := &s3.PutObjectInput{
		Bucket:      aws.String(bucketName),
		Key:         aws.String(key),
		Body:        reader,
		ContentType: aws.String(contentType),
	}
	// Upload the file to the S3 bucket
	_, err = svc.PutObjectWithContext(ctx, params) // Use context for better control
	if err != nil {
		return fmt.Errorf("error uploading file: %w", err)
	}

	//return nil
	return nil
}
func GenerateUniqueID() uuid.UUID {
	newUUID := uuid.New()
	return newUUID
}
