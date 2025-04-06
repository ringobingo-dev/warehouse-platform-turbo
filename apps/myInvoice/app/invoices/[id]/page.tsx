"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StorageVisualization } from "@/components/storage-visualization"
import { ArrowLeft, Download, Mail, Printer, Share2 } from "lucide-react"

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("details")

  // Mock invoice data
  const invoice = {
    id: params.id,
    customer: "Acme Inc.",
    customerEmail: "billing@acmeinc.com",
    customerAddress: "123 Main St, San Francisco, CA 94105",
    date: "2023-03-01",
    dueDate: "2023-03-15",
    status: "paid",
    amount: 1250.0,
    items: [
      {
        id: 1,
        description: "Storage Fee - Room A101",
        quantity: 30,
        unit: "days",
        rate: 25.0,
        amount: 750.0,
      },
      {
        id: 2,
        description: "Handling Fee - Inbound",
        quantity: 10,
        unit: "boxes",
        rate: 15.0,
        amount: 150.0,
      },
      {
        id: 3,
        description: "Handling Fee - Outbound",
        quantity: 5,
        unit: "boxes",
        rate: 20.0,
        amount: 100.0,
      },
      {
        id: 4,
        description: "Climate Control Premium",
        quantity: 30,
        unit: "days",
        rate: 8.33,
        amount: 250.0,
      },
    ],
    subtotal: 1250.0,
    tax: 0.0,
    total: 1250.0,
    notes: "Payment due within 15 days. Late payments subject to a 5% fee.",
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title={`Invoice ${invoice.id}`}
        description={`Issued to ${invoice.customer}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email Invoice</span>
            </Button>
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print Invoice</span>
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download Invoice</span>
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share Invoice</span>
            </Button>
            <Button>Mark as Paid</Button>
          </div>
        }
        backLink={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/invoices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Link>
          </Button>
        }
      />
      <div className="p-4">
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Invoice Details</TabsTrigger>
            <TabsTrigger value="storage">Storage Visualization</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Information</CardTitle>
                  <CardDescription>Details about this invoice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                        <p>{invoice.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "success"
                              : invoice.status === "pending"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                        <p>{invoice.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                        <p>{invoice.dueDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Customer</p>
                      <p>{invoice.customer}</p>
                      <p>{invoice.customerEmail}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customerAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>Summary of charges and payment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Subtotal</p>
                      <p>${invoice.subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Tax</p>
                      <p>${invoice.tax.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <p className="text-base font-medium">Total</p>
                      <p className="text-xl font-bold">${invoice.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">{invoice.notes}</p>
                </CardFooter>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Invoice Items</CardTitle>
                  <CardDescription>Detailed breakdown of charges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted text-xs uppercase">
                        <tr>
                          <th className="px-4 py-2">Description</th>
                          <th className="px-4 py-2 text-right">Quantity</th>
                          <th className="px-4 py-2 text-right">Unit</th>
                          <th className="px-4 py-2 text-right">Rate</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="px-4 py-3">{item.description}</td>
                            <td className="px-4 py-3 text-right">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">{item.unit}</td>
                            <td className="px-4 py-3 text-right">${item.rate.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="bg-muted/50">
                          <td colSpan={4} className="px-4 py-3 text-right font-medium">
                            Subtotal
                          </td>
                          <td className="px-4 py-3 text-right font-medium">${invoice.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td colSpan={4} className="px-4 py-3 text-right font-medium">
                            Tax
                          </td>
                          <td className="px-4 py-3 text-right font-medium">${invoice.tax.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td colSpan={4} className="px-4 py-3 text-right font-medium">
                            Total
                          </td>
                          <td className="px-4 py-3 text-right font-bold">${invoice.total.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="storage">
            <Card>
              <CardHeader>
                <CardTitle>Storage Visualization</CardTitle>
                <CardDescription>3D visualization of storage usage for this invoice period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full">
                  <StorageVisualization invoiceId={invoice.id} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>History of payments for this invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-xs uppercase">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Transaction ID</th>
                        <th className="px-4 py-2">Method</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3">2023-03-10</td>
                        <td className="px-4 py-3">TRX-12345</td>
                        <td className="px-4 py-3">Credit Card</td>
                        <td className="px-4 py-3 text-right">${invoice.total.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <Badge variant="success">Successful</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

