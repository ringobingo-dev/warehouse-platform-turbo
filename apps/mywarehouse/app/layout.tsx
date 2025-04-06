import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarNav } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { UserProvider } from "@/contexts/user-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "myWarehouse - Smart Agricultural Storage Management",
  description: "Manage your agricultural storage facilities with ease using myWarehouse platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <SidebarNav>
            <MobileSidebar />
            {children}
          </SidebarNav>
        </UserProvider>
      </body>
    </html>
  )
}



import './globals.css'