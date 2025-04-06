import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  // For MinIO, you would add endpoint and credentials here
  // endpoint: process.env.MINIO_ENDPOINT,
  // credentials: {
  //   accessKeyId: process.env.MINIO_ACCESS_KEY || "",
  //   secretAccessKey: process.env.MINIO_SECRET_KEY || "",
  // },
  // forcePathStyle: true, // Required for MinIO
})

const bucketName = process.env.BUCKET_NAME || "3dbox-snapshots"

/**
 * Uploads a snapshot JSON to S3/MinIO
 *
 * @param {string} userId - The user ID
 * @param {string} roomId - The room ID
 * @param {string} snapshotId - The snapshot ID
 * @param {any} data - The snapshot data to upload
 * @returns {Promise<string>} The S3/MinIO key of the uploaded file
 */
export async function uploadSnapshot(userId: string, roomId: string, snapshotId: string, data: any): Promise<string> {
  const key = `${userId}/${roomId}/${snapshotId}.json`

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    }),
  )

  return key
}

/**
 * Gets a snapshot JSON from S3/MinIO
 *
 * @param {string} key - The S3/MinIO key of the snapshot
 * @returns {Promise<any>} The snapshot data
 */
export async function getSnapshot(key: string): Promise<any> {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  )

  if (!response.Body) {
    throw new Error("Empty response body")
  }

  const stream = response.Body as any
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  const buffer = Buffer.concat(chunks)
  return JSON.parse(buffer.toString())
}

/**
 * Generates a pre-signed URL for downloading a snapshot
 *
 * @param {string} key - The S3/MinIO key of the snapshot
 * @returns {Promise<string>} The pre-signed URL
 */
export async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

/**
 * Deletes a snapshot from S3/MinIO
 *
 * @param {string} key - The S3/MinIO key of the snapshot
 * @returns {Promise<void>}
 */
export async function deleteSnapshot(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  )
}

