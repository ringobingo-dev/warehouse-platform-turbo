"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  User,
  DollarSign,
  Tag,
  Clock,
  CalendarIcon,
  CheckIcon,
  X,
  AlertCircle,
  Send,
  CheckSquare,
} from "lucide-react"
import { PageContainer } from "@/components/page-container"
import { useInvoiceStore } from "@/lib/store"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parse, isValid } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// NOTE: All invoices will be stored on S3 for persistence and retrieval
// Integration with S3 should handle upload, download, and versioning of invoice PDFs

// NOTE: Paid and Overdue status tracking will be implemented with Xero API integration
// This will enable automatic reconciliation and payment status tracking in a future update

// Mock data for demonstration - in a real app, this would come from the API
const MOCK_PREPOPULATED_INVOICES = [
  {
    id: "INV-2023-03",
    customer: "Acme Farms",
    email: "billing@acmefarms.com",
    date: "2023-03-01",
    dueDate: "2023-03-15",
    amount: 1250.0,
    tax: 125.0,
    status: "pending",
    items: [{ name: "Storage - March 2023", quantity: 1, price: 1250.0 }],
    prepopulated: true,
    manual: false,
    notes: "Monthly storage charges",
  },
  {
    id: "INV-2023-04",
    customer: "Globex Agriculture",
    email: "accounts@globexag.com",
    date: "2023-03-01",
    dueDate: "2023-03-15",
    amount: 945.5,
    tax: 94.55,
    status: "pending",
    items: [{ name: "Storage - March 2023", quantity: 1, price: 945.5 }],
    prepopulated: true,
    manual: false,
    notes: "Monthly storage charges",
  },
  {
    id: "INV-2023-05",
    customer: "Harvest Valley Farms",
    email: "billing@harvestvalley.com",
    date: "2023-04-01",
    dueDate: "2023-04-15",
    amount: 1875.0,
    tax: 187.5,
    status: "pending",
    items: [{ name: "Storage - April 2023", quantity: 1, price: 1875.0 }],
    prepopulated: false,
    manual: true,
    notes: "Custom storage arrangement",
  },
  {
    id: "INV-2023-06",
    customer: "Green Fields Co-op",
    email: "accounts@greenfields.com",
    date: "2023-04-05",
    dueDate: "2023-04-20",
    amount: 1250.0,
    tax: 125.0,
    status: "pending",
    items: [{ name: "Storage - April 2023", quantity: 1, price: 1250.0 }],
    prepopulated: false,
    manual: true,
    notes: "Additional storage space",
  },
]

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const router = useRouter()
  const { invoices: storeInvoices, isLoading, error, fetchInvoices, filterByStatus } = useInvoiceStore()
  const [activeTab, setActiveTab] = useState("all")

  // Combine store invoices with mock prepopulated invoices for demonstration
  const invoices = [...storeInvoices, ...MOCK_PREPOPULATED_INVOICES]

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  // Filter invoices by search query and date
  const filteredInvoices = invoices.filter((invoice) => {
    // Search filter
    const matchesSearch =
      invoice.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Date filter
    let matchesDate = true
    if (selectedYear || selectedMonth) {
      const invoiceDate = parse(invoice.date, "yyyy-MM-dd", new Date())

      if (isValid(invoiceDate)) {
        if (selectedYear && selectedMonth) {
          // Filter by both year and month
          matchesDate =
            invoiceDate.getFullYear() === Number.parseInt(selectedYear) &&
            invoiceDate.getMonth() === Number.parseInt(selectedMonth) - 1
        } else if (selectedYear) {
          // Filter by year only
          matchesDate = invoiceDate.getFullYear() === Number.parseInt(selectedYear)
        } else if (selectedMonth) {
          // Filter by month only
          matchesDate = invoiceDate.getMonth() === Number.parseInt(selectedMonth) - 1
        }
      }
    }

    return matchesSearch && matchesDate
  })

  const pendingInvoices = filteredInvoices.filter((invoice) => invoice.status === "pending")

  // Get prepopulated invoices that need review
  const prepopulatedInvoices = filteredInvoices.filter((invoice) => invoice.prepopulated === true)

  // Generate years (last 5 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

  // Generate months
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  // Clear date filters
  const clearDateFilters = () => {
    setSelectedYear(null)
    setSelectedMonth(null)
  }

  // Toggle invoice selection
  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId],
    )
  }

  // Toggle all invoices selection
  const toggleAllInvoices = (invoices: any[]) => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(invoices.map((invoice) => invoice.id))
    }
  }

  // Approve selected invoices
  const approveSelectedInvoices = () => {
    // In a real implementation, this would call an API to approve the invoices
    alert(`Approved ${selectedInvoices.length} invoices for posting to customers`)
    setSelectedInvoices([])
  }

  // Helper function to render the invoice table
  const renderInvoiceTable = (invoices: any[], title: string, showSelection = false) => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              {title}
              {(selectedYear || selectedMonth) && (
                <span className="ml-2">
                  (Filtered by: {selectedMonth && months.find((m) => m.value === selectedMonth)?.label} {selectedYear})
                </span>
              )}
            </CardDescription>
          </div>
          {showSelection && selectedInvoices.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedInvoices.length} selected</span>
              <Button size="sm" onClick={approveSelectedInvoices} className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                Approve & Send
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        {invoices.length === 0 ? (
          <div className="flex justify-center items-center h-24 text-muted-foreground">No invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {showSelection && (
                    <TableHead className="w-[5%]">
                      <Checkbox
                        checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                        onCheckedChange={() => toggleAllInvoices(invoices)}
                        aria-label="Select all invoices"
                      />
                    </TableHead>
                  )}
                  <TableHead className={showSelection ? "w-[12%]" : "w-[15%]"}>Invoice</TableHead>
                  <TableHead className="w-[20%]">Customer</TableHead>
                  <TableHead className="w-[15%]">Date</TableHead>
                  <TableHead className="w-[15%]">Amount</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[15%]">Items</TableHead>
                  <TableHead className="text-right w-[10%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className={`hover:bg-muted/50 ${selectedInvoices.includes(invoice.id) ? "bg-muted/50" : ""}`}
                  >
                    {showSelection && (
                      <TableCell>
                        <Checkbox
                          checked={selectedInvoices.includes(invoice.id)}
                          onCheckedChange={() => toggleInvoiceSelection(invoice.id)}
                          aria-label={`Select invoice ${invoice.id}`}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Link href={`/invoices/${invoice.id}`} className="font-medium hover:underline">
                          {invoice.id}
                        </Link>
                        {/* Extract month from date */}
                        <span className="text-xs text-muted-foreground">
                          {new Date(invoice.date).toLocaleString("default", { month: "short" })}
                        </span>
                        {invoice.prepopulated && !invoice.manual && (
                          <Badge variant="outline" className="ml-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                            Auto
                          </Badge>
                        )}
                        {invoice.manual && (
                          <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200">
                            Manual
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{invoice.customer}</div>
                          <div className="text-xs text-muted-foreground">{invoice.email || "No email"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{invoice.date}</div>
                          <div className="text-xs text-muted-foreground">Due: {invoice.dueDate || "No due date"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                          {invoice.tax && (
                            <div className="text-xs text-muted-foreground">Tax: ${invoice.tax.toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={invoice.status === "pending" ? "outline" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {invoice.status === "pending" ? "submitted" : invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{invoice.items?.length || 0} items</div>
                          {invoice.notes && (
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">{invoice.notes}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/invoices/${invoice.id}`)}>
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Invoice</DropdownMenuItem>
                            <DropdownMenuItem>Download PDF</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {invoice.prepopulated && (
                              <>
                                <DropdownMenuItem onClick={() => toggleInvoiceSelection(invoice.id)}>
                                  {selectedInvoices.includes(invoice.id) ? "Deselect" : "Select for Approval"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem>Send to Customer</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate Invoice</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Invoices"
        description="Manage and track all your warehouse invoices"
        actions={
          <Button onClick={() => router.push("/invoices/create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        }
      />
      <PageContainer className="max-w-full px-4">
        {/* Prepopulated Invoices Alert */}
        {prepopulatedInvoices.length > 0 && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Monthly Invoice Generation</AlertTitle>
            <AlertDescription className="text-blue-700">
              {prepopulatedInvoices.length} invoices have been automatically generated and need your review before
              sending to customers.
              <Button
                variant="outline"
                size="sm"
                className="ml-2 bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => setActiveTab("needs-review")}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Review Pending
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <TabsList>
              <TabsTrigger value="all">All Invoices</TabsTrigger>
              <TabsTrigger value="pending">Submitted</TabsTrigger>
              <TabsTrigger value="needs-review" className="relative">
                Pending Review
                {prepopulatedInvoices.length > 0 && (
                  <Badge className="ml-2 bg-blue-500">{prepopulatedInvoices.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedYear || selectedMonth ? (
                      <span className="hidden md:inline">
                        {selectedMonth && months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                      </span>
                    ) : (
                      <span className="hidden md:inline">Filter by Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter by Date</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="year" className="text-sm font-medium">
                          Year
                        </label>
                        <Select
                          value={selectedYear || ""}
                          onValueChange={(value) => setSelectedYear(value === "any" ? null : value)}
                        >
                          <SelectTrigger id="year">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any Year</SelectItem>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="month" className="text-sm font-medium">
                          Month
                        </label>
                        <Select
                          value={selectedMonth || ""}
                          onValueChange={(value) => setSelectedMonth(value === "any" ? null : value)}
                        >
                          <SelectTrigger id="month">
                            <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any Month</SelectItem>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDateFilters}
                        disabled={!selectedYear && !selectedMonth}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                      <Button size="sm">
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Other filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Amount</DropdownMenuItem>
                  <DropdownMenuItem>Customer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </div>

          {/* Active date filter indicator */}
          {(selectedYear || selectedMonth) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>
                Filtered by: {selectedMonth && months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
              </span>
              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={clearDateFilters}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="m-0">
                {renderInvoiceTable(filteredInvoices, "Year to Date")}
              </TabsContent>
              <TabsContent value="pending" className="m-0">
                {renderInvoiceTable(pendingInvoices, "Submitted Invoices")}
              </TabsContent>
              <TabsContent value="needs-review" className="m-0">
                {renderInvoiceTable(prepopulatedInvoices, "Invoices Pending Review", true)}
              </TabsContent>
            </>
          )}
        </Tabs>
      </PageContainer>
    </div>
  )
}

