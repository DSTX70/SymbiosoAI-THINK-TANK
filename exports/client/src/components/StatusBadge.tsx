import React from 'react';
export default function StatusBadge(){
  const [s,setS]=React.useState<any>(null); React.useEffect(()=>{ fetch('/status/badge').then(r=>r.json()).then(setS); },[]);
  return <span data-testid="status-badge">{s?.status||'loading'}</span>;
}