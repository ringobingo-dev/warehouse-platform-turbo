// moved to shared folder for reuse and NX prep
// This file contains utility functions for formatting data

// Add any formatting functions that are used across the application here
export function formatDate(date: Date | string): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDimension(value: number, unit = "in"): string {
  return `${value}${unit}`
}

// possible duplicate — review for consolidation
// Original utility kept for compatibility, consider using the shared version in utils/shared/format-helpers.ts

