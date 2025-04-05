import type React from "react"
// Before:
// import { Navbar } from "@/components/navbar";
// import { Sidebar } from "@/components/sidebar";
// import { MobileSidebar } from "@/components/mobile-sidebar";
// import { cn } from "@/lib/utils";

// After:
// NX: This component is used for the top navigation
import { Navbar } from "./navbar"
// NX: This component is used for desktop navigation
import { Sidebar } from "./sidebar"
// NX: This component is used for mobile navigation
import { MobileSidebar } from "./mobile-sidebar"
// NX: This utility is used across multiple files
import { cn } from "../lib/utils"

interface LayoutProps {
  children: React.ReactNode
  navigationItems: {
    title: string
    href: string
    icon?: React.ReactNode
  }[]
  className?: string
}

export function Layout({ children, navigationItems, className }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r md:block">
          <Sidebar items={navigationItems} />
        </aside>
        <main className={cn("flex-1 p-6", className)}>
          <MobileSidebar items={navigationItems} />
          {children}
        </main>
      </div>
    </div>
  )
}

// TODO: Review for Stage 1 completeness

