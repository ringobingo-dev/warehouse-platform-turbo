"use client"

import { usePathname } from "next/navigation"
import { routes, isRouteActive, getRouteByKey, getTabKeys, getTabNames } from "@/config/routes"

export function useNavigation() {
  const pathname = usePathname()

  return {
    routes,
    pathname,
    isActive: (href: string) => {
      const route = routes.find((r) => r.href === href)
      return isRouteActive(pathname, href, route?.alternativePaths)
    },
    tabKeys: getTabKeys(),
    tabNames: getTabNames(),
    getRouteByKey,
  }
}

