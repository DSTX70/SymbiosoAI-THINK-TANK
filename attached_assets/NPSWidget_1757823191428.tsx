import React,{useState} from 'react';
export default function NPSWidget(){
  const [score,setScore]=useState(10); const [sent,setSent]=useState(false);
  async function send(){ await fetch('/telemetry/nps',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({score,comment:'Great so far!'})}); setSent(true); }
  if(sent) return <div data-testid="nps-sent">Thanks!</div>;
  return <div data-testid="nps-widget"><input type="number" min={0} max={10} value={score} onChange={e=>setScore(Number(e.target.value))}/><button onClick={send}>Send NPS</button></div>;
}