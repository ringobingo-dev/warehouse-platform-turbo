"use client"

import type React from "react"

import { useUIStore } from "@/lib/store"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "pl-0" : "pl-64"}`}>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}

