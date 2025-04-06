"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"

type WorkOSContextType = {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  user: ReturnType<typeof useAuthStore>["user"]
  isLoading: boolean
}

const WorkOSContext = createContext<WorkOSContextType | undefined>(undefined)

// Mock user for local development
const MOCK_USER = {
  id: "local-dev-user-id",
  email: "dev@example.com",
  firstName: "Dev",
  lastName: "User",
  role: "admin",
  profileImageUrl: "",
  organizationId: "local-org-id",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function WorkOSProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    isLoading,
    isInitialized,
    signIn: storeSignIn,
    signOut: storeSignOut,
    refreshUser,
    setUser,
  } = useAuthStore()
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  // Check for authenticated user on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // For local development, set a mock user
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock user for local development")
          setUser(MOCK_USER)
        } else {
          await refreshUser()
        }
        setIsReady(true)
      } catch (error) {
        console.error("Failed to initialize auth:", error)
        // Still set mock user in development even if there's an error
        if (process.env.NODE_ENV === "development") {
          setUser(MOCK_USER)
        }
        setIsReady(true) // Still mark as ready to avoid blocking the UI
      }
    }

    if (isInitialized) {
      initAuth()
    }
  }, [refreshUser, isInitialized, setUser])

  const signIn = async (email: string, password: string) => {
    if (process.env.NODE_ENV === "development") {
      // In development, just set the mock user
      setUser(MOCK_USER)
      router.push("/dashboard")
      return
    }

    await storeSignIn(email, password)
    router.push("/dashboard")
  }

  const signOut = async () => {
    if (process.env.NODE_ENV === "development") {
      // In development, just clear the user
      setUser(null)
      router.push("/")
      return
    }

    await storeSignOut()
    router.push("/")
  }

  // Show a loading state while initializing
  if (!isReady && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <WorkOSContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isLoading,
      }}
    >
      {children}
    </WorkOSContext.Provider>
  )
}

export function useWorkOS() {
  const context = useContext(WorkOSContext)
  if (context === undefined) {
    throw new Error("useWorkOS must be used within a WorkOSProvider")
  }

  return context
}

