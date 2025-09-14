import React from 'react';
export default function PricingUpsell(){
  const [plans,setPlans]=React.useState<any>(null); const [trial,setTrial]=React.useState<any>(null);
  React.useEffect(()=>{ fetch('/pricing/plans').then(r=>r.json()).then(setPlans); fetch('/pricing/trial/status').then(r=>r.json()).then(setTrial); },[]);
  async function start(){ await fetch('/pricing/trial/start',{method:'POST'}); setTrial(await (await fetch('/pricing/trial/status')).json()); }
  return <div data-testid="pricing-upsell"><h2>Plans & Trials</h2><pre>{JSON.stringify(plans,null,2)}</pre><div>Trial: {trial?.active? `${trial.days_remaining} days left` : <button onClick={start}>Start Trial</button>}</div></div>;
}