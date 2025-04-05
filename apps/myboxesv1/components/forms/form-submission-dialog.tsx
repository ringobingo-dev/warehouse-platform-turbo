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
} from "@/components/shared/ui/dialog"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"

interface FormSubmissionDialogProps {
  isSuccess: boolean
  title: string
  message: string
  onClose: () => void
}

export function FormSubmissionDialog({ isSuccess, title, message, onClose }: FormSubmissionDialogProps) {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-destructive" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={handleClose}>
            {isSuccess ? "Continue" : "Try Again"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

