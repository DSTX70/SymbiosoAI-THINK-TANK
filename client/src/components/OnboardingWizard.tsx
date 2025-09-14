import React from 'react';
export default function OnboardingWizard(){
  const [p,setP]=React.useState<any>(null);
  React.useEffect(()=>{ fetch('/onboarding/progress').then(r=>r.json()).then(setP); },[]);
  async function done(k:string){ await fetch('/onboarding/complete-step',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:k})}); setP(await (await fetch('/onboarding/progress')).json()); }
  if(!p) return <div>Loading…</div>;
  return <div data-testid="onboarding-wizard"><h2>Welcome</h2><ul>{Object.keys(p.steps).map((k:any)=><li key={k}>{k} {p.steps[k]?'✅':<button onClick={()=>done(k)}>Mark</button>}</li>)}</ul>{p.completed&&<div>All set! 🎉</div>}</div>;
}