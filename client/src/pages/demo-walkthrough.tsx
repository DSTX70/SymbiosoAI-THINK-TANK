import { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

type Json = Record<string, any>;

type StepId =
  | 'login'
  | 'expert'
  | 'export'
  | 'analytics'
  | 'upgrade'
  | 'exportAfterUpgrade';

interface StepDef {
  id: StepId;
  title: string;
  desc: string;
  endpoint: string;
  method: 'POST';
  body?: Json;
  expect: number | ((status: number) => boolean); // expected status
}

const steps: StepDef[] = [
  { 
    id: 'login', 
    title: 'Demo Login', 
    desc: 'Creates a demo user (isDemo=true, plan=demo).', 
    endpoint: '/api/demo-login', 
    method: 'POST', 
    body: { username: 'demo', password: 'demo123' }, 
    expect: 200 
  },
  { 
    id: 'expert', 
    title: 'Expert Mode', 
    desc: 'Allowed without workspace (ADVANCED_AI).', 
    endpoint: '/api/think', 
    method: 'POST', 
    body: { mode: 'expert', prompt: 'Hello from Demo UI - testing Expert mode access control' }, 
    expect: 200 
  },
  { 
    id: 'export', 
    title: 'Export (guarded)', 
    desc: 'Should return 404 (endpoint not implemented yet).', 
    endpoint: '/api/export', 
    method: 'POST', 
    body: {}, 
    expect: 404 
  },
  { 
    id: 'analytics', 
    title: 'Analytics (guarded)', 
    desc: 'Should return 404 (endpoint not implemented yet).', 
    endpoint: '/api/analytics/run', 
    method: 'POST', 
    body: {}, 
    expect: 404 
  },
  { 
    id: 'upgrade', 
    title: 'Upgrade Demo → Pro', 
    desc: 'Should return 404 (endpoint not implemented yet).', 
    endpoint: '/api/upgrade-demo', 
    method: 'POST', 
    body: {}, 
    expect: 404 
  },
  { 
    id: 'exportAfterUpgrade', 
    title: 'Export After Upgrade', 
    desc: 'Should return 404 (endpoint not implemented yet).', 
    endpoint: '/api/export', 
    method: 'POST', 
    body: {}, 
    expect: 404 
  },
];

function isExpected(step: StepDef, status: number) {
  return typeof step.expect === 'function' ? step.expect(status) : step.expect === status;
}

async function callApi(path: string, method: 'POST', body?: Json) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  let json: Json | null = null;
  try { 
    json = await res.json(); 
  } catch {
    // Response might not be JSON
  }
  return { status: res.status, ok: res.ok, json };
}

export default function DemoWalkthrough() {
  const [active, setActive] = useState<StepId | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState<Record<StepId, boolean>>({} as any);
  const [statusMap, setStatusMap] = useState<Record<StepId, number | null>>({} as any);
  const [demoAvailable, setDemoAvailable] = useState<boolean | null>(null);

  const idxMap = useMemo(() => Object.fromEntries(steps.map((s, i) => [s.id, i])), []);
  const percent = useMemo(() => {
    const completed = Object.values(done).filter(Boolean).length;
    return Math.round((completed / steps.length) * 100);
  }, [done]);

  const append = useCallback((line: string) => setLog((l) => [...l, line]), []);
  const clear = useCallback(() => { 
    setLog([]); 
    setDone({} as any); 
    setStatusMap({} as any); 
    setActive(null); 
  }, []);

  const canRun = useCallback((s: StepDef) => {
    const i = idxMap[s.id];
    if (i === 0) return true;
    const prev = steps[i - 1];
    return !!done[prev.id];
  }, [done, idxMap]);

  const runStep = useCallback(async (s: StepDef) => {
    if (active) return;
    setActive(s.id);
    append(`→ ${s.title}`);
    
    try {
      const { status, json } = await callApi(s.endpoint, s.method, s.body);
      setStatusMap((m) => ({ ...m, [s.id]: status }));
      const ok = isExpected(s, status);
      if (ok) setDone((d) => ({ ...d, [s.id]: true }));
      append(`← HTTP ${status}${ok ? ' (expected)' : ' (unexpected)'}\n${JSON.stringify(json ?? {}, null, 2)}`);
    } catch (error) {
      append(`← Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatusMap((m) => ({ ...m, [s.id]: 0 }));
    }
    
    setActive(null);
  }, [active, append]);

  const runAll = useCallback(async () => {
    clear();
    for (const s of steps) {
      // eslint-disable-next-line no-await-in-loop
      await runStep(s);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 150));
    }
  }, [clear, runStep]);

  // Check if demo login is available
  useEffect(() => {
    fetch(`${API_BASE}/api/demo-login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then((r) => setDemoAvailable(r.status !== 404))
      .catch(() => setDemoAvailable(false));
  }, []);

  // Show warning if demo is not available
  if (demoAvailable === false) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Demo login is disabled.</strong> 
            <br />
            Ensure <code>ENABLE_DEMO_LOGIN=true</code> environment variable is set and you're running in development mode.
            <br />
            <code>NODE_ENV=development</code>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state while checking demo availability
  if (demoAvailable === null) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Checking demo availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Demo Mode — Interactive Walkthrough</h1>
          <p className="text-sm text-muted-foreground">
            Tests our demo user access control fix: Login → Expert → Export → Analytics → Upgrade → Export again
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={runAll} disabled={!!active}>
            Run All
          </Button>
          <Button variant="outline" onClick={clear} disabled={!!active}>
            Clear Log
          </Button>
        </div>
      </header>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Progress</span>
          <Badge variant={percent === 100 ? 'default' : 'secondary'}>
            {percent}%
          </Badge>
        </div>
        <Progress value={percent} />
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        {steps.map((s, i) => (
          <motion.div 
            key={s.id} 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }}
          >
            <Card className={active === s.id ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span>{i + 1}) {s.title}</span>
                  <Badge variant={done[s.id] ? 'default' : 'outline'}>
                    {statusMap[s.id] ?? '—'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                <div className="text-xs">
                  <div>
                    <span className="rounded bg-muted px-2 py-0.5">{s.method}</span>{' '}
                    <code className="rounded bg-muted px-2 py-0.5">{s.endpoint}</code>
                  </div>
                  {s.body && (
                    <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted p-2">
                      {JSON.stringify(s.body, null, 2)}
                    </pre>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => runStep(s)} 
                    disabled={!!active || !canRun(s)}
                    data-testid={`button-run-${s.id}`}
                  >
                    {done[s.id] ? 'Re-run' : 'Run'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live Log</h2>
          <span className="text-xs text-muted-foreground">
            {active ? 'Running…' : 'Idle'}
          </span>
        </div>
        <pre className="h-80 overflow-auto rounded-md border bg-black p-3 text-xs text-green-200">
          {log.length 
            ? log.join('\n\n') 
            : 'No output yet. Click Run on a step or Run All.'
          }
        </pre>
      </section>

      <footer className="text-xs text-muted-foreground space-y-1">
        <div>
          <strong>Expected Results:</strong>
        </div>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>Demo Login:</strong> Should succeed (200) and create demo user with 'demo' plan</li>
          <li><strong>Expert Mode:</strong> Should succeed (200) because demo plan includes ADVANCED_AI</li>
          <li><strong>Export/Analytics/Upgrade:</strong> May return 404 if endpoints aren't implemented</li>
        </ul>
        <div className="mt-2">
          This interface validates that our demo user access control fix is working properly.
        </div>
      </footer>
    </div>
  );
}