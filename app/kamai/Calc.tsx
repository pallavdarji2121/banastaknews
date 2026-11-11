'use client';
import {useMemo,useState} from 'react';
type R={m:string,c:string,lo:number,hi:number,d:string};
const U:[string,string,number][]=[['mann','મણ (20 કિલો)',1],['kg','કિલો',0.05],['qtl','ક્વિન્ટલ (100 કિલો)',5],['ton','ટન (1000 કિલો)',50]];
const inr=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN');
export default function Calc({rows}:{rows:R[]}){
  const crops=useMemo(()=>[...new Set(rows.map(r=>r.c))],[rows]);
  const [crop,setCrop]=useState(crops[0]);const [qty,setQty]=useState('10');const [u,setU]=useState('mann');const [cost,setCost]=useState('');
  const per=U.find(x=>x[0]===u)![2];const mann=Math.max(0,parseFloat(qty)||0)*per;const c=Math.max(0,parseFloat(cost)||0);
  const list=useMemo(()=>rows.filter(r=>r.c===crop).map(r=>{const lo=r.lo*mann,hi=r.hi*mann,avg=(lo+hi)/2;return {...r,low:lo,high:hi,avg,net:avg-c}}).sort((a,b)=>b.avg-a.avg),[rows,crop,mann,c]);
  const best=list[0],worst=list[list.length-1],max=Math.max(1,...list.map(x=>x.high));
  return <div>
    <div className="font-bold mb-2">1️⃣ પાક પસંદ કરો</div>
    <div className="flex gap-2 flex-wrap mb-5">{crops.map(x=><button key={x} onClick={()=>setCrop(x)} className={`px-4 py-2 rounded-full border-2 font-bold transition ${crop===x?'bg-red text-white border-red scale-105 shadow':'border-neutral-200 dark:border-neutral-700 hover:border-red'}`}>{x}</button>)}</div>
    <div className="grid sm:grid-cols-3 gap-3 mb-6">
      <label className="block"><span className="font-bold block mb-1">2️⃣ જથ્થો</span><input value={qty} onChange={e=>setQty(e.target.value)} inputMode="decimal" className="inp !py-3 text-xl font-bold"/></label>
      <label className="block"><span className="font-bold block mb-1">એકમ</span><select value={u} onChange={e=>setU(e.target.value)} className="inp !py-3 text-lg">{U.map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select></label>
      <label className="block"><span className="font-bold block mb-1">3️⃣ કુલ ખર્ચ ₹ <span className="font-normal text-neutral-500 text-xs">(ભાડું, મજૂરી, કમિશન)</span></span><input value={cost} onChange={e=>setCost(e.target.value)} inputMode="numeric" placeholder="0" className="inp !py-3 text-xl font-bold"/></label>
    </div>
    {best&&mann>0&&<div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-green-800 text-white p-5 sm:p-7 mb-6 shadow-lg"><div className="text-sm font-bold opacity-90">🏆 સૌથી વધુ કમાણી</div><div className="font-head text-3xl sm:text-4xl font-bold mt-1">{best.m}</div><div className="mt-2 text-lg">{mann.toLocaleString('en-IN',{maximumFractionDigits:1})} મણ {crop} → <b className="text-2xl">{inr(best.low-c)} થી {inr(best.high-c)}</b></div>
      {list.length>1&&best.avg-worst.avg>0&&<div className="mt-3 inline-block bg-white/20 rounded-full px-4 py-1.5 text-sm font-bold">સૌથી ઓછા ભાવવાળા {worst.m} કરતાં સરેરાશ {inr(best.avg-worst.avg)} વધુ ✨</div>}</div>}
    <div className="space-y-3">{list.map((x,i)=><div key={x.m} className={`rounded-2xl border p-4 ${i===0&&mann>0?'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30':'border-neutral-200 dark:border-neutral-700'}`}>
      <div className="flex items-center justify-between gap-3 flex-wrap"><div className="font-black text-lg">{i===0&&mann>0&&'🏆 '}{x.m}</div><div className="text-sm text-neutral-500">મણ દીઠ ₹{x.lo} – ₹{x.hi} • {new Date(x.d+'T12:00:00+05:30').toLocaleDateString('gu-IN',{day:'numeric',month:'short',timeZone:'Asia/Kolkata'})}</div></div>
      <div className="mt-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden relative"><div className="absolute inset-y-0 left-0 bg-emerald-300" style={{width:`${x.high/max*100}%`}}/><div className="absolute inset-y-0 left-0 bg-emerald-600" style={{width:`${x.low/max*100}%`}}/></div>
      <div className="mt-2 flex justify-between gap-2 flex-wrap text-sm"><span>ઓછામાં ઓછા: <b>{inr(x.low)}</b></span><span>વધુમાં વધુ: <b>{inr(x.high)}</b></span><span className="font-black text-emerald-700 dark:text-emerald-400">ખર્ચ બાદ સરેરાશ: {inr(x.net)}</span></div></div>)}</div>
    <p className="text-xs text-neutral-500 mt-5">ભાવ માર્કેટયાર્ડના તાજેતરના જાહેર ભાવ છે (પ્રતિ 20 કિલો). પાકની ગુણવત્તા અને દિવસ પ્રમાણે ભાવ બદલાઈ શકે – વેચતા પહેલાં માર્કેટયાર્ડમાં પૂછી લો.</p></div>}
