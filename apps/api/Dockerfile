FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy all files first
COPY . .

# Download dependencies and tidy
RUN go mod tidy && go mod download

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Make it executable
RUN chmod +x ./main

# Expose port
EXPOSE 8080

# Command to run
CMD ["./main"]