/**
 * Application configuration with environment variable handling
 * This centralizes all environment variables and provides defaults for local development
 */

// AWS Configuration
export const AWS_REGION = process.env.AWS_REGION || "us-east-1"

// S3/MinIO Configuration (MinIO is used locally as an S3 alternative)
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000"
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minioadmin"
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "minioadmin"
export const BUCKET_NAME = process.env.BUCKET_NAME || "mywarehouse-local"

// Public environment variables (accessible in browser)
export const NEXT_PUBLIC_SST_STAGE = process.env.NEXT_PUBLIC_SST_STAGE || "local"
export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Determine if we're in a local development environment
export const isLocalDevelopment = NEXT_PUBLIC_SST_STAGE === "local"

// S3 client configuration - will use MinIO locally and AWS S3 in other environments
export const s3Config = {
  region: AWS_REGION,
  // Only use these in local development with MinIO
  ...(isLocalDevelopment && {
    endpoint: MINIO_ENDPOINT,
    credentials: {
      accessKeyId: MINIO_ACCESS_KEY,
      secretAccessKey: MINIO_SECRET_KEY,
    },
    forcePathStyle: true, // Required for MinIO
  }),
}

