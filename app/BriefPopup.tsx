'use client';
import Link from 'next/link';import {useEffect,useMemo,useState} from 'react';
type N={slug:string,title:string,img?:string|null,cat?:string,place?:string};
type F={id:number,claim:string,verdict:string};
type P={id:number,title:string,by?:string|null,late:number};
const KEY='brief-day-v1';
const V:Record<string,[string,string,string]>={false:['❌','ખોટું','bg-red'],true:['✅','સાચું','bg-emerald-600'],misleading:['⚠️','ભ્રામક','bg-amber-500'],unverified:['❓','પુષ્ટિ નથી','bg-neutral-500'],checking:['⏳','તપાસ ચાલુ','bg-sky-600']};
const istDate=()=>new Date(Date.now()+5.5*3600e3).toISOString().slice(0,10);
// Once-a-day "today at a glance" pop-up: top news, latest rumour checks and overdue promises.
export default function Brief({news,facts,promises}:{news:N[],facts:F[],promises:P[]}){
  const tabs=useMemo(()=>[news.length&&['news','📰','ટોપ સમાચાર',news.length],facts.length&&['facts','🔍','અફવા ચેક',facts.length],promises.length&&['prom','⏳','મોડા વચન',promises.length]].filter(Boolean) as [string,string,string,number][],[news,facts,promises]);
  const [open,setOpen]=useState(false);const [tab,setTab]=useState(tabs[0]?.[0]||'news');const [dt,setDt]=useState('');
  const close=()=>{setOpen(false);try{localStorage.setItem(KEY,istDate())}catch{}};
  useEffect(()=>{if(!tabs.length||location.search||location.hash)return;try{if(localStorage.getItem(KEY)===istDate())return}catch{}
    setDt(new Date().toLocaleDateString('gu-IN',{weekday:'long',day:'numeric',month:'long',timeZone:'Asia/Kolkata'}));const t=setTimeout(()=>setOpen(true),2200);return()=>clearTimeout(t)},[tabs.length]);
  useEffect(()=>{if(!open)return;const k=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};addEventListener('keydown',k);const o=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{removeEventListener('keydown',k);document.body.style.overflow=o}},[open]);
  if(!open)return null;
  const Row=({h,children}:{h:string,children:React.ReactNode})=><Link href={h} onClick={close} className="flex items-start gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-3 hover:border-red/60 hover:bg-red/5 transition">{children}</Link>;
  return <div className="fixed inset-0 z-[900] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-label="આજની ખાસ ઝલક">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close}/>
    <div className="brief-in relative w-full sm:max-w-lg max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl">
      <div className="relative shrink-0 bg-gradient-to-br from-red via-rose-600 to-orange-500 text-white px-5 pt-5 pb-4">
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/10"/>
        <button onClick={close} aria-label="બંધ કરો" className="absolute right-3 top-3 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 text-lg z-10">✕</button>
        <div className="relative flex items-center gap-3"><img src="/logo.png" alt="" className="w-12 h-12 rounded-full bg-white p-0.5"/><div><div className="font-head text-2xl font-bold leading-tight">આજની ખાસ ઝલક</div><div className="text-sm opacity-90">{dt}</div></div></div>
        <div className="relative flex gap-2 mt-4 overflow-x-auto no-scrollbar">{tabs.map(([k,i,l,n])=><button key={k} onClick={()=>setTab(k)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${tab===k?'bg-white text-red shadow':'bg-white/20 hover:bg-white/30'}`}>{i} {l} <span className="opacity-70">({n})</span></button>)}</div>
      </div>
      <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
        {tab==='news'&&news.map((n,i)=><Row key={n.slug} h={`/news/${n.slug}`}><span className="w-7 h-7 shrink-0 rounded-full bg-red text-white text-sm font-black flex items-center justify-center mt-0.5">{i+1}</span><div className="min-w-0 flex-1"><div className="font-bold leading-snug line-clamp-2">{n.title}</div><div className="text-xs text-neutral-500 mt-1">{[n.cat,n.place].filter(Boolean).join(' • ')}</div></div>{n.img&&<img src={n.img} alt="" loading="lazy" className="w-16 h-14 rounded-lg object-cover shrink-0"/>}</Row>)}
        {tab==='facts'&&<>{facts.map(f=>{const v=V[f.verdict]||V.checking;return <Row key={f.id} h="/afwah"><span className={`${v[2]} text-white text-xs font-black rounded-lg px-2 py-1 shrink-0 mt-0.5`}>{v[0]} {v[1]}</span><div className="font-semibold leading-snug line-clamp-3 flex-1">{f.claim}</div></Row>})}<p className="text-xs text-neutral-500 px-1">WhatsApp પર આવેલો કોઈ મેસેજ શંકાસ્પદ લાગે તો અમને મોકલો – અમે તપાસીશું.</p></>}
        {tab==='prom'&&<>{promises.map(p=><Row key={p.id} h="/vachan"><span className="shrink-0 bg-red text-white text-xs font-black rounded-lg px-2 py-1 mt-0.5">🔴 {p.late} દિવસ મોડું</span><div className="flex-1 min-w-0"><div className="font-semibold leading-snug line-clamp-2">{p.title}</div>{p.by&&<div className="text-xs text-neutral-500 mt-1">🗣 {p.by}</div>}</div></Row>)}<p className="text-xs text-neutral-500 px-1">સમયમર્યાદા પૂરી થઈ ગઈ હોય અને કામ બાકી હોય તેવા વચનો.</p></>}
      </div>
      <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 p-3 grid grid-cols-3 gap-2 pb-[max(12px,env(safe-area-inset-bottom))]">
        <Link href="/stories" onClick={close} className="rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white text-center py-2.5 text-sm font-black">⚡ સ્ટોરીઝ</Link>
        <Link href="/radio" onClick={close} className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white text-center py-2.5 text-sm font-black">📻 રેડિયો</Link>
        <Link href="/seva" onClick={close} className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-center py-2.5 text-sm font-black">✨ સેવાઓ</Link>
      </div>
    </div></div>}
