-- Sprint 8 Indexes & RLS verification
-- Hot-path indexes
CREATE INDEX IF NOT EXISTS idx_debate_runs_org_created ON debate_runs(org_id, started_at);
CREATE INDEX IF NOT EXISTS idx_export_logs_org_created ON export_logs(org_id, created_at);

-- Verify RLS ON (no-op if already on)
ALTER TABLE IF EXISTS debate_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS export_logs ENABLE ROW LEVEL SECURITY;
