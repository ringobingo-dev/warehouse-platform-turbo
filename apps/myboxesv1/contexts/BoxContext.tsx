"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from "react"

interface BoxContextType {
  rows: number
  columns: number
  stackHeight: number
  setRows: (rows: number) => void
  setColumns: (columns: number) => void
  setStackHeight: (stackHeight: number) => void
}

// Default context with no-op functions
const defaultContext: BoxContextType = {
  rows: 3,
  columns: 3,
  stackHeight: 3,
  setRows: () => {},
  setColumns: () => {},
  setStackHeight: () => {},
}

// Create context with a more descriptive name
const BoxContext = createContext<BoxContextType>(defaultContext)

// Custom hook with error handling
export const useBoxContext = () => {
  const context = useContext(BoxContext)

  if (!context) {
    console.error("useBoxContext must be used within a BoxProvider")
    return defaultContext
  }

  return context
}

interface BoxProviderProps {
  children: ReactNode
  initialValues?: Partial<Omit<BoxContextType, "setRows" | "setColumns" | "setStackHeight">>
}

export const BoxProvider: React.FC<BoxProviderProps> = ({ children, initialValues = {} }) => {
  // Use state with safe defaults
  const [rows, setRows] = useState(initialValues.rows ?? defaultContext.rows)
  const [columns, setColumns] = useState(initialValues.columns ?? defaultContext.columns)
  const [stackHeight, setStackHeight] = useState(initialValues.stackHeight ?? defaultContext.stackHeight)

  // Debug logging
  useEffect(() => {
    console.log("BoxProvider initialized with:", { rows, columns, stackHeight })
  }, [rows, columns, stackHeight])

  // Create memoized context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      rows,
      columns,
      stackHeight,
      setRows,
      setColumns,
      setStackHeight,
    }),
    [rows, columns, stackHeight],
  )

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>
}

