"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface InventoryItem {
  id: string
  [key: string]: string | number
}

interface DeleteInventoryModuleProps {
  onDeleteItem: (itemId: string) => void
  inventoryItems: InventoryItem[]
  userId: string
}

export function DeleteInventoryModule({ onDeleteItem, inventoryItems, userId }: DeleteInventoryModuleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const handleDelete = () => {
    if (selectedItemId) {
      onDeleteItem(selectedItemId)
      setSelectedItemId(null)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Inventory Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Inventory Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-select" className="text-right">
              Select Item
            </Label>
            <Select value={selectedItemId || ""} onValueChange={(value) => setSelectedItemId(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an item to delete" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {`${item.Type} - ${item.Variety} (${item.weight} kg)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!selectedItemId} className="col-span-4">
                Delete Item
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the selected inventory item from the
                  database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Yes, delete item</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}

