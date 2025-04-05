"use client"
import { useState } from "react"
import type React from "react"

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
import { AlertTriangleIcon, TrashIcon } from "lucide-react"

interface DeleteConfirmationProps {
  itemName: string
  onDelete: () => Promise<void> | void
  trigger?: React.ReactNode
}

export function DeleteConfirmation({ itemName, onDelete, trigger }: DeleteConfirmationProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
      setOpen(false)
    } catch (error) {
      console.error("Failed to delete:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-medium text-foreground">{itemName}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 sm:justify-start">
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

