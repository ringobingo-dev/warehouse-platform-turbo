"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { StorageStrategy, StorageType } from "./storage-strategy"
import { LocalStorageStrategy } from "./local-storage-strategy"
import { FileBasedStrategy } from "./file-based-strategy"

interface StorageContextType {
  storageStrategy: StorageStrategy
  storageType: StorageType
  setStorageType: (type: StorageType) => void
  isLoading: boolean
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: React.ReactNode }) {
  // Get initial storage type from localStorage or default to localStorage
  const [storageType, setStorageType] = useState<StorageType>("localStorage")
  const [storageStrategy, setStorageStrategy] = useState<StorageStrategy>(new LocalStorageStrategy())
  const [isLoading, setIsLoading] = useState(true)

  // Initialize storage type from localStorage
  useEffect(() => {
    const savedType = localStorage.getItem("preferred-storage-type") as StorageType
    if (savedType && (savedType === "localStorage" || savedType === "fileSystem")) {
      setStorageType(savedType)
    }
    setIsLoading(false)
  }, [])

  // Update the strategy when storage type changes
  useEffect(() => {
    if (isLoading) return

    const newStrategy = storageType === "localStorage" ? new LocalStorageStrategy() : new FileBasedStrategy()

    setStorageStrategy(newStrategy)
    localStorage.setItem("preferred-storage-type", storageType)

    console.log(`Storage strategy changed to: ${storageType}`)
  }, [storageType, isLoading])

  const handleSetStorageType = (type: StorageType) => {
    if (type !== storageType) {
      setStorageType(type)
    }
  }

  return (
    <StorageContext.Provider
      value={{
        storageStrategy,
        storageType,
        setStorageType: handleSetStorageType,
        isLoading,
      }}
    >
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}

