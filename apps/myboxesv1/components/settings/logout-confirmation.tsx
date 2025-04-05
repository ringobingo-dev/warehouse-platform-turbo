"use client"
import { useState } from "react"
import { Button } from "@/components/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/ui/dialog"
import { LogOutIcon } from "lucide-react"

interface LogoutConfirmationProps {
  onLogout: () => Promise<void> | void
}

export function LogoutConfirmation({ onLogout }: LogoutConfirmationProps) {
  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await onLogout()
      setOpen(false)
    } catch (error) {
      console.error("Failed to logout:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <LogOutIcon className="h-4 w-4" />
          Logout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>Are you sure you want to log out of your account?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 sm:justify-start">
          <Button type="button" variant="default" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoggingOut}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

