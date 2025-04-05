"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Download, Filter, MoreHorizontal, Plus, Search, Trash2, UserCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Update the mock customer data to include the new type names and add a Type 3 customer
const customers = [
  {
    id: "CUST-001",
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    type: "rental",
    address: "123 Business Ave, New York, NY 10001",
    createdAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "CUST-002",
    name: "TechSolutions Inc.",
    email: "info@techsolutions.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    type: "logistics",
    address: "456 Tech Blvd, San Francisco, CA 94107",
    createdAt: "2023-02-20T10:15:00Z",
  },
  {
    id: "CUST-003",
    name: "Global Farms Ltd.",
    email: "contact@globalfarms.com",
    phone: "+1 (555) 456-7890",
    status: "pending",
    type: "rental",
    address: "789 Rural Road, Chicago, IL 60601",
    createdAt: "2023-03-05T14:45:00Z",
  },
  {
    id: "CUST-004",
    name: "City Storage Solutions",
    email: "info@citystorage.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    type: "rental",
    address: "321 Warehouse St, Dallas, TX 75201",
    createdAt: "2023-04-10T09:20:00Z",
  },
  {
    id: "CUST-005",
    name: "Fresh Produce Distributors",
    email: "sales@freshproduce.com",
    phone: "+1 (555) 876-5432",
    status: "pending",
    type: "logistics",
    address: "654 Market Ave, Seattle, WA 98101",
    createdAt: "2023-05-15T11:30:00Z",
  },
  {
    id: "CUST-006",
    name: "Retail Goods Marketplace",
    email: "info@retailgoods.com",
    phone: "+1 (555) 321-9876",
    status: "active",
    type: "merchant",
    address: "987 Commerce St, Austin, TX 78701",
    createdAt: "2023-06-22T13:45:00Z",
  },
  {
    id: "CUST-007",
    name: "Online Sellers Group",
    email: "contact@onlinesellers.com",
    phone: "+1 (555) 654-3210",
    status: "active",
    type: "merchant",
    address: "456 Digital Ave, Portland, OR 97201",
    createdAt: "2023-07-18T10:30:00Z",
  },
]

export default function CustomersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Update the filter logic to handle the new type names
  const filteredCustomers = customers.filter((customer) => {
    // Filter by tab
    if (activeTab === "active" && customer.status !== "active") return false
    if (activeTab === "pending" && customer.status !== "pending") return false
    if (activeTab === "rental" && customer.type !== "rental") return false
    if (activeTab === "logistics" && customer.type !== "logistics") return false
    if (activeTab === "merchant" && customer.type !== "merchant") return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => router.push("/customers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>View and manage all your warehouse customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Date Added</DropdownMenuItem>
                  <DropdownMenuItem>Customer Type</DropdownMenuItem>
                  <DropdownMenuItem>Status</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Customers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rental">Rental Customers</TabsTrigger>
              <TabsTrigger value="logistics">Logistics Partners</TabsTrigger>
              <TabsTrigger value="merchant">Merchant Customers</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No customers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {customer.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{customer.email}</div>
                            <div className="text-sm text-muted-foreground">{customer.phone}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={customer.status === "active" ? "default" : "outline"}>
                              {customer.status === "active" ? "Active" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {customer.type === "rental"
                                ? "Rental Customer"
                                : customer.type === "logistics"
                                  ? "Logistics Partner"
                                  : "Merchant Customer"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(customer.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}`)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}/edit`)}>
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Edit Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Customer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

