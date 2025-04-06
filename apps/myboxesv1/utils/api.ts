/**
 * Constructs an API URL based on the provided path
 * @param path The API path
 * @returns The full API URL
 */
export function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Utility for making API requests to SST backend
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = getApiUrl(endpoint)

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })

  if (!response.ok) {
    // Handle error responses
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API request failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Handles API errors and returns a standardized error object
 * @param error The error to handle
 * @returns A standardized error object
 */
export function handleApiError(error: unknown): { message: string; status?: number } {
  console.error("API Error:", error)

  if (error instanceof Response) {
    return {
      message: `API error: ${error.statusText}`,
      status: error.status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: "An unknown error occurred",
  }
}

/**
 * Creates headers for API requests
 * @param options Additional header options
 * @returns Headers for the API request
 */
export function createApiHeaders(options: Record<string, string> = {}): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...options,
  })

  // Add authentication token if available
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null
  if (token) {
    headers.append("Authorization", `Bearer ${token}`)
  }

  return headers
}

// Define a type for the route object
interface Route {
  href: string
  apiEndpoint?: string
}

// Mock routes data.  In a real application, this would likely come from a config file or API.
const routes: Route[] = [
  // Example routes - replace with your actual routes
  { href: "/home", apiEndpoint: "/api/home" },
  { href: "/profile", apiEndpoint: "/api/profile" },
]

/**
 * Helper to get API endpoint from route
 */
export function getRouteApiEndpoint(routePath: string) {
  const route = routes.find((r) => r.href === routePath)
  return route?.apiEndpoint
}

