/**
 * Checks if the required environment variables are set
 * In development, we use mock data so these aren't required
 */
export function checkRequiredEnvVars() {
  // Comment out the required variables check since we're using mock data
  // const requiredVars = [
  //   "POSTGRES_URL",
  //   // Add other required env vars here
  // ]

  // const missingVars = requiredVars.filter((varName) => !process.env[varName])

  // if (missingVars.length > 0) {
  //   console.log(`Development mode: Using mock data instead of database connections`)
  //   console.log(`Missing environment variables: ${missingVars.join(", ")}`)
  //   return false
  // }

  console.log(`Development mode: Using mock data instead of database connections`)
  return true
}

/**
 * Gets the database connection string
 * In development, this may return an empty string
 */
export function getDatabaseUrl() {
  // Comment out the environment variable access
  // return process.env.POSTGRES_URL || ""
  return "" // Return empty string while using mock data
}

// Note: In production, you would need to set these environment variables:
// - POSTGRES_URL: Connection string for your PostgreSQL database
// - WORKOS_API_KEY: API key for WorkOS authentication
// - WORKOS_CLIENT_ID: Client ID for WorkOS authentication
// - WORKOS_REDIRECT_URI: Redirect URI for WorkOS authentication

