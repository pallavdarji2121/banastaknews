'use client';
import {useEffect,useRef,useState} from 'react';
import {FESTS,festById} from '@/lib/festivals';
import {drawFrame,fontFamily,loadFonts,loadImage,download,share} from '@/lib/card';
export default function FM({initial}:{initial:string}){
  const [fid,setFid]=useState(festById(initial).id);const [name,setName]=useState('');const [msg,setMsg]=useState('');const [shape,setShape]=useState<'circle'|'square'>('circle');
  const [zoom,setZoom]=useState(1);const [ox,setOx]=useState(0);const [oy,setOy]=useState(0);const [note,setNote]=useState('');
  const ref=useRef<HTMLCanvasElement>(null);const logo=useRef<HTMLImageElement|null>(null);const [photo,setPhoto]=useState<HTMLImageElement|null>(null);const [ready,setReady]=useState(false);
  useEffect(()=>{let ok=true;(async()=>{logo.current=await loadImage('/logo.png');await loadFonts(fontFamily());if(ok)setReady(true)})();return()=>{ok=false}},[]);
  useEffect(()=>{if(ref.current)drawFrame(ref.current,{f:festById(fid),name,msg,shape,logo:logo.current,photo,zoom,ox,oy,fam:fontFamily()})},[fid,name,msg,shape,photo,zoom,ox,oy,ready]);
  useEffect(()=>{document.getElementById('fc-'+fid)?.scrollIntoView({inline:'center',block:'nearest'})},[fid]);
  const f=festById(fid);
  const pick=async(e:React.ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(!file)return;const i=await loadImage(URL.createObjectURL(file));if(i){setPhoto(i);setZoom(1);setOx(0);setOy(0)}};
  const file=`${fid}-frame.png`;
  const sh=async()=>{if(!ref.current)return;const r=await share(ref.current,file,f.wish+' '+f.e);setNote(r==='saved'?'ફ્રેમ ડાઉનલોડ થઈ ગઈ છે – હવે WhatsApp માં જોડીને મોકલો ✅':'')};
  const Rail=({g,t}:{g:'fest'|'special',t:string})=><div><div className="text-xs font-black text-neutral-500 mb-1.5 tracking-wide">{t}</div><div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">{FESTS.filter(x=>x.g===g).map(x=><button key={x.id} id={'fc-'+x.id} onClick={()=>setFid(x.id)} className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition ${fid===x.id?'bg-red text-white border-red shadow-md scale-105':'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-red'}`}><span className="text-lg leading-none">{x.e}</span>{x.name}</button>)}</div></div>;
  const R=({l,v,s,min,max}:{l:string,v:number,s:(n:number)=>void,min:number,max:number})=><label className="block text-sm font-semibold">{l}<input type="range" min={min} max={max} step={0.01} value={v} onChange={e=>s(+e.target.value)} className="w-full accent-red"/></label>;
  return <div>
    <div className="space-y-3 mb-6"><Rail g="fest" t="🪔 તહેવાર પસંદ કરો"/><Rail g="special" t="🎉 ખાસ પ્રસંગ"/></div>
    <div className="grid gap-6 md:grid-cols-2 items-start">
      <div className="md:sticky md:top-24"><canvas ref={ref} className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"/></div>
      <div className="space-y-4">
        <label className="block"><span className="font-bold block mb-1">1️⃣ તમારો ફોટો પસંદ કરો</span><input type="file" accept="image/*" onChange={pick} className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-red file:text-white file:font-bold file:px-4 file:py-2.5"/></label>
        {photo&&<div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3 space-y-2"><R l="🔍 ઝૂમ" v={zoom} s={setZoom} min={1} max={3}/><R l="↔ ડાબે / જમણે" v={ox} s={setOx} min={-1} max={1}/><R l="↕ ઉપર / નીચે" v={oy} s={setOy} min={-1} max={1}/></div>}
        <div><div className="font-bold mb-2">2️⃣ ફ્રેમનો આકાર</div><div className="flex gap-2">{([['circle','⚪ ગોળ'],['square','⬜ ચોરસ']] as const).map(([k,l])=><button key={k} onClick={()=>setShape(k)} className={`flex-1 rounded-xl border-2 py-2.5 font-bold transition ${shape===k?'border-red bg-red/10 text-red':'border-neutral-200 dark:border-neutral-700'}`}>{l}</button>)}</div></div>
        <div><label className="font-bold block mb-1">3️⃣ અટક / પરિવારનું નામ <span className="font-normal text-neutral-500 text-sm">(વૈકલ્પિક)</span></label><input value={name} onChange={e=>setName(e.target.value)} maxLength={28} placeholder="દા.ત. પટેલ" className="inp !py-3 text-lg"/></div>
        <div><label className="font-bold block mb-1">4️⃣ તમારો સંદેશ <span className="font-normal text-neutral-500 text-sm">(ખાલી રાખો તો {f.name}ની શુભેચ્છા)</span></label><input value={msg} onChange={e=>setMsg(e.target.value)} maxLength={90} placeholder={f.wish} className="inp !py-3"/></div>
        <div className="flex gap-3 flex-wrap pt-1"><button onClick={()=>ref.current&&download(ref.current,file)} className="btnr !py-3 flex-1">⬇ ડાઉનલોડ</button><button onClick={sh} className="btn !py-3 flex-1">💬 WhatsApp પર મોકલો</button></div>
        {note&&<p className="text-sm text-green-600 font-semibold">{note}</p>}
        <p className="text-sm text-neutral-500">ફોટો તમારા ફોનમાં જ રહે છે – અમારા સર્વર પર અપલોડ થતો નથી. WhatsApp સ્ટેટસ / DP / Facebook માટે પરફેક્ટ.</p>
      </div></div></div>}
