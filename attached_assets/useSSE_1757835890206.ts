import { useEffect, useState } from 'react';

export function useSSE(url: string) {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!url) return;
    setStatus('running');
    const es = new EventSource(url);

    es.addEventListener('progress', (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        if (typeof payload.progress === 'number') setProgress(payload.progress);
      } catch {}
    });

    es.addEventListener('completed', (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        setData(payload);
      } catch {}
      setStatus('completed');
      es.close();
    });

    es.addEventListener('failed', () => {
      setStatus('failed');
      es.close();
    });

    es.onerror = () => {
      setStatus('failed');
      es.close();
    };

    return () => es.close();
  }, [url]);

  return { progress, status, data };
}
