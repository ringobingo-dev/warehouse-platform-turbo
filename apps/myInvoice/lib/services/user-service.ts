// Comment out the import for sql since we're not using it with mock data
// import { sql } from "@vercel/postgres"
import { v4 as uuidv4 } from "uuid"
import type { User, UserInvitation } from "../types/user"

// Mock data for development
// In production, this would be stored in PostgreSQL
let mockUsers: User[] = [
  {
    id: "user-001",
    email: "admin@warehouse.com",
    firstName: "John",
    lastName: "Doe",
    role: "admin",
    status: "active",
    workosId: "wos_user_123",
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
]

// Mock invitations data
// In production, this would be stored in PostgreSQL
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

// Helper function to check if we can connect to the database
async function canConnectToDatabase() {
  // Comment out the database connection check
  // try {
  //   await sql`SELECT 1`
  //   return true
  // } catch (error) {
  //   console.warn("Database connection not available, using mock data")
  //   return false
  // }

  console.warn("Development mode: Using mock data")
  return false
}

// User CRUD operations
export async function getUserById(id: string): Promise<User | null> {
  // In production, this would query the PostgreSQL database:
  // const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
  // if (rows.length === 0) return null;
  // return mapDbUserToUser(rows[0]);

  // Using mock data for development
  return mockUsers.find((user) => user.id === id) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  // In production, this would query the PostgreSQL database:
  // const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
  // if (rows.length === 0) return null;
  // return mapDbUserToUser(rows[0]);

  // Using mock data for development
  return mockUsers.find((user) => user.email === email) || null
}

export async function getUserByWorkOSId(workosId: string): Promise<User | null> {
  // In production, this would query the PostgreSQL database:
  // const { rows } = await sql`SELECT * FROM users WHERE workos_id = ${workosId}`;
  // if (rows.length === 0) return null;
  // return mapDbUserToUser(rows[0]);

  // Using mock data for development
  return mockUsers.find((user) => user.workosId === workosId) || null
}

export async function getUsersByCustomerId(customerId: string): Promise<User[]> {
  // In production, this would query the PostgreSQL database:
  // const { rows } = await sql`SELECT * FROM users WHERE customer_id = ${customerId}`;
  // return rows.map(mapDbUserToUser);

  // Using mock data for development
  return mockUsers.filter((user) => user.customerId === customerId)
}

export async function createUser(userData: {
  email: string
  firstName: string
  lastName: string
  role: string
  customerId?: string
  workosId?: string
  profileImageUrl?: string
  status?: string
}): Promise<User> {
  // In production, this would insert into the PostgreSQL database:
  // const { rows } = await sql`
  //   INSERT INTO users (email, first_name, last_name, role, customer_id, workos_id, profile_image_url, status)
  //   VALUES (${email}, ${firstName}, ${lastName}, ${role}, ${customerId || null},
  //           ${workosId || null}, ${profileImageUrl || null}, ${status})
  //   RETURNING *
  // `;
  // return mapDbUserToUser(rows[0]);

  // Using mock data for development
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
    status: userData.status || "pending",
    customerId: userData.customerId,
    workosId: userData.workosId,
    profileImageUrl: userData.profileImageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  return newUser
}

export async function updateUser(
  id: string,
  userData: {
    firstName?: string
    lastName?: string
    role?: string
    customerId?: string
    workosId?: string
    profileImageUrl?: string
    status?: string
    phone?: string
    lastLoginAt?: string
  },
): Promise<User | null> {
  // In production, this would update the PostgreSQL database:
  // Build dynamic SET clause based on provided fields
  // const { rows } = await sql`
  //   UPDATE users
  //   SET ... (dynamic fields)
  //   WHERE id = ${id}
  //   RETURNING *
  // `;
  // if (rows.length === 0) return null;
  // return mapDbUserToUser(rows[0]);

  // Using mock data for development
  const userIndex = mockUsers.findIndex((user) => user.id === id)
  if (userIndex === -1) return null

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...userData,
    updatedAt: new Date().toISOString(),
  }

  return mockUsers[userIndex]
}

export async function deleteUser(id: string): Promise<boolean> {
  // In production, this would delete from the PostgreSQL database:
  // const { rowCount } = await sql`DELETE FROM users WHERE id = ${id}`;
  // return rowCount > 0;

  // Using mock data for development
  const initialLength = mockUsers.length
  mockUsers = mockUsers.filter((user) => user.id !== id)
  return mockUsers.length < initialLength
}

// User invitation operations
export async function createInvitation(invitationData: {
  email: string
  role: string
  customerId?: string
  invitedBy: string
  expiresInDays?: number
}): Promise<UserInvitation> {
  // In production, this would insert into the PostgreSQL database

  // Generate a secure token
  const token = uuidv4()

  // Calculate expiration date
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (invitationData.expiresInDays || 7))

  // Create mock invitation for development
  const newInvitation: UserInvitation = {
    id: `inv-${Date.now()}`,
    email: invitationData.email,
    role: invitationData.role,
    customerId: invitationData.customerId,
    invitedBy: invitationData.invitedBy,
    status: "pending",
    token,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  }

  mockInvitations.push(newInvitation)
  return newInvitation
}

export async function getInvitationByToken(token: string): Promise<UserInvitation | null> {
  // In production, this would query the PostgreSQL database:
  // const { rows } = await sql`SELECT * FROM user_invitations WHERE token = ${token}`;
  // if (rows.length === 0) return null;
  // return mapDbInvitationToInvitation(rows[0]);

  // Using mock data for development
  return mockInvitations.find((invitation) => invitation.token === token) || null
}

export async function getPendingInvitationsByCustomerId(customerId: string): Promise<UserInvitation[]> {
  // In production, this would query the PostgreSQL database:
  // const { rows } = await sql`
  //   SELECT * FROM user_invitations
  //   WHERE customer_id = ${customerId}
  //   AND status = 'pending'
  //   AND expires_at > CURRENT_TIMESTAMP
  // `;
  // return rows.map(mapDbInvitationToInvitation);

  // Using mock data for development
  return mockInvitations.filter(
    (invitation) =>
      invitation.customerId === customerId &&
      invitation.status === "pending" &&
      new Date(invitation.expiresAt) > new Date(),
  )
}

export async function updateInvitationStatus(
  token: string,
  status: "accepted" | "expired" | "canceled",
): Promise<UserInvitation | null> {
  // In production, this would update the PostgreSQL database:
  // const { rows } = await sql`
  //   UPDATE user_invitations
  //   SET status = ${status}
  //   WHERE token = ${token}
  //   RETURNING *
  // `;
  // if (rows.length === 0) return null;
  // return mapDbInvitationToInvitation(rows[0]);

  // Using mock data for development
  const invitationIndex = mockInvitations.findIndex((invitation) => invitation.token === token)
  if (invitationIndex === -1) return null

  mockInvitations[invitationIndex] = {
    ...mockInvitations[invitationIndex],
    status,
  }

  return mockInvitations[invitationIndex]
}

export async function acceptInvitation(
  token: string,
  userData: {
    firstName: string
    lastName: string
    workosId?: string
  },
): Promise<User | null> {
  // In production, this would be a database transaction:
  // 1. Get the invitation
  // 2. Create the user
  // 3. Update the invitation status

  // Get the invitation
  const invitation = await getInvitationByToken(token)
  if (!invitation || invitation.status !== "pending" || new Date(invitation.expiresAt) < new Date()) {
    return null
  }

  // Create mock user for development
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: invitation.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: invitation.role,
    status: "active",
    customerId: invitation.customerId,
    workosId: userData.workosId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)

  // Update invitation status
  const invitationIndex = mockInvitations.findIndex((inv) => inv.token === token)
  if (invitationIndex !== -1) {
    mockInvitations[invitationIndex] = {
      ...mockInvitations[invitationIndex],
      status: "accepted",
    }
  }

  return newUser
}

// In production, these helper functions would map database rows to our types
// function mapDbUserToUser(dbUser: any): User {
//   return {
//     id: dbUser.id,
//     email: dbUser.email,
//     firstName: dbUser.first_name,
//     lastName: dbUser.last_name,
//     role: dbUser.role,
//     status: dbUser.status,
//     customerId: dbUser.customer_id,
//     profileImageUrl: dbUser.profile_image_url,
//     workosId: dbUser.workos_id,
//     phone: dbUser.phone,
//     lastLoginAt: dbUser.last_login_at,
//     createdAt: dbUser.created_at,
//     updatedAt: dbUser.updated_at
//   };
// }

// function mapDbInvitationToInvitation(dbInvitation: any): UserInvitation {
//   return {
//     id: dbInvitation.id,
//     email: dbInvitation.email,
//     role: dbInvitation.role,
//     customerId: dbInvitation.customer_id,
//     invitedBy: dbInvitation.invited_by,
//     status: dbInvitation.status,
//     token: dbInvitation.token,
//     expiresAt: dbInvitation.expires_at,
//     createdAt: dbInvitation.created_at
//   };
// }

