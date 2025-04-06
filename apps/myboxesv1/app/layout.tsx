import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import "./styles/add-boxes-override.css"
import { SidebarNav } from "@/components/sidebar"
import { BoxProvider } from "@/context/BoxContext"
import { StorageProvider } from "@/utils/storage/storage-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "3D Box Viewer",
  description: "Visualize and manage boxes in a 3D environment",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <StorageProvider>
          <BoxProvider>
            <div className="flex h-screen">
              <SidebarNav>{children}</SidebarNav>
            </div>
          </BoxProvider>
        </StorageProvider>
      </body>
    </html>
  )
}

