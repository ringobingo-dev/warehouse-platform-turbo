/**
 * Environment utilities for SST integration
 */

// Get the current SST stage
export function getCurrentStage(): string {
  return process.env.NEXT_PUBLIC_SST_STAGE || "dev"
}

// Check if we're in local development
export function isLocalDevelopment(): boolean {
  return process.env.NODE_ENV === "development"
}

/**
 * Checks if the code is running in a browser environment
 * @returns True if running in a browser, false otherwise
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Checks if the code is running in a server environment
 * @returns True if running on the server, false otherwise
 */
export function isServer(): boolean {
  return !isBrowser()
}

/**
 * Checks if the code is running in a development environment
 * @returns True if running in development, false otherwise
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development"
}

/**
 * Checks if the code is running in a production environment
 * @returns True if running in production, false otherwise
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}

// Get the base URL for the current environment
export function getBaseUrl(): string {
  if (isBrowser()) {
    return window.location.origin
  }

  // For server-side rendering
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
}

// Get API URL based on environment
export function getApiUrl(endpoint: string): string {
  const baseApiUrl = isLocalDevelopment() ? "/api" : process.env.NEXT_PUBLIC_API_URL || "/api"

  return `${baseApiUrl}/${endpoint}`
}

// Track if we've already shown an environment variable warning
let hasShownEnvWarning = false

// Function to check required environment variables and show warning only once
export function checkRequiredEnvVars(requiredVars: string[]): boolean {
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0 && !hasShownEnvWarning) {
    hasShownEnvWarning = true
    console.warn(`Missing required environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return missingVars.length === 0
}

