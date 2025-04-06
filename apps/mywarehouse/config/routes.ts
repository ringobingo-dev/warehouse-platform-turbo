import type React from "react"
import { Home, Users, Warehouse, Package, Settings, Phone } from "lucide-react"

export interface Route {
  title: string
  href: string
  key?: string
  icon: React.ComponentType<any>
  color?: string
  isExternal?: boolean
  alternativePaths?: string[]
}

export const routes: Route[] = [
  {
    title: "Home",
    href: "/",
    key: "home",
    icon: Home,
  },
  {
    title: "myCustomers",
    href: "/customers",
    key: "customers",
    icon: Users,
  },
  {
    title: "myRooms",
    href: "/onboardWare",
    key: "rooms",
    icon: Warehouse,
    alternativePaths: ["/rooms"],
  },
  {
    title: "myInventory",
    href: "/inventory",
    key: "inventory",
    icon: Package,
  },
  {
    title: "myAdmin",
    href: "/admin",
    key: "admin",
    icon: Settings,
  },
  {
    title: "Settings",
    href: "/settings",
    key: "settings",
    icon: Settings,
  },
  {
    title: "Contact",
    href: "/contact",
    key: "contact",
    icon: Phone,
  },
]

// Helper functions
export function isRouteActive(pathname: string, href: string, alternativePaths?: string[]): boolean {
  if (href === "/") {
    return pathname === "/"
  }

  if (pathname.startsWith(href)) {
    return true
  }

  if (alternativePaths) {
    return alternativePaths.some((path) => pathname.startsWith(path))
  }

  return false
}

export function getRouteByKey(key: string): Route | undefined {
  return routes.find((route) => route.key === key)
}

export function getTabKeys(): string[] {
  return routes.filter((route) => route.key).map((route) => route.key as string)
}

export function getTabNames(): Record<string, string> {
  return routes.reduce(
    (acc, route) => {
      if (route.key) {
        acc[route.key] = route.title
      }
      return acc
    },
    {} as Record<string, string>,
  )
}

