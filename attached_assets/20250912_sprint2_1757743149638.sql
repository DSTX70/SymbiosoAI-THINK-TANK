CREATE TABLE IF NOT EXISTS push_subscriptions (id SERIAL PRIMARY KEY, user_id TEXT, endpoint TEXT NOT NULL, keys_json JSONB NOT NULL, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE IF NOT EXISTS webhook_endpoints (id SERIAL PRIMARY KEY, org_id TEXT, url TEXT NOT NULL, secret TEXT NOT NULL, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE IF NOT EXISTS webhook_deliveries (id SERIAL PRIMARY KEY, endpoint_id INTEGER, event_id TEXT NOT NULL, status TEXT, attempts INTEGER DEFAULT 0, response_code INTEGER, created_at TIMESTAMP DEFAULT NOW());
CREATE UNIQUE INDEX IF NOT EXISTS uniq_endpoint_event ON webhook_deliveries(endpoint_id, event_id);
CREATE TABLE IF NOT EXISTS templates (id UUID PRIMARY KEY, version INTEGER NOT NULL, title TEXT NOT NULL, tags TEXT[], content_json JSONB, published BOOLEAN DEFAULT FALSE, created_by TEXT, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE IF NOT EXISTS template_audit (id SERIAL PRIMARY KEY, template_id UUID, action TEXT, actor TEXT, at TIMESTAMP DEFAULT NOW());
ALTER TABLE debate_runs ADD COLUMN IF NOT EXISTS latency_ms INTEGER;
ALTER TABLE debate_runs ADD COLUMN IF NOT EXISTS error_class TEXT;
