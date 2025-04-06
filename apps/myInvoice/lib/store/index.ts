// This file exports all stores for easy imports
// Using absolute paths to avoid path resolution issues
import { useCustomerStore } from "@/lib/store/useCustomerStore"
import { useInvoiceStore } from "@/lib/store/useInvoiceStore"
import { useUIStore } from "@/lib/store/useUIStore"

export { useCustomerStore, useInvoiceStore, useUIStore }

