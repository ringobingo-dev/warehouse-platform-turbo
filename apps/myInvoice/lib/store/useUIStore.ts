import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  colorTheme: string
  setColorTheme: (theme: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      colorTheme: "zinc",
      setColorTheme: (theme) => set({ colorTheme: theme }),
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: "ui-storage",
    },
  ),
)

