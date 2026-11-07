'use client';
import {useEffect,useState} from 'react';
type Slot={n:string,good:boolean,s:number,e:number};type Block={label:string,kind:'day'|'night',slots:Slot[]};
const T=(ms:number)=>new Date(ms).toLocaleTimeString('gu-IN',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Kolkata'});
export default function PL({blocks}:{blocks:Block[]}){
  const [now,setNow]=useState(0);
  useEffect(()=>{setNow(Date.now());const i=setInterval(()=>setNow(Date.now()),30000);return()=>clearInterval(i)},[]);
  const cur=now?blocks.flatMap(b=>b.slots).find(s=>now>=s.s&&now<s.e):null;
  return <div>
    {cur&&<div className={`rounded-3xl p-5 sm:p-6 text-white mb-5 ${cur.good?'bg-gradient-to-br from-emerald-500 to-green-800':'bg-gradient-to-br from-rose-500 to-red-800'}`}>
      <div className="text-sm opacity-90">⏱ અત્યારનું ચોઘડિયું</div>
      <div className="text-5xl font-head font-bold mt-1">{cur.n}</div>
      <div className="mt-1 font-semibold">{cur.good?'✅ શુભ – નવું કામ શરૂ કરવા માટે સારો સમય':'⚠️ અશુભ – મહત્વનું નવું કામ ટાળવું'}</div>
      <div className="text-sm opacity-90 mt-1">{T(cur.s)} થી {T(cur.e)}</div></div>}
    {blocks.slice(1).map(b=><div key={b.label} className="mb-6"><h3 className="font-bold text-lg mb-2">{b.kind==='day'?'☀️':'🌙'} {b.label} ચોઘડિયા</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{b.slots.map(s=>{const on=cur===s;return <div key={s.s} className={`rounded-xl border p-3 text-center transition ${s.good?'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800':'border-rose-300 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800'} ${on?'ring-4 ring-amber-400 scale-105':''}`}><div className={`font-bold text-lg ${s.good?'text-emerald-700 dark:text-emerald-300':'text-red'}`}>{s.n}</div><div className="text-xs text-neutral-600 dark:text-neutral-300">{T(s.s)} – {T(s.e)}</div>{on&&<div className="text-[11px] font-bold text-amber-600 mt-1">● અત્યારે</div>}</div>})}</div></div>)}
  </div>}
