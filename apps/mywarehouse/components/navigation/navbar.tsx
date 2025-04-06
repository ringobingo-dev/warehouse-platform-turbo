"use client"

import Link from "next/link"
import { Warehouse, Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Warehouse className="h-6 w-6" />
          <span className="text-lg font-bold">myWarehouse</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/customers" className="text-sm font-medium hover:underline underline-offset-4">
            myCustomers
          </Link>
          <Link href="/onboardWare" className="text-sm font-medium hover:underline underline-offset-4">
            myRooms
          </Link>
          <Link href="/inventory" className="text-sm font-medium hover:underline underline-offset-4">
            myInventory
          </Link>
          <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4">
            myAdmin
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <Link
            href="/login"
            className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Login
          </Link>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col gap-2 p-4">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/customers" className="text-sm font-medium hover:underline underline-offset-4">
              myCustomers
            </Link>
            <Link href="/onboardWare" className="text-sm font-medium hover:underline underline-offset-4">
              myRooms
            </Link>
            <Link href="/inventory" className="text-sm font-medium hover:underline underline-offset-4">
              myInventory
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4">
              myAdmin
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

