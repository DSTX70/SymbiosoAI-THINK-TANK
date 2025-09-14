// backend/utils/errors.ts
export type ErrorEnvelope = { ok:false; code:string; message:string; detail?:any };
export function err(code:string, message:string, detail?:any): ErrorEnvelope { return { ok:false, code, message, detail }; }
