"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  name?: string
  email?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error("Error loading user from storage:", error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    loadUser()
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      // This would be replaced with an actual API call
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      const user = data.user

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("auth_token", data.token)

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })

      return user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("user")
    localStorage.removeItem("auth_token")

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  return {
    ...authState,
    login,
    logout,
  }
}

