import React, { useState } from 'react';

type Props = {
  filename: string;
  payload: any; // report object or serialized content
  children: React.ReactNode; // usually a button
};

export default function ExportDLPGuard({ filename, payload, children }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true); setError(null);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content: JSON.stringify(payload) })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.hits ? `Blocked by DLP: ${data.hits.join(', ')}` : 'Export failed');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename || 'export.txt';
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError('Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button onClick={onClick} disabled={busy} className="px-3 py-2 rounded border">
        {busy ? 'Checking…' : children}
      </button>
      {error && <div className="text-sm mt-2">{error}</div>}
    </div>
  );
}
