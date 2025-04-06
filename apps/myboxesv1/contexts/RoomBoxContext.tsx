"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from "react"

// Changed from BoxContextType to RoomBoxContextType for better clarity and to avoid confusion with the complex context
interface RoomBoxContextType {
  rows: number
  columns: number
  stackHeight: number
  setRows: (rows: number) => void
  setColumns: (columns: number) => void
  setStackHeight: (stackHeight: number) => void
}

// Default context with no-op functions
// Updated to use RoomBoxContextType instead of BoxContextType
const defaultContext: RoomBoxContextType = {
  rows: 3,
  columns: 3,
  stackHeight: 3,
  setRows: () => {},
  setColumns: () => {},
  setStackHeight: () => {},
}

// Create context with a more descriptive name
// Changed from BoxContext to RoomBoxContext for better clarity
const RoomBoxContext = createContext<RoomBoxContextType>(defaultContext)

// Custom hook with error handling
// Changed from useBoxContext to useRoomBoxContext for better clarity
export const useRoomBoxContext = () => {
  const context = useContext(RoomBoxContext)

  if (!context) {
    console.error("useRoomBoxContext must be used within a RoomBoxProvider")
    return defaultContext
  }

  return context
}

// Changed from BoxProviderProps to RoomBoxProviderProps for consistency
interface RoomBoxProviderProps {
  children: ReactNode
  // Updated to use RoomBoxContextType instead of BoxContextType
  initialValues?: Partial<Omit<RoomBoxContextType, "setRows" | "setColumns" | "setStackHeight">>
}

// Changed from BoxProvider to RoomBoxProvider for better clarity
export const RoomBoxProvider: React.FC<RoomBoxProviderProps> = ({ children, initialValues = {} }) => {
  // Use state with safe defaults
  const [rows, setRows] = useState(initialValues.rows ?? defaultContext.rows)
  const [columns, setColumns] = useState(initialValues.columns ?? defaultContext.columns)
  const [stackHeight, setStackHeight] = useState(initialValues.stackHeight ?? defaultContext.stackHeight)

  // Debug logging
  useEffect(() => {
    console.log("RoomBoxProvider initialized with:", { rows, columns, stackHeight })
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

  return <RoomBoxContext.Provider value={value}>{children}</RoomBoxContext.Provider>
}

