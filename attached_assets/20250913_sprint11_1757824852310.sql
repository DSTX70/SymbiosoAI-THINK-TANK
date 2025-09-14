-- Sprint 11: Billing & Entitlements hardening
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY,
  org_id TEXT,
  status TEXT,
  amount_cents INTEGER,
  currency TEXT,
  due_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dunning_events (
  id UUID PRIMARY KEY,
  invoice_id UUID,
  org_id TEXT,
  event TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seats (
  org_id TEXT PRIMARY KEY,
  seats INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);
