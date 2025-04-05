/**
 * Logs a message to the console in development mode only
 * @param message The message to log
 * @param data Optional data to log
 */
export function debugLog(message: string, data?: any): void {
  if (process.env.NODE_ENV === "development") {
    if (data) {
      console.log(`[DEBUG] ${message}`, data)
    } else {
      console.log(`[DEBUG] ${message}`)
    }
  }
}

/**
 * Utility function for safely setting state
 */
export function safeSetState<T>(setState: (value: T) => void, value: T, stateName: string): boolean {
  try {
    debugLog(`Setting ${stateName} to:`, value)
    setState(value)
    return true
  } catch (error) {
    console.error(`Error setting ${stateName}:`, error)
    return false
  }
}

/**
 * Measures the execution time of a function
 * @param fn The function to measure
 * @param fnName Optional name for the function in the log
 * @returns The result of the function
 */
export function measureExecutionTime<T>(fn: () => T, fnName = "Function"): T {
  if (process.env.NODE_ENV !== "development") {
    return fn()
  }

  const start = performance.now()
  const result = fn()
  const end = performance.now()

  console.log(`[PERFORMANCE] ${fnName} took ${(end - start).toFixed(2)}ms to execute`)

  return result
}

/**
 * Creates a function that logs its arguments when called
 * @param fn The function to wrap
 * @param fnName Optional name for the function in the log
 * @returns A wrapped function that logs its arguments
 */
export function createLoggingFunction<T extends (...args: any[]) => any>(
  fn: T,
  fnName = "Function",
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[CALL] ${fnName} called with:`, args)
    }

    const result = fn(...args)

    if (process.env.NODE_ENV === "development") {
      console.log(`[RESULT] ${fnName} returned:`, result)
    }

    return result
  }
}

