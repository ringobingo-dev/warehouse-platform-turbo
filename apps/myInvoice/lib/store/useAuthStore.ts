import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define the User type
export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  profileImageUrl: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

// Define the AuthStore type
type AuthStore = {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: User | null) => void
}

// Create the auth store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isInitialized: true, // Set to true for local development
      error: null,

      signIn: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          // In a real app, this would call an API
          console.log("Sign in with", email, password)

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Mock successful login
          set({
            user: {
              id: "user-1",
              email,
              firstName: "John",
              lastName: "Doe",
              role: "admin",
              profileImageUrl: "",
              organizationId: "org-1",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            isLoading: false,
          })
        } catch (error) {
          console.error("Sign in error:", error)
          set({
            error: error instanceof Error ? error.message : "Failed to sign in",
            isLoading: false,
          })
          throw error
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null })
        try {
          // In a real app, this would call an API
          console.log("Sign out")

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Clear user data
          set({ user: null, isLoading: false })
        } catch (error) {
          console.error("Sign out error:", error)
          set({
            error: error instanceof Error ? error.message : "Failed to sign out",
            isLoading: false,
          })
          throw error
        }
      },

      refreshUser: async () => {
        set({ isLoading: true, error: null })
        try {
          // In a real app, this would call an API
          console.log("Refresh user")

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          // For now, just keep the current user
          const currentUser = get().user
          if (currentUser) {
            set({ user: { ...currentUser, updatedAt: new Date().toISOString() }, isLoading: false })
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          console.error("Refresh user error:", error)
          set({
            error: error instanceof Error ? error.message : "Failed to refresh user",
            isLoading: false,
          })
          throw error
        }
      },

      setUser: (user) => {
        set({ user, isLoading: false, error: null })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

