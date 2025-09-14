-- Sprint 1 tables (example; adapt to your ORM/Drizzle)
CREATE TABLE IF NOT EXISTS debate_runs (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS export_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  workspace_id TEXT,
  filename TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  dlp_hits TEXT
);
