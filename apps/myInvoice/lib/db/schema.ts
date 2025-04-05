// This file defines the PostgreSQL schema for our application
// These schemas will be used when connecting to a real database in production

// User schema
export const usersSchema = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  workos_id VARCHAR(255) UNIQUE,
  customer_id UUID REFERENCES customers(id),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  profile_image_url TEXT,
  phone VARCHAR(50),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_workos_id ON users(workos_id);
`

// User invitation schema
export const userInvitationsSchema = `
CREATE TABLE IF NOT EXISTS user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  invited_by UUID REFERENCES users(id) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invitations_email ON user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON user_invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_customer_id ON user_invitations(customer_id);
`

// Note: This schema is for reference only and will be used when setting up
// the actual PostgreSQL database in production. For development, we're using
// mock data instead of a real database connection.

