import useSWR from "swr"
import { NEXT_PUBLIC_API_URL } from "../config"

// Default fetcher function for SWR
const defaultFetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

/**
 * Custom hook for data fetching with SWR
 */
export function useData<T>(
  endpoint: string,
  options?: {
    fetcher?: (url: string) => Promise<T>
    refreshInterval?: number
    dedupingInterval?: number
  },
) {
  const { fetcher = defaultFetcher, ...swrOptions } = options || {}
  const fullUrl = endpoint.startsWith("http") ? endpoint : `${NEXT_PUBLIC_API_URL}${endpoint}`

  return useSWR<T>(fullUrl, fetcher, swrOptions)
}

