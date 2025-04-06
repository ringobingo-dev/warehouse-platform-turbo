"use client"

import { useRef, useEffect } from "react"

/**
 * A hook that tracks the number of times a component has rendered
 * Useful for debugging and performance optimization
 *
 * @param componentName Optional name to identify the component in logs
 * @returns The current render count
 */
export function useRenderCount(componentName?: string): number {
  const renderCount = useRef<number>(0)

  useEffect(() => {
    renderCount.current += 1

    if (process.env.NODE_ENV === "development") {
      console.log(`${componentName || "Component"} rendered: ${renderCount.current} times`)
    }
  })

  return renderCount.current
}

// possible duplicate — review for consolidation
// Original hook kept for compatibility, consider using the shared version in hooks/shared/useRenderCount.ts

