import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Config, BUCKET_NAME } from "./config"

// Initialize S3 client with our configuration
const s3Client = new S3Client(s3Config)

/**
 * Utility functions for S3/MinIO storage operations
 */
export const storage = {
  /**
   * Upload a file to S3/MinIO
   */
  async uploadFile(key: string, body: Buffer | Blob | string, contentType?: string) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })

    return s3Client.send(command)
  },

  /**
   * Get a file from S3/MinIO
   */
  async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return s3Client.send(command)
  },

  /**
   * Delete a file from S3/MinIO
   */
  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return s3Client.send(command)
  },

  /**
   * Generate a pre-signed URL for direct browser upload
   */
  async getUploadUrl(key: string, expiresIn = 3600) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return getSignedUrl(s3Client, command, { expiresIn })
  },

  /**
   * Generate a pre-signed URL for direct browser download
   */
  async getDownloadUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return getSignedUrl(s3Client, command, { expiresIn })
  },
}

