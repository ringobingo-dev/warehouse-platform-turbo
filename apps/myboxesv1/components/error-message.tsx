"use client"

import { useEffect } from "react"
import { AlertCircle, X } from "lucide-react"

// Track active error messages to prevent duplicates
const activeErrorMessages = new Set<string>()

interface ErrorMessageProps {
  message: string
  onClose: () => void
  autoClose?: boolean
  autoCloseTime?: number
}

export function ErrorMessage({ message, onClose, autoClose = true, autoCloseTime = 5000 }: ErrorMessageProps) {
  // Check if this message is already being displayed
  useEffect(() => {
    // If message is already active, don't show duplicate
    if (activeErrorMessages.has(message)) {
      onClose()
      return
    }

    // Add message to active set
    activeErrorMessages.add(message)

    // Clean up when component unmounts
    return () => {
      activeErrorMessages.delete(message)
    }
  }, [message, onClose])

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        activeErrorMessages.delete(message)
        onClose()
      }, autoCloseTime)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseTime, onClose, message])

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full bg-white border-l-4 border-red-500 shadow-lg rounded-md overflow-hidden">
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-gray-900">Error</h3>
          <div className="mt-1 text-sm text-gray-500">{message}</div>
        </div>
        <button
          onClick={() => {
            activeErrorMessages.delete(message)
            onClose()
          }}
          className="ml-auto flex-shrink-0 flex"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        </button>
      </div>
      {autoClose && (
        <div className="h-1 bg-red-100">
          <div
            className="h-full bg-red-500 transition-all duration-linear"
            style={{
              width: "100%",
              animation: `shrink ${autoCloseTime}ms linear forwards`,
            }}
          />
        </div>
      )}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

