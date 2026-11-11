'use client';
import Link from 'next/link';import {useEffect,useState} from 'react';
import {thoughtOf,habitsOf,greet,istDay,istDate} from '@/lib/thoughts';
const KEY='mero-divas-v1';
export default function DayCard(){
  const [ready,setReady]=useState(false);const [log,setLog]=useState<Record<string,boolean[]>>({});const [today,setToday]=useState('');const [dt,setDt]=useState('');
  useEffect(()=>{const t=istDate();setToday(t);setDt(new Date().toLocaleDateString('gu-IN',{weekday:'long',day:'numeric',month:'long',timeZone:'Asia/Kolkata'}));try{setLog(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{}setReady(true)},[]);
  if(!ready)return <div className="my-5 h-[230px] skel rounded-3xl"/>;
  const habits=habitsOf(istDay()),mine=log[today]||[false,false,false],done=mine.filter(Boolean).length;
  const tick=(i:number)=>{const n=[...mine];n[i]=!n[i];const nl={...log,[today]:n};try{const keys=Object.keys(nl).sort().slice(-60);const o:any={};keys.forEach(k=>o[k]=nl[k]);localStorage.setItem(KEY,JSON.stringify(o));setLog(o)}catch{setLog(nl)};try{navigator.vibrate?.(20)}catch{}};
  const day=(k:number)=>new Date(Date.now()+5.5*3600e3-k*864e5).toISOString().slice(0,10);
  const act=(d:string)=>(log[d]||[]).some(Boolean);
  let streak=0;for(let k=act(day(0))?0:1;k<60&&act(day(k));k++)streak++;
  const week=[6,5,4,3,2,1,0].map(k=>({d:day(k),on:act(day(k)),lbl:new Date(day(k)+'T12:00:00Z').toLocaleDateString('gu-IN',{weekday:'narrow',timeZone:'UTC'})}));
  return <section className="my-5 rounded-3xl overflow-hidden relative bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 text-white shadow-lg">
    <div className="absolute -right-6 -top-10 text-[160px] opacity-15 select-none">🌅</div>
    <div className="relative grid md:grid-cols-5 gap-5 p-5 sm:p-7">
      <div className="md:col-span-3 flex flex-col">
        <div className="flex items-center gap-2 flex-wrap text-sm font-bold"><span className="bg-white/25 backdrop-blur rounded-full px-3 py-1">{greet()} 🌅</span><span className="opacity-90">{dt}</span></div>
        <p className="font-head text-2xl sm:text-[34px] font-bold leading-snug mt-4 flex-1">“{thoughtOf()}”</p>
        <div className="flex gap-2 mt-5 flex-wrap"><Link href="/suvichar" className="bg-white text-red font-black rounded-full px-5 py-2.5 text-sm shadow hover:scale-105 transition">🖼 કાર્ડ બનાવી WhatsApp પર મોકલો</Link><Link href="/frame" className="bg-white/20 backdrop-blur font-bold rounded-full px-5 py-2.5 text-sm hover:bg-white/30 transition">🎨 ફેસ્ટિવલ ફ્રેમ</Link></div>
      </div>
      <div className="md:col-span-2 rounded-2xl bg-black/20 backdrop-blur p-4">
        <div className="flex items-center justify-between"><b className="text-lg">🎯 આજના સંકલ્પ</b><span className="bg-white/20 rounded-full px-3 py-1 text-sm font-black">🔥 {streak} દિવસ</span></div>
        <div className="mt-3 space-y-2">{habits.map((h,i)=><button key={i} onClick={()=>tick(i)} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-semibold transition ${mine[i]?'bg-white text-neutral-900':'bg-white/15 hover:bg-white/25'}`}><span className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center text-sm ${mine[i]?'bg-emerald-500 border-emerald-500 text-white':'border-white/70'}`}>{mine[i]?'✓':''}</span><span className={mine[i]?'line-through opacity-60':''}>{h}</span></button>)}</div>
        <div className="mt-3 flex items-center justify-between"><div className="flex gap-1.5">{week.map(w=><span key={w.d} className="text-center"><span className={`block w-7 h-7 rounded-full text-[11px] font-black leading-7 ${w.on?'bg-emerald-400 text-emerald-950':'bg-white/20'} ${w.d===today?'ring-2 ring-white':''}`}>{w.on?'✓':''}</span><span className="text-[10px] opacity-80">{w.lbl}</span></span>)}</div><span className="text-xs font-bold opacity-90">{done===3?'🎉 શાબાશ!':`${done}/3 પૂર્ણ`}</span></div>
      </div></div></section>}
