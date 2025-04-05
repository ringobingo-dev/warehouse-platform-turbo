"use client"

import { useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import {
  routes,
  isRouteActive as isRouteActiveUtil,
  getRouteByKey,
  getTabKeys,
  getTabNames,
} from "@/config/routes-enhanced"

export function useNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path)
    },
    [router],
  )

  const navigateBack = useCallback(() => {
    router.back()
  }, [router])

  const isCurrentPath = useCallback(
    (path: string): boolean => {
      return pathname === path
    },
    [pathname],
  )

  const isPathActive = useCallback(
    (path: string): boolean => {
      if (path === "/") {
        return pathname === "/"
      }
      return pathname.startsWith(path)
    },
    [pathname],
  )

  return {
    // Original routes array for backward compatibility
    routes,

    // Helper for checking if a route is active
    isActive: (href: string) => isRouteActiveUtil(pathname, href),

    // For navbar
    tabKeys: getTabKeys(),
    tabNames: getTabNames(),
    getRouteByKey,

    // Current pathname
    pathname,
    navigateTo,
    navigateBack,
    isCurrentPath,
    isPathActive,
    currentPath: pathname,
  }
}

