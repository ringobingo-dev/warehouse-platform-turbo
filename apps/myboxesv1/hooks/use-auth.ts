import { useState } from "react"

export function useAuth() {
  const [isAuthenticated] = useState(true)
  const [user] = useState({ name: "Test User" })

  return {
    isAuthenticated,
    user,
    login: () => {},
    logout: () => {},
  }
} 