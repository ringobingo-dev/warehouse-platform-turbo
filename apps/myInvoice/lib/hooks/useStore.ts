import { useAuthStore, useCustomerStore, useInvoiceStore, useUIStore } from "@/lib/store"

// This hook combines all our stores for easier access
export function useStore() {
  const auth = useAuthStore()
  const customer = useCustomerStore()
  const invoice = useInvoiceStore()
  const ui = useUIStore()

  return {
    auth,
    customer,
    invoice,
    ui,
  }
}

