"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/page-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, MapPin, Phone, User, Edit, Trash2 } from "lucide-react"
import { UserModule } from "@/components/user-management/user-module"
import { useToast } from "@/components/ui/use-toast"

// NOTE: This will be replaced with data from PostgreSQL
// The customer data will be fetched from the database using a server action or API route
const getCustomerById = (id: string) => {
  // This is mock data - in production this would be a database query
  const mockCustomers = [
    {
      id: "cust-001",
      type: "type2",
      name: "Harvest Valley Farms",
      address: "4578 Orchard Lane",
      zip: "83686",
      city: "Nampa",
      state: "Idaho",
      country: "New Zealand",
      email: "accounts@harvestvalley.com",
      phone: "+1 (208) 555-4321",
      contactPerson: "Sarah Johnson",
      notes: "Stores seasonal produce and equipment",
      status: "approved",
      totalInvoices: 12,
      totalSpent: 8750.5,
      customerSince: "2023-01-15",
      lastInvoice: "2023-12-10",
    },
    // Other customers would be here
  ]

  return mockCustomers.find((customer) => customer.id === id) || null
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // In production, this would be a server action or API call
  const customer = getCustomerById(params.id)

  // Handle user changes
  const handleUserChange = () => {
    setRefreshTrigger((prev) => prev + 1)
    toast({
      title: "User updated",
      description: "User information has been updated successfully",
    })
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-semibold">Customer not found</h2>
        <p className="text-muted-foreground">The customer you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/customers">Back to Customers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title={customer.name}
        description={`${customer.type === "type1" ? "Individual" : "Business"} Customer`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
        backLink={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>
        }
      />

      <PageContainer>
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.contactPerson}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{customer.address}</p>
                  <p>
                    {customer.city}, {customer.state} {customer.zip}
                  </p>
                  <p>{customer.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={customer.status === "approved" ? "success" : "outline"}>
                    {customer.status === "approved" ? "Active" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Customer Since:</span>
                  <span>{new Date(customer.customerSince).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Invoice:</span>
                  <span>{new Date(customer.lastInvoice).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Invoices:</span>
                  <span>{customer.totalInvoices}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span>${customer.totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Customer Overview</CardTitle>
                <CardDescription>Summary of customer activity and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-muted-foreground">{customer.notes}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Recent Activity</h3>
                    <p className="text-muted-foreground">No recent activity to display.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <UserModule
                  customer={customer}
                  onUserChange={handleUserChange}
                  key={`user-module-${refreshTrigger}`} // Force re-render when users change
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Customer invoice history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  Invoice data will be loaded from PostgreSQL
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card>
              <CardHeader>
                <CardTitle>Storage</CardTitle>
                <CardDescription>Customer storage information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  Storage data will be loaded from PostgreSQL
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Customer notes and additional information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">Notes data will be loaded from PostgreSQL</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  )
}

