// moved to shared folder for reuse and NX prep
"use client"

import type React from "react"

import { useState, useEffect } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export interface ToastActionElement {
  altText: string
  onClick: () => void
  children: React.ReactNode
}

interface UseToastOptions {
  duration?: number
}

export function useToast(options: UseToastOptions = {}) {
  const { duration = 5000 } = options
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1))
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [toasts, duration])

  function toast(props: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, ...props }])
    return id
  }

  function dismiss(id: string) {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return {
    toast,
    dismiss,
    toasts,
  }
}

