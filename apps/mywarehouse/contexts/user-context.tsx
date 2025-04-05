"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: Error | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const defaultUser: User = {
  id: "user-1",
  name: "Demo User",
  email: "user@example.com",
  role: "admin",
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // In a real app, this would check for an existing session
    // For now, we'll simulate loading the user
    const loadUser = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // For demo purposes, we'll use the default user
        // In a real app, you would fetch the user from an API
        setUser(defaultUser)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load user"))
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes
      setUser(defaultUser)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Simulate logout
    setUser(null)
  }

  return <UserContext.Provider value={{ user, isLoading, error, login, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

