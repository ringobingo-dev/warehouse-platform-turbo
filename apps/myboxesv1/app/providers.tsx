"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BoxProvider } from "@/contexts/BoxContext"
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BoxProvider initialValues={{ rows: 3, columns: 3, stackHeight: 3 }}>
        {children}
        <Toaster />
      </BoxProvider>
    </ThemeProvider>
  )
}

