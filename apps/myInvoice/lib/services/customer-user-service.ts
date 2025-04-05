import type { User, UserInvitation } from "../types/user"
import type { Customer } from "../types/customer"

// This would be replaced with actual database calls in production
// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "user-001",
    email: "admin@warehouse.com",
    firstName: "John",
    lastName: "Doe",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-002",
    email: "customer1@example.com",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "customer_admin",
    status: "active",
    customerId: "cust-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-003",
    email: "staff1@warehouse.com",
    firstName: "Michael",
    lastName: "Smith",
    role: "staff",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Harvest Valley Farms",
    type: "type2",
    status: "approved",
    address: "4578 Orchard Lane",
    zip: "83686",
    city: "Nampa",
    state: "Idaho",
    country: "New Zealand",
    email: "accounts@harvestvalley.com",
    phone: "+1 (208) 555-4321",
    contactPerson: "Sarah Johnson",
    notes: "Stores seasonal produce and equipment",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cust-002",
    name: "TechStore Solutions",
    type: "type1",
    status: "pending",
    address: "789 Innovation Drive",
    zip: "83702",
    city: "Boise",
    state: "Idaho",
    country: "New Zealand",
    email: "billing@techstore.com",
    phone: "+1 (208) 555-9876",
    contactPerson: "Michael Chen",
    notes: "Stores electronic inventory and packaging materials",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockInvitations: UserInvitation[] = [
  {
    id: "inv-001",
    email: "newuser@harvestvalley.com",
    role: "customer_user",
    customerId: "cust-001",
    invitedBy: "user-002",
    status: "pending",
    token: "abc123",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date().toISOString(),
  },
]

// Get users for a specific customer
export async function getCustomerUsers(customerId: string): Promise<User[]> {
  // In a real app, this would be a database query
  return mockUsers.filter((user) => user.customerId === customerId)
}

// Get customer with its users
export async function getCustomerWithUsers(customerId: string): Promise<{ customer: Customer; users: User[] } | null> {
  const customer = mockCustomers.find((c) => c.id === customerId)
  if (!customer) return null

  const users = await getCustomerUsers(customerId)
  return { customer, users }
}

// Create a new customer with admin user
export async function createCustomerWithAdmin(
  customerData: Omit<Customer, "id" | "createdAt" | "updatedAt" | "status">,
  adminUserEmail: string,
): Promise<{ customer: Customer; invitation: UserInvitation }> {
  // In a real app, this would be a database transaction

  // 1. Create the customer in pending state
  const newCustomer: Customer = {
    ...customerData,
    id: `cust-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // 2. Create invitation for the admin user
  const invitation: UserInvitation = {
    id: `inv-${Date.now()}`,
    email: adminUserEmail,
    role: "customer_admin",
    customerId: newCustomer.id,
    invitedBy: "user-001", // Assuming the platform admin is creating this
    status: "pending",
    token: `token-${Math.random().toString(36).substring(2, 15)}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date().toISOString(),
  }

  // In a real app, we would save these to the database
  // mockCustomers.push(newCustomer);
  // mockInvitations.push(invitation);

  return { customer: newCustomer, invitation }
}

// Approve a customer
export async function approveCustomer(customerId: string): Promise<Customer | null> {
  // In a real app, this would be a database update
  const customer = mockCustomers.find((c) => c.id === customerId)
  if (!customer) return null

  customer.status = "approved"
  customer.updatedAt = new Date().toISOString()

  return customer
}

// Invite a new user to a customer
export async function inviteUserToCustomer(
  email: string,
  role: "customer_admin" | "customer_user",
  customerId: string,
  invitedBy: string,
): Promise<UserInvitation | null> {
  // Check if the customer exists and is approved
  const customer = mockCustomers.find((c) => c.id === customerId)
  if (!customer || customer.status !== "approved") return null

  // Check if the inviter is authorized (admin or customer_admin for this customer)
  const inviter = mockUsers.find((u) => u.id === invitedBy)
  if (!inviter) return null

  const isAuthorized =
    inviter.role === "admin" || (inviter.role === "customer_admin" && inviter.customerId === customerId)

  if (!isAuthorized) return null

  // Create the invitation
  const invitation: UserInvitation = {
    id: `inv-${Date.now()}`,
    email,
    role,
    customerId,
    invitedBy,
    status: "pending",
    token: `token-${Math.random().toString(36).substring(2, 15)}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date().toISOString(),
  }

  // In a real app, we would save this to the database
  // mockInvitations.push(invitation);

  return invitation
}

// Accept an invitation and create a user
export async function acceptInvitation(
  token: string,
  userData: { firstName: string; lastName: string; password: string },
): Promise<User | null> {
  // Find the invitation
  const invitation = mockInvitations.find((inv) => inv.token === token && inv.status === "pending")
  if (!invitation || new Date(invitation.expiresAt) < new Date()) return null

  // Create the user
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: invitation.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: invitation.role,
    status: "active",
    customerId: invitation.customerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Update the invitation status
  invitation.status = "accepted"

  // In a real app, we would save these changes to the database
  // mockUsers.push(newUser);

  return newUser
}

// Get pending invitations for a customer
export async function getPendingInvitations(customerId: string): Promise<UserInvitation[]> {
  return mockInvitations.filter((inv) => inv.customerId === customerId && inv.status === "pending")
}

