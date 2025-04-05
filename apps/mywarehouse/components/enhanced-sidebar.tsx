"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  MoreHorizontal,
  Plus,
  Settings,
  Star,
  Warehouse,
  LogOut,
  Home,
  Users,
  Package,
  Info,
  Phone,
  CuboidIcon,
  FileText,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Define navigation items
const mainNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    badge: "",
  },
  {
    title: "myCustomers",
    href: "/customers",
    icon: Users,
    badge: "3",
  },
  {
    title: "myRooms",
    href: "/onboardWare",
    icon: Warehouse,
    badge: "",
  },
  {
    title: "myInventory",
    href: "/inventory",
    icon: Package,
    badge: "12",
  },
]

const secondaryNavItems = [
  {
    title: "myAdmin",
    href: "/admin",
    icon: Settings,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Phone,
  },
]

// Define favorite items
const favoriteItems = [
  {
    title: "Cold Storage A",
    href: "/onboardWare/room/1",
    icon: CuboidIcon,
  },
  {
    title: "Inventory Reports",
    href: "/inventory/reports",
    icon: FileText,
  },
  {
    title: "Customer Dashboard",
    href: "/customers/dashboard",
    icon: Users,
  },
]

// Define workspace items with nested content
const workspaceItems = [
  {
    title: "Warehouse 1",
    icon: Warehouse,
    items: [
      {
        title: "Room A",
        href: "/onboardWare/room/1",
      },
      {
        title: "Room B",
        href: "/onboardWare/room/2",
      },
    ],
  },
  {
    title: "Warehouse 2",
    icon: Warehouse,
    items: [
      {
        title: "Room C",
        href: "/onboardWare/room/3",
      },
      {
        title: "Room D",
        href: "/onboardWare/room/4",
      },
    ],
  },
]

interface EnhancedSidebarProps {
  children: React.ReactNode
}

export function EnhancedSidebar({ children }: EnhancedSidebarProps) {
  const pathname = usePathname()
  const [openWorkspaces, setOpenWorkspaces] = React.useState<Record<string, boolean>>({})

  // Toggle workspace open/closed state
  const toggleWorkspace = (title: string) => {
    setOpenWorkspaces((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Check if a link is active
  const isActive = (href: string) => pathname === href

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            {/* Logo and app title */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Warehouse className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">myWarehouse</span>
                      <span className="text-xs text-muted-foreground">v2.0.0</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {/* Main navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.href} className="group/menu-item">
                      <SidebarMenuButton asChild isActive={isActive(item.href)} className="peer/menu-button">
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      {/* Badge - conditionally shown */}
                      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}

                      {/* Action button - shown on hover */}
                      <SidebarMenuAction
                        showOnHover={true}
                        className="peer-hover/menu-button:text-sidebar-accent-foreground"
                      >
                        <MoreHorizontal className="size-4" />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Favorites section */}
            <SidebarGroup>
              <SidebarGroupLabel>Favorites</SidebarGroupLabel>
              <SidebarGroupAction>
                <Plus className="size-4" />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {favoriteItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="group/menu-item">
                      <SidebarMenuButton asChild isActive={isActive(item.href)} className="peer/menu-button">
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      {/* Star icon that changes color on hover */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuAction className="text-yellow-500 opacity-50 group-hover/menu-item:opacity-100">
                              <Star className="size-4" />
                            </SidebarMenuAction>
                          </TooltipTrigger>
                          <TooltipContent>Remove from favorites</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Workspaces with collapsible sections */}
            <SidebarGroup>
              <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {workspaceItems.map((workspace) => (
                    <Collapsible
                      key={workspace.title}
                      open={openWorkspaces[workspace.title]}
                      onOpenChange={() => toggleWorkspace(workspace.title)}
                      className="group/collapsible w-full"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="group/workspace-button">
                            <workspace.icon className="size-4" />
                            <span>{workspace.title}</span>
                            <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {/* Action button that appears on hover */}
                        <SidebarMenuAction
                          showOnHover={true}
                          className="group-hover/workspace-button:opacity-100 md:opacity-0"
                        >
                          <MoreHorizontal className="size-4" />
                        </SidebarMenuAction>
                      </SidebarMenuItem>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {workspace.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild isActive={isActive(item.href)}>
                                <Link href={item.href}>{item.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Secondary navigation */}
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryNavItems.map((item) => (
                    <SidebarMenuItem key={item.href} className="group/menu-item">
                      <SidebarMenuButton asChild isActive={isActive(item.href)} className="peer/menu-button">
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between group/profile hover:bg-muted p-2 rounded-md transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 font-medium">
                  DU
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">Dev User</span>
                  <span className="text-xs text-muted-foreground">dev@example.com</span>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1"></div>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

