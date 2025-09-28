import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Shield, AlertTriangle } from 'lucide-react';

type Props = {
  filename: string;
  payload: any; // report object or serialized content
  children?: React.ReactNode; // button content
  className?: string;
};

export default function ExportDLPGuard({ filename, payload, children, className }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true); 
    setError(null);
    
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filename, 
          content: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2) 
        })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.hits && data.hits.length > 0) {
          setError(`🛡️ Export blocked by security scan: ${data.hits.join(', ')}`);
        } else {
          setError('Export failed - please try again');
        }
        return;
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; 
      a.download = filename || 'export.txt';
      document.body.appendChild(a); 
      a.click(); 
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError('Network error - please check your connection');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2" data-testid="export-dlp-guard">
      <Button 
        onClick={onClick} 
        disabled={busy} 
        className={className}
        data-testid="export-button"
      >
        {busy ? (
          <>
            <Shield className="w-4 h-4 mr-2 animate-spin" />
            Checking security...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            {children || 'Export'}
          </>
        )}
      </Button>
      
      {error && (
        <Alert variant="destructive" data-testid="dlp-error">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}