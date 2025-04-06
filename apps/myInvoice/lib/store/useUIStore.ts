import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  colorTheme: string
  setColorTheme: (theme: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  initialize: () => void
  error: string | null
  theme: string
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      colorTheme: "zinc",
      setColorTheme: (theme) => set({ colorTheme: theme }),
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      initialize: () => {
        // Initialize UI state if needed
        set({ error: null })
      },
      error: null,
      theme: "light"
    }),
    {
      name: "ui-storage",
    }
  )
)

