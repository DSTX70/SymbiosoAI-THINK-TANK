import React from 'react';
export default function AccessibilityChecklist(){
  const [res, setRes] = React.useState<any>(null);
  React.useEffect(()=>{ fetch('/admin/a11y/quickcheck').then(r=>r.json()).then(setRes); },[]);
  return (<div data-testid="a11y-check">
    <h2 className="text-xl font-semibold">Accessibility Quick Check</h2>
    <pre className="mt-2 bg-gray-50 p-3 rounded text-xs">{JSON.stringify(res, null, 2)}</pre>
  </div>);
}