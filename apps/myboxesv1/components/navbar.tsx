"use client"

// Before:
// import { Button } from "@/components/ui/button";
// import { Avatar } from "@/components/ui/avatar";
// import { ThemeToggle } from "@/components/theme-toggle";
// import { Logo } from "@/components/logo";
// import { useAuth } from "@/hooks/use-auth";

// After:
// NX: This component is used across multiple pages
import { Button } from "@/components/shared/ui/button"
import { Avatar } from "@/components/ui/avatar"
// NX: This component handles theme switching functionality
import { ThemeToggle } from "./theme-toggle"
// NX: This component is used across multiple pages
import { Logo } from "./logo"
// NX: This hook uses multiple levels of parent directories
import { useAuth } from "../hooks/use-auth"

// moved to shared folder for reuse and NX prep

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <Avatar user={user} />
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm">
                Sign in
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

