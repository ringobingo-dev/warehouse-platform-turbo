import { create } from "zustand"

// Define the invoice interface
interface Invoice {
  id: string
  customer: string
  customerId: string
  amount: number
  status: "draft" | "pending" | "paid" | "overdue" | "canceled"
  date: string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

interface InvoiceItem {
  id: number
  description: string
  quantity: number
  unit: string
  rate: number
  amount: number
}

interface InvoiceState {
  invoices: Invoice[]
  selectedInvoice: Invoice | null
  isInitialized: boolean
  isLoading: boolean
  isFetchingInvoices: boolean
  isFetchingInvoice: boolean
  isCreatingInvoice: boolean
  isUpdatingInvoice: boolean
  isDeletingInvoice: boolean
  error: string | null
  statusFilter: string
  customerFilter: string | null
  dateRangeFilter: { startDate: Date | null; endDate: Date | null }
  lastUpdated: string | null

  // Actions
  initialize: () => Promise<void>
  fetchInvoices: () => Promise<void>
  fetchInvoiceById: (id: string) => Promise<Invoice | null>
  createInvoice: (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => Promise<Invoice>
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<Invoice | null>
  deleteInvoice: (id: string) => Promise<void>
  markAsPaid: (id: string) => Promise<Invoice | null>

  // Filters
  filterByStatus: (status: Invoice["status"] | "all") => void
  filterByCustomer: (customerId: string | null) => void
  filterByDateRange: (startDate: Date | null, endDate: Date | null) => void

  // Utility
  clearError: () => void
  setSelectedInvoice: (invoice: Invoice | null) => void
  getFilteredInvoices: () => Invoice[]
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    customer: "Acme Inc.",
    customerId: "cust-001",
    amount: 1250.0,
    status: "paid",
    date: "2023-03-01",
    dueDate: "2023-03-15",
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
    ],
    subtotal: 1250.0,
    tax: 0.0,
    total: 1250.0,
    notes: "Payment due within 15 days. Late payments subject to a 5% fee.",
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-03-01T00:00:00Z",
  },
  {
    id: "INV-002",
    customer: "Globex Corp",
    customerId: "cust-002",
    amount: 945.5,
    status: "pending",
    date: "2023-03-05",
    dueDate: "2023-03-20",
    items: [
      {
        id: 1,
        description: "Storage Fee - Room B201",
        quantity: 25,
        unit: "days",
        rate: 30.0,
        amount: 750.0,
      },
      {
        id: 2,
        description: "Handling Fee - Inbound",
        quantity: 5,
        unit: "boxes",
        rate: 15.0,
        amount: 75.0,
      },
    ],
    subtotal: 825.0,
    tax: 120.5,
    total: 945.5,
    createdAt: "2023-03-05T00:00:00Z",
    updatedAt: "2023-03-05T00:00:00Z",
  },
]

export const useInvoiceStore = create<InvoiceState>()((set, get) => ({
  invoices: [],
  selectedInvoice: null,
  isInitialized: false,
  isLoading: false,
  isFetchingInvoices: false,
  isFetchingInvoice: false,
  isCreatingInvoice: false,
  isUpdatingInvoice: false,
  isDeletingInvoice: false,
  error: null,
  statusFilter: "all",
  customerFilter: null,
  dateRangeFilter: { startDate: null, endDate: null },
  lastUpdated: null,

  initialize: async () => {
    // Only initialize once
    if (get().isInitialized) return

    set({ isLoading: true, error: null })
    try {
      await get().fetchInvoices()
      set({
        isInitialized: true,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to initialize invoice store:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to initialize invoice store",
        isLoading: false,
        isInitialized: true, // Still mark as initialized to prevent infinite loops
      })
    }
  },

  fetchInvoices: async () => {
    set({ isFetchingInvoices: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      set({
        invoices: mockInvoices,
        isFetchingInvoices: false,
        lastUpdated: new Date().toISOString(),
      })
      return mockInvoices
    } catch (error) {
      console.error("Failed to fetch invoices:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to fetch invoices",
        isFetchingInvoices: false,
      })
      throw error
    }
  },

  fetchInvoiceById: async (id: string) => {
    set({ isFetchingInvoice: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const invoice = mockInvoices.find((inv) => inv.id === id) || null
      set({
        selectedInvoice: invoice,
        isFetchingInvoice: false,
        lastUpdated: invoice ? new Date().toISOString() : get().lastUpdated,
      })

      if (!invoice) {
        set({ error: `Invoice ${id} not found` })
      }

      return invoice
    } catch (error) {
      console.error(`Failed to fetch invoice ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : `Failed to fetch invoice ${id}`,
        isFetchingInvoice: false,
      })
      throw error
    }
  },

  createInvoice: async (invoice) => {
    set({ isCreatingInvoice: true, error: null })
    try {
      // Validate required fields
      if (!invoice.customer || !invoice.customerId) {
        throw new Error("Customer information is required")
      }

      if (!invoice.items || invoice.items.length === 0) {
        throw new Error("At least one line item is required")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newInvoice: Invoice = {
        ...invoice,
        id: `INV-${Date.now().toString().slice(-3)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { invoices } = get()
      set({
        invoices: [...invoices, newInvoice],
        selectedInvoice: newInvoice,
        isCreatingInvoice: false,
        lastUpdated: new Date().toISOString(),
      })

      return newInvoice
    } catch (error) {
      console.error("Failed to create invoice:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to create invoice",
        isCreatingInvoice: false,
      })
      throw error
    }
  },

  updateInvoice: async (id, data) => {
    set({ isUpdatingInvoice: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const { invoices, selectedInvoice } = get()

      // Check if invoice exists
      const invoiceToUpdate = invoices.find((inv) => inv.id === id)
      if (!invoiceToUpdate) {
        set({
          error: `Invoice ${id} not found`,
          isUpdatingInvoice: false,
        })
        return null
      }

      // Update invoice in the list
      const updatedInvoices = invoices.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : invoice,
      )

      // Update selected invoice if it's the one being updated
      const updatedSelectedInvoice =
        selectedInvoice?.id === id
          ? { ...selectedInvoice, ...data, updatedAt: new Date().toISOString() }
          : selectedInvoice

      set({
        invoices: updatedInvoices,
        selectedInvoice: updatedSelectedInvoice,
        isUpdatingInvoice: false,
        lastUpdated: new Date().toISOString(),
      })

      return updatedSelectedInvoice as Invoice
    } catch (error) {
      console.error(`Failed to update invoice ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : `Failed to update invoice ${id}`,
        isUpdatingInvoice: false,
      })
      throw error
    }
  },

  deleteInvoice: async (id) => {
    set({ isDeletingInvoice: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const { invoices, selectedInvoice } = get()

      // Check if invoice exists
      const invoiceExists = invoices.some((inv) => inv.id === id)
      if (!invoiceExists) {
        set({
          error: `Invoice ${id} not found`,
          isDeletingInvoice: false,
        })
        return
      }

      // Remove invoice from the list
      const updatedInvoices = invoices.filter((invoice) => invoice.id !== id)

      // Clear selected invoice if it's the one being deleted
      const updatedSelectedInvoice = selectedInvoice?.id === id ? null : selectedInvoice

      set({
        invoices: updatedInvoices,
        selectedInvoice: updatedSelectedInvoice,
        isDeletingInvoice: false,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error(`Failed to delete invoice ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : `Failed to delete invoice ${id}`,
        isDeletingInvoice: false,
      })
      throw error
    }
  },

  markAsPaid: async (id) => {
    return get().updateInvoice(id, { status: "paid" })
  },

  filterByStatus: (status) => {
    set({ statusFilter: status })
  },

  filterByCustomer: (customerId) => {
    set({ customerFilter: customerId })
  },

  filterByDateRange: (startDate, endDate) => {
    set({
      dateRangeFilter: { startDate, endDate },
    })
  },

  clearError: () => set({ error: null }),

  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),

  getFilteredInvoices: () => {
    const { invoices, statusFilter, customerFilter, dateRangeFilter } = get()

    return invoices.filter((invoice) => {
      // Filter by status
      if (statusFilter !== "all" && invoice.status !== statusFilter) {
        return false
      }

      // Filter by customer
      if (customerFilter && invoice.customerId !== customerFilter) {
        return false
      }

      // Filter by date range
      if (dateRangeFilter.startDate || dateRangeFilter.endDate) {
        const invoiceDate = new Date(invoice.date)

        if (dateRangeFilter.startDate && invoiceDate < dateRangeFilter.startDate) {
          return false
        }

        if (dateRangeFilter.endDate && invoiceDate > dateRangeFilter.endDate) {
          return false
        }
      }

      return true
    })
  },
}))

