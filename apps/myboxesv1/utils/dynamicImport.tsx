"use client"

import React, { lazy, Suspense, type ComponentType } from "react"
import { debugLog } from "./debugUtils"

// Error boundary for catching chunk loading errors
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ErrorBoundaryInner>{children}</ErrorBoundaryInner>
    </div>
  )
}

class ErrorBoundaryInner extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chunk loading error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h2 className="text-lg font-semibold text-red-700">Something went wrong loading this component</h2>
          <p className="text-sm text-red-600">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Refresh
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Safely load components with error handling
export function safeLazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  const Component = lazy(factory)
  return function SafeComponent(props: React.ComponentProps<T>) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

/**
 * Dynamically imports a component with error handling and logging
 * @param importFn The import function
 * @param fallback Optional fallback component to show while loading
 * @returns The dynamically imported component
 */
export function dynamicImport(importFn: () => Promise<any>, componentName: string) {
  return lazy(() => {
    debugLog(`Dynamically importing ${componentName}`)

    return importFn()
      .then((module) => {
        debugLog(`Successfully imported ${componentName}`)
        return module
      })
      .catch((error) => {
        console.error(`Error importing ${componentName}:`, error)
        throw error
      })
  })
}

/**
 * Creates a wrapper component that renders the dynamically imported component with Suspense
 * @param Component The dynamically imported component
 * @param fallback Optional fallback component to show while loading
 * @returns A wrapper component
 */
export function withSuspense(Component: React.ComponentType<any>, fallback: React.ReactNode) {
  return function WithSuspense(props: any) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    )
  }
}

