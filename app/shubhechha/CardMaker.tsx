'use client';
import {useEffect,useRef,useState} from 'react';
import {THEMES,drawCard,fontFamily,loadFonts,loadImage,download,share} from '@/lib/card';
export default function CM(){
  const [name,setName]=useState('');const [th,setTh]=useState(0);const [msg,setMsg]=useState('');
  const ref=useRef<HTMLCanvasElement>(null);const logo=useRef<HTMLImageElement|null>(null);const [ready,setReady]=useState(false);
  useEffect(()=>{let ok=true;(async()=>{logo.current=await loadImage('/logo.png');await loadFonts(fontFamily());if(ok)setReady(true)})();return()=>{ok=false}},[]);
  useEffect(()=>{if(ref.current)drawCard(ref.current,{name,theme:th,logo:logo.current,fam:fontFamily()})},[name,th,ready]);
  const dl=()=>{if(ref.current)download(ref.current,'diwali-shubhechha.png')};
  const sh=async()=>{if(!ref.current)return;const r=await share(ref.current,'diwali-shubhechha.png','દિવાળીની હાર્દિક શુભેચ્છાઓ 🪔');setMsg(r==='saved'?'કાર્ડ ડાઉનલોડ થઈ ગયું છે – હવે WhatsApp માં જોડીને મોકલો ✅':'')};
  return <div className="grid gap-6 md:grid-cols-2 items-start">
    <canvas ref={ref} className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"/>
    <div className="space-y-5">
      <div><label className="font-bold block mb-1">તમારી અટક / પરિવારનું નામ</label><input value={name} onChange={e=>setName(e.target.value)} maxLength={28} placeholder="દા.ત. પટેલ" className="inp !py-3 text-lg"/></div>
      <div><div className="font-bold mb-2">કાર્ડનો રંગ</div><div className="flex gap-3">{THEMES.map((t,i)=><button key={t.id} onClick={()=>setTh(i)} aria-label={t.label} className={`w-12 h-12 rounded-full border-4 transition ${th===i?'border-amber-400 scale-110':'border-transparent opacity-80'}`} style={{background:t.sw}}/>)}</div></div>
      <div className="flex gap-3 flex-wrap"><button onClick={dl} className="btnr !py-3 flex-1">⬇ ડાઉનલોડ</button><button onClick={sh} className="btn !py-3 flex-1">💬 WhatsApp પર મોકલો</button></div>
      {msg&&<p className="text-sm text-green-600 font-semibold">{msg}</p>}
      <p className="text-sm text-neutral-500">કાર્ડ તમારા ફોનમાં જ બને છે – કંઈ અપલોડ થતું નથી.</p>
    </div></div>}
