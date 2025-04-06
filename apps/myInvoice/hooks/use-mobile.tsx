"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  // Default to false for SSR
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      // Initial check
      checkIsMobile()

      // Add event listener for resize
      window.addEventListener("resize", checkIsMobile)

      // Cleanup
      return () => window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}

