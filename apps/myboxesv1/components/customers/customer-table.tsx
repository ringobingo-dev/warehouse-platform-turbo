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
import { Edit, Mail, MoreHorizontal } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  lastOrder: string
  totalSpent: number
}

interface CustomerTableProps {
  customers: Customer[]
  onEdit: (customerId: string) => void
  onContact: (customerId: string) => void
  onViewDetails: (customerId: string) => void
}

export function CustomerTable({ customers, onEdit, onContact, onViewDetails }: CustomerTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Customer list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                <Badge variant={customer.status === "active" ? "success" : "destructive"}>{customer.status}</Badge>
              </TableCell>
              <TableCell>{customer.lastOrder}</TableCell>
              <TableCell className="text-right">${customer.totalSpent.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(customer.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onContact(customer.id)}>
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onViewDetails(customer.id)}>
                    <MoreHorizontal className="h-4 w-4" />
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

