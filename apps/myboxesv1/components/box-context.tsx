"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react"

interface BoxContextProps {
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
}

const BoxContext = createContext<BoxContextProps | undefined>(undefined)

interface BoxProviderProps {
  children: ReactNode
}

export const BoxProvider: React.FC<BoxProviderProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false)

  return <BoxContext.Provider value={{ isDragging, setIsDragging }}>{children}</BoxContext.Provider>
}

export const useBoxContext = () => {
  const context = useContext(BoxContext)
  if (!context) {
    throw new Error("useBoxContext must be used within a BoxProvider")
  }
  return context
}

