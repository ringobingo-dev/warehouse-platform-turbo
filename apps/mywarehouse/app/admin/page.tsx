"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InvoiceTemplateDialog from "@/components/InvoiceTemplateDialog"

interface Customer {
  id: string
  name: string
  type: "Type1" | "Type2" | "Type3" | "Type4"
}

interface Invoice {
  id: string
  customerName: string
  roomName: string
  amount: number
  status: "pending" | "paid"
  dueDate: string
}

interface InvoiceTemplate {
  name: string
  content: string
  customerType: string
}

const mockCustomers: Customer[] = [
  { id: "C1", name: "Acme Corp", type: "Type2" },
  { id: "C2", name: "TechStart Inc", type: "Type4" },
  { id: "C3", name: "Green Farms Ltd", type: "Type2" },
  { id: "C4", name: "Warehouse Solutions", type: "Type1" },
]

export default function AdminPage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [invoiceTemplates, setInvoiceTemplates] = useState<InvoiceTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  useEffect(() => {
    // Simulating user authentication check
    const checkUserType = async () => {
      // In a real application, this would be an API call or check against an auth provider
      setUserType("warehouseOwner")
    }
    checkUserType()
  }, [])

  useEffect(() => {
    // Simulating fetching invoices from an API
    const fetchInvoices = async () => {
      // In a real application, this would be an API call
      const mockInvoices: Invoice[] = [
        {
          id: "INV001",
          customerName: "Acme Corp",
          roomName: "Cold Storage A",
          amount: 1500,
          status: "pending",
          dueDate: "2023-04-15",
        },
        {
          id: "INV002",
          customerName: "TechStart Inc",
          roomName: "Dry Storage B",
          amount: 1200,
          status: "paid",
          dueDate: "2023-04-10",
        },
        {
          id: "INV003",
          customerName: "Green Farms Ltd",
          roomName: "Climate Controlled C",
          amount: 1800,
          status: "pending",
          dueDate: "2023-04-20",
        },
      ]
      setInvoices(mockInvoices)
    }
    fetchInvoices()
  }, [])

  const generateInvoices = async () => {
    // In a real application, this would trigger the invoice generation process
    if (!selectedMonth) {
      alert("Please select a month before generating invoices.")
      return
    }
    const selectedCustomerNames = mockCustomers
      .filter((customer) => selectedCustomers.includes(customer.id))
      .map((customer) => customer.name)
    alert(`Generating invoices for ${selectedMonth} for customers: ${selectedCustomerNames.join(", ")}`)
    // After generation, you would typically refresh the invoice list
    // setInvoices(newlyGeneratedInvoices)
  }

  const selectAllBillableCustomers = () => {
    const billableCustomerIds = mockCustomers
      .filter((customer) => customer.type === "Type2" || customer.type === "Type4")
      .map((customer) => customer.id)
    setSelectedCustomers(billableCustomerIds)
    return billableCustomerIds
  }

  const handleSaveTemplate = (templateName: string, template: string, customerType: string) => {
    setInvoiceTemplates([...invoiceTemplates, { name: templateName, content: template, customerType }])
  }

  if (userType !== "warehouseOwner") {
    return <div className="container mx-auto p-4">You do not have permission to view this page.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">myAdmin - Invoice Management</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Monthly Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Select Month</SelectItem>
                    <SelectItem value="2023-03">March 2023</SelectItem>
                    <SelectItem value="2023-04">April 2023</SelectItem>
                    <SelectItem value="2023-05">May 2023</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={generateInvoices}>Generate Invoices</Button>
              </div>
              <Select
                value={selectedCustomers.length > 0 ? "custom" : ""}
                onValueChange={(value) => {
                  if (value === "all") {
                    selectAllBillableCustomers()
                  } else if (value === "clear") {
                    setSelectedCustomers([])
                  }
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select customers">
                    {selectedCustomers.length > 0 ? `${selectedCustomers.length} selected` : "Select customers"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select All Billable</SelectItem>
                  <SelectItem value="clear">Clear Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {invoiceTemplates.map((template, index) => (
                    <SelectItem key={index} value={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setIsTemplateDialogOpen(true)}>Create New Template</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{invoice.roomName}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <InvoiceTemplateDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        onSaveTemplate={handleSaveTemplate}
      />
    </div>
  )
}

