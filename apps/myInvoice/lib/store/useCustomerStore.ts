import { create } from "zustand"
import type { Customer, CustomerWithUsers } from "@/lib/types/customer"
import type { UserInvitation } from "@/lib/types/user"

interface CustomerState {
  customers: CustomerWithUsers[]
  selectedCustomer: CustomerWithUsers | null
  isInitialized: boolean
  isLoading: boolean
  isFetchingCustomers: boolean
  isFetchingCustomer: boolean
  isCreatingCustomer: boolean
  isUpdatingCustomer: boolean
  isDeletingCustomer: boolean
  isInvitingUser: boolean
  error: string | null
  lastUpdated: string | null

  // Actions
  initialize: () => Promise<void>
  fetchCustomers: () => Promise<void>
  fetchCustomerById: (id: string) => Promise<void>
  createCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => Promise<CustomerWithUsers>
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<CustomerWithUsers | null>
  deleteCustomer: (id: string) => Promise<void>

  // User management within customer
  inviteUser: (customerId: string, email: string, role: string) => Promise<void>
  fetchCustomerUsers: (customerId: string) => Promise<void>
  fetchCustomerInvitations: (customerId: string) => Promise<void>

  // Utility
  clearError: () => void
  setSelectedCustomer: (customer: CustomerWithUsers | null) => void
}

// Mock function to get customers - replace with actual API calls later
const fetchCustomersFromAPI = async (): Promise<CustomerWithUsers[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
          createdAt: "2023-01-15T00:00:00Z",
          updatedAt: "2023-06-10T00:00:00Z",
          users: [
            {
              id: "user-002",
              email: "sarah@harvestvalley.com",
              firstName: "Sarah",
              lastName: "Johnson",
              role: "customer_admin",
              status: "active",
              customerId: "cust-001",
              createdAt: "2023-01-15T00:00:00Z",
              updatedAt: "2023-01-15T00:00:00Z",
            },
          ],
        },
      ])
    }, 500)
  })
}

export const useCustomerStore = create<CustomerState>()((set, get) => ({
  customers: [],
  selectedCustomer: null,
  isInitialized: false,
  isLoading: false,
  isFetchingCustomers: false,
  isFetchingCustomer: false,
  isCreatingCustomer: false,
  isUpdatingCustomer: false,
  isDeletingCustomer: false,
  isInvitingUser: false,
  error: null,
  lastUpdated: null,

  initialize: async () => {
    // Only initialize once
    if (get().isInitialized) return

    set({ isLoading: true, error: null })
    try {
      await get().fetchCustomers()
      set({
        isInitialized: true,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to initialize customer store:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to initialize customer store",
        isLoading: false,
        isInitialized: true, // Still mark as initialized to prevent infinite loops
      })
    }
  },

  fetchCustomers: async () => {
    set({ isFetchingCustomers: true, error: null })
    try {
      const customers = await fetchCustomersFromAPI()
      set({
        customers,
        isFetchingCustomers: false,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to fetch customers",
        isFetchingCustomers: false,
      })
      throw error
    }
  },

  fetchCustomerById: async (id: string) => {
    set({ isFetchingCustomer: true, error: null })
    try {
      // First check if we already have this customer in state
      const { customers } = get()
      let customer = customers.find((c) => c.id === id)

      if (!customer) {
        // If not in state, fetch from API
        const allCustomers = await fetchCustomersFromAPI()
        customer = allCustomers.find((c) => c.id === id) || null

        // Update all customers in state
        set({
          customers: allCustomers,
          lastUpdated: new Date().toISOString(),
        })
      }

      set({
        selectedCustomer: customer,
        isFetchingCustomer: false,
      })

      if (!customer) {
        set({ error: `Customer ${id} not found` })
      }

      return customer
    } catch (error) {
      console.error(`Failed to fetch customer ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : `Failed to fetch customer ${id}`,
        isFetchingCustomer: false,
      })
      throw error
    }
  },

  createCustomer: async (customer) => {
    set({ isCreatingCustomer: true, error: null })
    try {
      // Simulate API call
      const newCustomer: CustomerWithUsers = {
        ...customer,
        id: `cust-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        users: [],
      }

      const { customers } = get()
      set({
        customers: [...customers, newCustomer],
        selectedCustomer: newCustomer,
        isCreatingCustomer: false,
        lastUpdated: new Date().toISOString(),
      })

      return newCustomer
    } catch (error) {
      console.error("Failed to create customer:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to create customer",
        isCreatingCustomer: false,
      })
      throw error
    }
  },

  updateCustomer: async (id, data) => {
    set({ isUpdatingCustomer: true, error: null })
    try {
      const { customers, selectedCustomer } = get()

      // Find the customer to update
      const customerToUpdate = customers.find((c) => c.id === id)
      if (!customerToUpdate) {
        set({
          error: `Customer ${id} not found`,
          isUpdatingCustomer: false,
        })
        return null
      }

      // Update customer in the list
      const updatedCustomers = customers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : customer,
      )

      // Update selected customer if it's the one being updated
      const updatedSelectedCustomer =
        selectedCustomer?.id === id
          ? { ...selectedCustomer, ...data, updatedAt: new Date().toISOString() }
          : selectedCustomer

      set({
        customers: updatedCustomers,
        selectedCustomer: updatedSelectedCustomer as CustomerWithUsers | null,
        isUpdatingCustomer: false,
        lastUpdated: new Date().toISOString(),
      })

      return updatedSelectedCustomer as CustomerWithUsers
    } catch (error) {
      console.error(`Failed to update customer ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : `Failed to update customer ${id}`,
        isUpdatingCustomer: false,
      })
      throw error
    }
  },

  deleteCustomer: async (id) => {
    set({ isDeletingCustomer: true, error: null })
    try {
      const { customers, selectedCustomer } = get()

      // Check if customer exists
      const customerExists = customers.some((c) => c.id === id)
      if (!customerExists) {
        set({
          error: `Customer ${id} not found`,
          isDeletingCustomer: false,
        })
        return
      }

      // Remove customer from the list
      const updatedCustomers = customers.filter((customer) => customer.id !== id)

      // Clear selected customer if it's the one being deleted
      const updatedSelectedCustomer = selectedCustomer?.id === id ? null : selectedCustomer

      set({
        customers: updatedCustomers,
        selectedCustomer: updatedSelectedCustomer,
        isDeletingCustomer: false,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error(`Failed to delete customer ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : `Failed to delete customer ${id}`,
        isDeletingCustomer: false,
      })
      throw error
    }
  },

  inviteUser: async (customerId, email, role) => {
    set({ isInvitingUser: true, error: null })
    try {
      // Check if customer exists
      const { customers } = get()
      const customerExists = customers.some((c) => c.id === customerId)
      if (!customerExists) {
        set({
          error: `Customer ${customerId} not found`,
          isInvitingUser: false,
        })
        return
      }

      // Simulate API call
      const invitation: UserInvitation = {
        id: `inv-${Date.now()}`,
        email,
        role,
        customerId,
        invitedBy: "current-user-id", // This would come from auth store
        status: "pending",
        token: `token-${Math.random().toString(36).substring(2, 15)}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      }

      // In a real implementation, you would update the customer's invitations
      set({
        isInvitingUser: false,
        lastUpdated: new Date().toISOString(),
      })

      return invitation
    } catch (error) {
      console.error("Failed to invite user:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to invite user",
        isInvitingUser: false,
      })
      throw error
    }
  },

  fetchCustomerUsers: async (customerId) => {
    // Implementation would fetch users for a specific customer
    // and update the customer in the state
    set({ isLoading: true, error: null })
    try {
      // Check if customer exists
      const { customers } = get()
      const customerExists = customers.some((c) => c.id === customerId)
      if (!customerExists) {
        set({
          error: `Customer ${customerId} not found`,
          isLoading: false,
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      set({
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error(`Failed to fetch users for customer ${customerId}:`, error)
      set({
        error: error instanceof Error ? error.message : `Failed to fetch users for customer ${customerId}`,
        isLoading: false,
      })
      throw error
    }
  },

  fetchCustomerInvitations: async (customerId) => {
    // Implementation would fetch invitations for a specific customer
    set({ isLoading: true, error: null })
    try {
      // Check if customer exists
      const { customers } = get()
      const customerExists = customers.some((c) => c.id === customerId)
      if (!customerExists) {
        set({
          error: `Customer ${customerId} not found`,
          isLoading: false,
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      set({
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error(`Failed to fetch invitations for customer ${customerId}:`, error)
      set({
        error: error instanceof Error ? error.message : `Failed to fetch invitations for customer ${customerId}`,
        isLoading: false,
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),

  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}))

