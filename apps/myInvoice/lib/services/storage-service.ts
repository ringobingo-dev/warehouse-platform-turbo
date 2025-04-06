// This file acts as a service layer between the UI and data sources
// When connecting to real databases, you would replace the mock implementations
// with actual API calls, but keep the same interface

import {
  fetchStorageData as mockFetchStorageData,
  fetchCustomers as mockFetchCustomers,
  fetchWarehouses as mockFetchWarehouses,
  fetchWarehouseRooms as mockFetchWarehouseRooms,
  fetchGrowersVarieties as mockFetchGrowersVarieties,
  type StorageItem,
  type Customer,
  type Warehouse,
  type WarehouseRoom,
  type GrowersVariety,
} from "../mock-storage-data"

// Storage data service
export async function getStorageItems(
  customerId?: string,
  dateRange?: { from: Date; to: Date },
): Promise<StorageItem[]> {
  // When connecting to real databases, replace this with an API call
  // Example:
  // const response = await fetch(`/api/storage?customerId=${customerId}`);
  // return response.json();

  return mockFetchStorageData(customerId, dateRange)
}

// Customer service
export async function getCustomers(): Promise<Customer[]> {
  // When connecting to real databases, replace this with an API call
  // Example:
  // const response = await fetch('/api/customers');
  // return response.json();

  return mockFetchCustomers()
}

// Warehouse service
export async function getWarehouses(): Promise<Warehouse[]> {
  // When connecting to real databases, replace this with an API call
  return mockFetchWarehouses()
}

// Warehouse rooms service
export async function getWarehouseRooms(warehouseId?: string): Promise<WarehouseRoom[]> {
  // When connecting to real databases, replace this with an API call
  return mockFetchWarehouseRooms(warehouseId)
}

// Growers varieties service
export async function getGrowersVarieties(grower?: string): Promise<GrowersVariety[]> {
  // When connecting to real databases, replace this with an API call
  return mockFetchGrowersVarieties(grower)
}

// Calculate invoice totals
export function calculateInvoiceTotals(items: any[], dailyRate: number, handlingRate: number, gstRate: number) {
  let subtotal = 0
  let totalBoxes = 0

  items.forEach((item: any) => {
    if (item.deliveryDate && item.leavingDate && item.boxCount) {
      const days = calculateDaysBetween(new Date(item.deliveryDate), new Date(item.leavingDate))
      const amount = days * item.boxCount * dailyRate
      subtotal += amount
      totalBoxes += Number.parseInt(item.boxCount)
    }
  })

  const handlingCharges = totalBoxes * handlingRate
  const cost = subtotal + handlingCharges
  const gst = cost * gstRate
  const total = cost + gst

  return { subtotal, handlingCharges, cost, gst, total, totalBoxes }
}

// Helper function to calculate days between dates
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

