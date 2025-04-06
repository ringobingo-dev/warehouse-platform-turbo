export interface StorageItem {
  id: string
  grower: string
  variety: string
  deliveryDate: string // ISO date string
  leavingDate: string // ISO date string
  boxCount: number
  warehouseId: string
  roomId: string
  status: "active" | "completed" | "pending"
}

export interface Customer {
  id: string
  type: string
  name: string
  address: string
  zip: string
  city: string
  state: string
  country: string
  email: string
  phone: string
  contactPerson: string
  notes: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
}

export interface WarehouseRoom {
  id: string
  warehouseId: string
  name: string
  capacity: number
}

export interface GrowersVariety {
  grower: string
  variety: string
}

// Line item type interface - this would come from a SQL query
export interface LineItemType {
  id: string
  name: string
  description: string
  grower?: string
  variety?: string
  defaultBoxCount?: number
  category: string
  isDefault: boolean
}

// Mock data for line item types - this would come from a SQL query in production
export const mockLineItemTypes: LineItemType[] = [
  {
    id: "line-type-001",
    name: "Hannor Agrea Storage",
    description: "Storage for Hannor Agrea potatoes",
    grower: "Hannor",
    variety: "Agrea",
    defaultBoxCount: 25,
    category: "storage",
    isDefault: true,
  },
  {
    id: "line-type-002",
    name: "Parkland Russet Storage",
    description: "Storage for Parkland Russet potatoes",
    grower: "Parkland",
    variety: "Russet",
    defaultBoxCount: 30,
    category: "storage",
    isDefault: false,
  },
  {
    id: "line-type-003",
    name: "Parkland Yukon Gold Storage",
    description: "Storage for Parkland Yukon Gold potatoes",
    grower: "Parkland",
    variety: "Yukon Gold",
    defaultBoxCount: 15,
    category: "storage",
    isDefault: false,
  },
  {
    id: "line-type-004",
    name: "Sunvalley Red Delicious Storage",
    description: "Storage for Sunvalley Red Delicious apples",
    grower: "Sunvalley",
    variety: "Red Delicious",
    defaultBoxCount: 40,
    category: "storage",
    isDefault: false,
  },
  {
    id: "line-type-005",
    name: "Custom Storage Entry",
    description: "Add a custom storage entry",
    defaultBoxCount: 0,
    category: "custom",
    isDefault: false,
  },
  {
    id: "line-type-006",
    name: "Handling Fee",
    description: "Additional handling fee",
    category: "fee",
    isDefault: false,
  },
  {
    id: "line-type-007",
    name: "Temperature Control Fee",
    description: "Fee for temperature controlled storage",
    category: "fee",
    isDefault: false,
  },
]

// Mock data for storage items - this would be replaced with data from your database
const mockStorageItems: StorageItem[] = [
  {
    id: "storage-001",
    grower: "Hannor",
    variety: "Agrea",
    deliveryDate: "2024-09-09T00:00:00Z",
    leavingDate: "2024-11-12T00:00:00Z",
    boxCount: 25,
    warehouseId: "wh-001",
    roomId: "room-a101",
    status: "active",
  },
  {
    id: "storage-002",
    grower: "Hannor",
    variety: "Agrea",
    deliveryDate: "2024-09-23T00:00:00Z",
    leavingDate: "2024-11-18T00:00:00Z",
    boxCount: 10,
    warehouseId: "wh-001",
    roomId: "room-a102",
    status: "active",
  },
  {
    id: "storage-003",
    grower: "Parkland",
    variety: "Russet",
    deliveryDate: "2024-08-15T00:00:00Z",
    leavingDate: "2024-10-30T00:00:00Z",
    boxCount: 30,
    warehouseId: "wh-001",
    roomId: "room-b201",
    status: "active",
  },
  {
    id: "storage-004",
    grower: "Parkland",
    variety: "Yukon Gold",
    deliveryDate: "2024-08-20T00:00:00Z",
    leavingDate: "2024-11-05T00:00:00Z",
    boxCount: 15,
    warehouseId: "wh-001",
    roomId: "room-b202",
    status: "active",
  },
  {
    id: "storage-005",
    grower: "Sunvalley",
    variety: "Red Delicious",
    deliveryDate: "2024-09-01T00:00:00Z",
    leavingDate: "2024-12-15T00:00:00Z",
    boxCount: 40,
    warehouseId: "wh-002",
    roomId: "room-c101",
    status: "active",
  },
]

// Mock function to fetch storage data
export async function fetchStorageData(
  customerId?: string,
  dateRange?: { from: Date; to: Date },
): Promise<StorageItem[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredItems = [...mockStorageItems]

  if (customerId) {
    // In a real application, you would filter based on the customerId
    // This is just a placeholder
    filteredItems = filteredItems.filter((item) => item.grower.includes(customerId))
  }

  if (dateRange && dateRange.from && dateRange.to) {
    const fromDate = dateRange.from
    const toDate = dateRange.to

    filteredItems = filteredItems.filter((item) => {
      const deliveryDate = new Date(item.deliveryDate)
      return deliveryDate >= fromDate && deliveryDate <= toDate
    })
  }

  return filteredItems
}

// Mock function to fetch customers
const mockCustomersData: Customer[] = [
  {
    id: "cust-001",
    type: "type2",
    name: "Harvest Valley Farms",
    address: "4578 Orchard Lane",
    zip: "83686",
    city: "Nampa",
    state: "Idaho",
    country: "New Zealand",
    email: "accounts@harvestvalley.com",
    phone: "+1 (208) 555-4321",
    contactPerson: "Sarah Johnson",
    notes: "Stores seasonal produce and equipment",
  },
  {
    id: "cust-002",
    type: "type1",
    name: "TechStore Solutions",
    address: "789 Innovation Drive",
    zip: "83702",
    city: "Boise",
    state: "Idaho",
    country: "New Zealand",
    email: "billing@techstore.com",
    phone: "+1 (208) 555-9876",
    contactPerson: "Michael Chen",
    notes: "Stores electronic inventory and packaging materials",
  },
]

export async function fetchCustomers(): Promise<Customer[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockCustomersData
}

// Mock function to fetch warehouses
const mockWarehousesData: Warehouse[] = [
  {
    id: "wh-001",
    name: "Twin Falls Warehouse",
    location: "Twin Falls, ID",
  },
  {
    id: "wh-002",
    name: "Boise Warehouse",
    location: "Boise, ID",
  },
]

export async function fetchWarehouses(): Promise<Warehouse[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockWarehousesData
}

// Mock function to fetch warehouse rooms
const mockWarehouseRoomsData: WarehouseRoom[] = [
  {
    id: "room-a101",
    warehouseId: "wh-001",
    name: "Room A101",
    capacity: 500,
  },
  {
    id: "room-a102",
    warehouseId: "wh-001",
    name: "Room A102",
    capacity: 600,
  },
  {
    id: "room-b201",
    warehouseId: "wh-001",
    name: "Room B201",
    capacity: 400,
  },
  {
    id: "room-b202",
    warehouseId: "wh-001",
    name: "Room B202",
    capacity: 550,
  },
  {
    id: "room-c101",
    warehouseId: "wh-002",
    name: "Room C101",
    capacity: 700,
  },
]

export async function fetchWarehouseRooms(warehouseId?: string): Promise<WarehouseRoom[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (warehouseId) {
    return mockWarehouseRoomsData.filter((room) => room.warehouseId === warehouseId)
  }

  return mockWarehouseRoomsData
}

// Mock function to fetch growers varieties
const mockGrowersVarietiesData: GrowersVariety[] = [
  { grower: "Hannor", variety: "Agrea" },
  { grower: "Parkland", variety: "Russet" },
  { grower: "Parkland", variety: "Yukon Gold" },
  { grower: "Sunvalley", variety: "Red Delicious" },
]

export async function fetchGrowersVarieties(grower?: string): Promise<GrowersVariety[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (grower) {
    return mockGrowersVarietiesData.filter((item) => item.grower === grower)
  }

  return mockGrowersVarietiesData
}

