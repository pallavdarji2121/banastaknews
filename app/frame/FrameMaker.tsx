'use client';
import {useEffect,useRef,useState} from 'react';
import {THEMES,drawFrame,fontFamily,loadFonts,loadImage,download,share} from '@/lib/card';
export default function FM(){
  const [name,setName]=useState('');const [th,setTh]=useState(0);const [zoom,setZoom]=useState(1);const [ox,setOx]=useState(0);const [oy,setOy]=useState(0);const [msg,setMsg]=useState('');
  const ref=useRef<HTMLCanvasElement>(null);const logo=useRef<HTMLImageElement|null>(null);const [photo,setPhoto]=useState<HTMLImageElement|null>(null);const [ready,setReady]=useState(false);
  useEffect(()=>{let ok=true;(async()=>{logo.current=await loadImage('/logo.png');await loadFonts(fontFamily());if(ok)setReady(true)})();return()=>{ok=false}},[]);
  useEffect(()=>{if(ref.current)drawFrame(ref.current,{name,theme:th,logo:logo.current,photo,zoom,ox,oy,fam:fontFamily()})},[name,th,photo,zoom,ox,oy,ready]);
  const pick=async(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const u=URL.createObjectURL(f);const i=await loadImage(u);if(i){setPhoto(i);setZoom(1);setOx(0);setOy(0)}};
  const sh=async()=>{if(!ref.current)return;const r=await share(ref.current,'diwali-frame.png','દિવાળીની હાર્દિક શુભેચ્છાઓ 🪔');setMsg(r==='saved'?'ફ્રેમ ડાઉનલોડ થઈ ગઈ છે – હવે WhatsApp માં જોડીને મોકલો ✅':'')};
  const R=({l,v,s,min,max}:{l:string,v:number,s:(n:number)=>void,min:number,max:number})=><label className="block text-sm font-semibold">{l}<input type="range" min={min} max={max} step={0.01} value={v} onChange={e=>s(+e.target.value)} className="w-full accent-red"/></label>;
  return <div className="grid gap-6 md:grid-cols-2 items-start">
    <canvas ref={ref} className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"/>
    <div className="space-y-4">
      <label className="block"><span className="font-bold block mb-1">1️⃣ તમારો ફોટો પસંદ કરો</span><input type="file" accept="image/*" onChange={pick} className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-red file:text-white file:font-bold file:px-4 file:py-2.5"/></label>
      {photo&&<div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3 space-y-2"><R l="🔍 ઝૂમ" v={zoom} s={setZoom} min={1} max={3}/><R l="↔ ડાબે / જમણે" v={ox} s={setOx} min={-1} max={1}/><R l="↕ ઉપર / નીચે" v={oy} s={setOy} min={-1} max={1}/></div>}
      <div><label className="font-bold block mb-1">2️⃣ અટક / પરિવારનું નામ</label><input value={name} onChange={e=>setName(e.target.value)} maxLength={28} placeholder="દા.ત. પટેલ" className="inp !py-3 text-lg"/></div>
      <div><div className="font-bold mb-2">3️⃣ રંગ</div><div className="flex gap-3">{THEMES.map((t,i)=><button key={t.id} onClick={()=>setTh(i)} aria-label={t.label} className={`w-11 h-11 rounded-full border-4 transition ${th===i?'border-amber-400 scale-110':'border-transparent opacity-80'}`} style={{background:t.sw}}/>)}</div></div>
      <div className="flex gap-3 flex-wrap"><button onClick={()=>ref.current&&download(ref.current,'diwali-frame.png')} className="btnr !py-3 flex-1">⬇ ડાઉનલોડ</button><button onClick={sh} className="btn !py-3 flex-1">💬 WhatsApp પર મોકલો</button></div>
      {msg&&<p className="text-sm text-green-600 font-semibold">{msg}</p>}
      <p className="text-sm text-neutral-500">ફોટો તમારા ફોનમાં જ રહે છે – અમારા સર્વર પર અપલોડ થતો નથી. WhatsApp સ્ટેટસ / DP માટે પરફેક્ટ.</p>
    </div></div>}
