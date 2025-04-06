"use client"

import { useState, useEffect } from "react"

/**
 * A hook that returns whether the current viewport is considered mobile
 * @param breakpoint The width in pixels below which the viewport is considered mobile
 * @returns A boolean indicating whether the current viewport is mobile
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < breakpoint)

    // Add event listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [breakpoint])

  return isMobile
}

