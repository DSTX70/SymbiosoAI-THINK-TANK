import { Router } from 'express';
const r = Router();
type Event = { id:string; orgId?:string; userId?:string; type:string; props:any; ts:number };
const events: Event[] = [];
r.post('/telemetry/event', (req, res) => {
  if (String(process.env.TELEMETRY_ALLOW||'true')!=='true') return res.status(403).json({ ok:false });
  events.push({ id:String(Date.now()), orgId:(req as any).orgId||'demo-org', userId:(req as any).user?.id||'user', type:req.body?.type||'unknown', props:req.body?.props||{}, ts:Date.now() });
  res.status(201).json({ ok:true });
});
r.post('/telemetry/nps', (req, res) => {
  events.push({ id:String(Date.now()), type:'nps.submit', props:{ score:Number(req.body?.score||0), comment:req.body?.comment }, ts:Date.now() });
  res.status(201).json({ ok:true });
});
export default r;