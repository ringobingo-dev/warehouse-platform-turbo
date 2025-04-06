import type { User } from "./user"

export type CustomerStatus = "pending" | "approved" | "suspended" | "inactive"

export interface Customer {
  id: string
  name: string
  type: "type1" | "type2" // Individual or Business
  status: CustomerStatus
  address: string
  zip: string
  city: string
  state: string
  country: string
  email: string
  phone: string
  contactPerson: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface CustomerWithUsers extends Customer {
  users: User[]
}

