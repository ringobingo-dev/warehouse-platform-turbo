import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navigation/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "myWarehouse - Smart Agricultural Storage Management",
  description: "Manage your agricultural storage facilities with ease using myWarehouse platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen p-4 md:p-6 lg:p-8">{children}</main>
        <footer className="border-t py-4 md:py-6">
          <div className="container flex flex-col items-center justify-center gap-2 md:gap-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} myWarehouse. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

