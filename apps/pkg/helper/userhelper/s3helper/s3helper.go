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
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/aws/aws-sdk-go/service/sns"
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

// SendSMS sends a 6-digit OTP and message via AWS SNS to the provided phone number.
func SendSMS(phoneNumber, message string) error {
	cfg, err := config.Env()
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}

	awsAccessKeyID := cfg.S3.AccessKey
	awsSecretAccessKey := cfg.S3.SecretKey
	awsRegion := cfg.S3.Region

	// Create AWS session
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(awsRegion),
		Credentials: credentials.NewStaticCredentials(awsAccessKeyID, awsSecretAccessKey, ""),
	})
	if err != nil {
		return fmt.Errorf("error creating session: %w", err)
	}

	// Prepare SNS Publish input with the message and target phone number
	svc := sns.New(sess)
	input := &sns.PublishInput{
		Message:     aws.String(message),
		PhoneNumber: aws.String(phoneNumber),
	}
	//Send SMS via AWS SNS
	if _, err := svc.Publish(input); err != nil {
		return fmt.Errorf("error publishing message: %w", err)
	}

	fmt.Println("OTP sent successfully!")
	return nil
}

// To send email via AWS SES to the provided email.
func SendEmail(recipient, subject, body string) error {
	fmt.Println("recipient", recipient, "subject", subject, "body", body)
	cfg, err := config.Env()
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}

	awsAccessKeyID := cfg.S3.AccessKey
	awsSecretAccessKey := cfg.S3.SecretKey
	awsRegion := cfg.S3.Region

	// Create AWS session
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(awsRegion),
		Credentials: credentials.NewStaticCredentials(awsAccessKeyID, awsSecretAccessKey, ""),
	})
	if err != nil {
		return fmt.Errorf("error creating session: %w", err)
	}

	svc := ses.New(sess)

	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: []*string{
				aws.String(recipient),
			},
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(body),
				},
			},
			Subject: &ses.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String(subject),
			},
		},
		Source: aws.String("innocursor@gmail.com"), //sender
	}

	_, err = svc.SendEmail(input)
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}

	return nil
}
