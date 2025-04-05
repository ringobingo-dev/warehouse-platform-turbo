"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useUIStore } from "@/lib/store"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  const { colorTheme, setColorTheme, theme, setTheme } = useUIStore()

  // Apply saved theme settings on mount
  React.useEffect(() => {
    setMounted(true)

    // Apply color theme
    if (colorTheme) {
      document.documentElement.setAttribute("data-color-theme", colorTheme)
    }

    // Apply dark/light theme
    if (theme !== "system") {
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [colorTheme, theme])

  return (
    <NextThemesProvider
      {...props}
      defaultTheme={theme}
      onValueChange={(newTheme) => setTheme(newTheme as "light" | "dark" | "system")}
    >
      {mounted ? children : null}
    </NextThemesProvider>
  )
}

