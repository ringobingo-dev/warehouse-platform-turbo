import type React from "react"
import {
  LayoutDashboard,
  Search,
  History,
  Settings,
  Box,
  Briefcase,
  PlusSquare,
  CuboidIcon as Cube,
  ClipboardList,
} from "lucide-react"

export interface Route {
  title: string
  href: string // Full path with leading slash
  key?: string // For navbar tabs (without slash)
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color?: string
  isExternal?: boolean
  alternativePaths?: string[] // For handling path inconsistencies
}

// Define a fallback empty array to prevent mapping errors
export const routes: Route[] = [
  {
    title: "My Rooms",
    href: "/room-dimensions",
    key: "dimensions",
    icon: LayoutDashboard,
    alternativePaths: ["/dimensions"],
  },
  {
    title: "Add Room",
    href: "/add-room",
    key: "add-room",
    icon: PlusSquare,
  },
  {
    title: "3D View",
    href: "/3d-view",
    key: "3d-view",
    icon: Cube,
  },
  {
    title: "Box Search",
    href: "/box-search",
    key: "box-search",
    icon: Search,
  },
  {
    title: "Box Maintenance",
    href: "/maintenance",
    key: "maintenance",
    icon: Box,
  },
  {
    title: "Log & Snapshots",
    href: "/log-snapshots",
    key: "log-snapshots",
    icon: ClipboardList,
  },
  {
    title: "History",
    href: "/history",
    key: "history",
    icon: History,
  },
  {
    title: "Box Controls",
    href: "/box-controls",
    key: "box-controls",
    icon: Box,
  },
  {
    title: "My Jobs",
    href: "/jobs",
    key: "jobs",
    icon: Briefcase,
  },
  {
    title: "Settings",
    href: "/settings",
    key: "settings",
    icon: Settings,
  },
].filter((route) => route.title !== "Help")

// Helper function for active route detection
export function isRouteActive(pathname: string, href: string): boolean {
  // Find the route with this href
  const route = routes.find((r) => r.href === href || r.alternativePaths?.includes(href))

  // If route not found, fall back to simple matching
  if (!route) {
    // Exact match
    if (pathname === href) return true

    // Handle index routes
    if (href !== "/" && pathname.startsWith(`${href}/`)) return true

    return false
  }

  // Exact match with primary href
  if (pathname === route.href) return true

  // Check alternative paths
  if (route.alternativePaths?.includes(pathname)) return true

  // Special case for dimensions/room-dimensions
  if (route.key === "dimensions" && (pathname === "/dimensions" || pathname === "/room-dimensions")) {
    return true
  }

  // Handle index routes for primary path
  if (route.href !== "/" && pathname.startsWith(`${route.href}/`)) return true

  // Handle index routes for alternative paths
  if (route.alternativePaths) {
    for (const path of route.alternativePaths) {
      if (path !== "/" && pathname.startsWith(`${path}/`)) return true
    }
  }

  return false
}

// Helper to get route by key (for navbar)
export function getRouteByKey(key: string): Route | undefined {
  return routes.find((route) => route.key === key)
}

// Helper to get all tab keys for navbar
export function getTabKeys(): string[] {
  return routes.filter((route) => route.key).map((route) => route.key as string)
}

// Helper to get tab display names for navbar
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

