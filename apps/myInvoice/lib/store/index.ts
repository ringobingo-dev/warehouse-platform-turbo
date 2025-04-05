// This file exports all stores for easy imports
// Using absolute paths to avoid path resolution issues
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useCustomerStore } from "@/lib/store/useCustomerStore"
import { useInvoiceStore } from "@/lib/store/useInvoiceStore"
import { useUIStore } from "@/lib/store/useUIStore"

export { useAuthStore, useCustomerStore, useInvoiceStore, useUIStore }

