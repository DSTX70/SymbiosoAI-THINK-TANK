-- Initial database setup
-- This is a placeholder - replace with your actual database schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demo user setup
INSERT INTO users (id, email, first_name, last_name, role) 
VALUES ('demo-user-12345', 'demo@example.com', 'Demo', 'User', 'user')
ON CONFLICT (id) DO NOTHING;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

COMMENT ON TABLE users IS 'User accounts for SymbiosoAi ThinkTank';