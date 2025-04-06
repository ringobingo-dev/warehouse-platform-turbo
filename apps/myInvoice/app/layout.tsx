import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WorkOSProvider } from "@/components/auth/workos-provider"
import { Toaster } from "@/components/ui/toaster"
import { AppSidebar } from "@/components/app-sidebar"
import { PersistentSidebarToggle } from "@/components/persistent-sidebar-toggle"
import { MainContent } from "@/components/main-content"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Warehouse Invoice Service",
  description: "Invoice management for your warehouse platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WorkOSProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <PersistentSidebarToggle />
              <MainContent>{children}</MainContent>
            </div>
            <Toaster />
          </WorkOSProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'