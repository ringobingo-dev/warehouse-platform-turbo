"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useCustomerStore } from "@/lib/store/useCustomerStore"
import { useInvoiceStore } from "@/lib/store/useInvoiceStore"
import { useUIStore } from "@/lib/store/useUIStore"

export function useInitializeStores() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeAuth = useAuthStore((state) => state.initialize)
  const initializeCustomers = useCustomerStore((state) => state.initialize)
  const initializeInvoices = useInvoiceStore((state) => state.initialize)
  const initializeUI = useUIStore((state) => state.initialize)

  const authError = useAuthStore((state) => state.error)
  const customerError = useCustomerStore((state) => state.error)
  const invoiceError = useInvoiceStore((state) => state.error)
  const uiError = useUIStore((state) => state.error)

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize UI first as it doesn't depend on other stores
        initializeUI()

        // Initialize auth store
        await initializeAuth()

        // Initialize data stores
        await Promise.all([initializeCustomers(), initializeInvoices()])

        setIsInitialized(true)
      } catch (err) {
        console.error("Failed to initialize stores:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize application")
      }
    }

    initialize()
  }, [initializeAuth, initializeCustomers, initializeInvoices, initializeUI])

  // Collect any errors from stores
  useEffect(() => {
    const errors = [authError, customerError, invoiceError, uiError].filter(Boolean)
    if (errors.length > 0) {
      setError(errors.join(", "))
    } else {
      setError(null)
    }
  }, [authError, customerError, invoiceError, uiError])

  return { isInitialized, error }
}

