"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/table"
import { Button } from "@/components/shared/ui/button"
import { Badge } from "@/components/shared/ui/badge"
import { Edit, Trash } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  price: number
  status: "in-stock" | "low-stock" | "out-of-stock"
}

interface InventoryTableProps {
  items: InventoryItem[]
  onEdit: (itemId: string) => void
  onDelete: (itemId: string) => void
}

export function InventoryTable({ items, onEdit, onDelete }: InventoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Inventory items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === "in-stock" ? "success" : item.status === "low-stock" ? "warning" : "destructive"
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

