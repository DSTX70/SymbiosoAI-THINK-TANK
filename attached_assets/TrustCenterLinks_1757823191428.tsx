import React from 'react';
export default function TrustCenterLinks(){
  const [links,setLinks]=React.useState<any>(null); React.useEffect(()=>{ fetch('/trust/links').then(r=>r.json()).then(setLinks); },[]);
  if(!links) return null;
  return <div data-testid="trust-links"><h2>Trust Center</h2><ul>{Object.entries(links).map(([k,v]:any)=><li key={k}>{k}: {String(v)}</li>)}</ul></div>;
}