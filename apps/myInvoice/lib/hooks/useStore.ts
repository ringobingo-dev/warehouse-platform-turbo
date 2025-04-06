import { useCustomerStore, useInvoiceStore, useUIStore } from "@/lib/store"

// This hook combines all our stores for easier access
export function useStore() {
  const customer = useCustomerStore()
  const invoice = useInvoiceStore()
  const ui = useUIStore()

  return {
    customer,
    invoice,
    ui,
  }
}

