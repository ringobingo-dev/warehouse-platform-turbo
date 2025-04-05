export type UserRole = "admin" | "customer_admin" | "customer_user" | "staff"
export type UserStatus = "pending" | "active" | "suspended" | "inactive"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl?: string
  role: UserRole
  status: UserStatus
  customerId?: string // Only for customer_admin and customer_user roles
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UserInvitation {
  id: string
  email: string
  role: UserRole
  customerId?: string
  invitedBy: string // User ID of the inviter
  status: "pending" | "accepted" | "expired"
  token: string
  expiresAt: string
  createdAt: string
}

