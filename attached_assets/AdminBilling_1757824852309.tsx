import React from 'react';
export default function AdminBilling(){
  const [portal, setPortal] = React.useState<any>(null);
  React.useEffect(()=>{ fetch('/billing/portal').then(r=>r.json()).then(setPortal); },[]);
  return (<div data-testid="admin-billing">
    <h2 className="text-xl font-semibold">Billing</h2>
    <div className="mt-2">Invoice Portal: {portal?.url}</div>
  </div>);
}