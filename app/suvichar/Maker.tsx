'use client';
import {useEffect,useRef,useState} from 'react';
import {MOODS,drawThought,fontFamily,loadFonts,loadImage,download,share} from '@/lib/card';
import {thoughtOf,greet,istDay} from '@/lib/thoughts';
const GR=['શુભ સવાર','શુભ બપોર','શુભ સાંજ','શુભ રાત્રિ','શુભ દિવસ'];
export default function M(){
  const [shift,setShift]=useState(0);const [g,setG]=useState('શુભ સવાર');const [name,setName]=useState('');const [mood,setMood]=useState(0);const [own,setOwn]=useState('');const [date,setDate]=useState('');const [note,setNote]=useState('');
  const ref=useRef<HTMLCanvasElement>(null);const logo=useRef<HTMLImageElement|null>(null);const [ready,setReady]=useState(false);
  useEffect(()=>{setG(greet());setDate(new Date().toLocaleDateString('gu-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'}));let ok=true;(async()=>{logo.current=await loadImage('/logo.png');await loadFonts(fontFamily());if(ok)setReady(true)})();return()=>{ok=false}},[]);
  const text=own.trim()||thoughtOf(istDay(),shift);
  useEffect(()=>{if(ref.current&&date)drawThought(ref.current,{text,greet:g,name,mood,date,logo:logo.current,fam:fontFamily()})},[text,g,name,mood,date,ready]);
  const sh=async()=>{if(!ref.current)return;const r=await share(ref.current,'suvichar.png',g+' 🌅');setNote(r==='saved'?'કાર્ડ ડાઉનલોડ થઈ ગયું છે – હવે WhatsApp માં જોડીને મોકલો ✅':'')};
  return <div className="grid gap-6 md:grid-cols-2 items-start">
    <div className="md:sticky md:top-24"><canvas ref={ref} className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"/></div>
    <div className="space-y-5">
      <div><div className="font-bold mb-2">1️⃣ શુભેચ્છા</div><div className="flex gap-2 flex-wrap">{GR.map(x=><button key={x} onClick={()=>setG(x)} className={`px-3.5 py-2 rounded-full border text-sm font-bold transition ${g===x?'bg-red text-white border-red':'hover:border-red'}`}>{x}</button>)}</div></div>
      <div><div className="font-bold mb-2">2️⃣ સુવિચાર</div><div className="flex gap-2 items-start"><p className="flex-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3 font-semibold leading-relaxed">{own.trim()?'(તમારો પોતાનો સુવિચાર)':text}</p><button onClick={()=>{setOwn('');setShift(s=>s+1)}} className="btn !py-3 shrink-0">🔀 બીજો</button></div>
        <textarea value={own} onChange={e=>setOwn(e.target.value.slice(0,170))} rows={2} placeholder="અથવા તમારો પોતાનો સુવિચાર લખો…" className="inp mt-2"/></div>
      <div><div className="font-bold mb-2">3️⃣ રંગ</div><div className="flex gap-2 flex-wrap">{MOODS.map((m,i)=><button key={m.id} onClick={()=>setMood(i)} className={`flex items-center gap-2 rounded-full border-2 pl-1.5 pr-3 py-1.5 text-sm font-bold transition ${mood===i?'border-red scale-105':'border-transparent bg-neutral-100 dark:bg-neutral-800'}`}><span className="w-6 h-6 rounded-full" style={{background:`linear-gradient(135deg,${m.a},${m.c})`}}/>{m.label}</button>)}</div></div>
      <div><label className="font-bold block mb-1">4️⃣ તમારું નામ <span className="font-normal text-neutral-500 text-sm">(વૈકલ્પિક)</span></label><input value={name} onChange={e=>setName(e.target.value)} maxLength={28} placeholder="દા.ત. રમેશભાઈ" className="inp !py-3 text-lg"/></div>
      <div className="flex gap-3 flex-wrap"><button onClick={()=>ref.current&&download(ref.current,'suvichar.png')} className="btnr !py-3 flex-1">⬇ ડાઉનલોડ</button><button onClick={sh} className="btn !py-3 flex-1">💬 WhatsApp પર મોકલો</button></div>
      {note&&<p className="text-sm text-green-600 font-semibold">{note}</p>}
    </div></div>}
