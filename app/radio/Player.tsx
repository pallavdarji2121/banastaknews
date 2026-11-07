'use client';
import Link from 'next/link';import {useCallback,useEffect,useRef,useState} from 'react';
type N={id:number,slug:string,title:string,summary?:string|null,cat?:string,place?:string};
export default function Player({items}:{items:N[]}){
  const [i,setI]=useState(0);const [on,setOn]=useState(false);const [rate,setRate]=useState(1);const [ok,setOk]=useState(true);const [vn,setVn]=useState('');
  const voice=useRef<SpeechSynthesisVoice|null>(null);const tok=useRef(0);const rt=useRef(1);const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{rt.current=rate},[rate]);
  useEffect(()=>{if(!('speechSynthesis' in window)){setOk(false);return}
    const pick=()=>{const v=speechSynthesis.getVoices();const g=v.find(x=>x.lang.toLowerCase().startsWith('gu'))||v.find(x=>x.lang.toLowerCase().startsWith('hi'))||null;voice.current=g;setVn(g?(g.lang.toLowerCase().startsWith('gu')?'':'ગુજરાતી અવાજ મળ્યો નથી, હિન્દી અવાજ વાપરી રહ્યા છીએ. Android માં “Google Text-to-speech” માં ગુજરાતી વૉઇસ ડાઉનલોડ કરો.'):'આ ફોન/બ્રાઉઝરમાં ગુજરાતી વૉઇસ ઉપલબ્ધ નથી – Chrome (Android) માં સૌથી સારું ચાલશે.')};
    pick();speechSynthesis.onvoiceschanged=pick;return()=>{speechSynthesis.onvoiceschanged=null;speechSynthesis.cancel()}},[]);
  const speak=useCallback((k:number)=>{if(!items[k])return;const my=++tok.current;speechSynthesis.cancel();setI(k);setOn(true);
    const n=items[k];const t=`સમાચાર ${k+1}. ${n.title}. ${(n.summary||'').slice(0,320)}`;const u=new SpeechSynthesisUtterance(t);if(voice.current){u.voice=voice.current;u.lang=voice.current.lang}else u.lang='gu-IN';u.rate=rt.current;
    u.onend=()=>{if(my!==tok.current)return;if(k+1<items.length)speak(k+1);else setOn(false)};u.onerror=()=>{if(my===tok.current)setOn(false)};speechSynthesis.speak(u)},[items]);
  useEffect(()=>{ref.current?.querySelector('[data-on="1"]')?.scrollIntoView({block:'nearest',behavior:'smooth'})},[i]);
  const toggle=()=>{if(on){tok.current++;speechSynthesis.cancel();setOn(false)}else speak(i)};
  const go=(d:number)=>{const k=Math.min(items.length-1,Math.max(0,i+d));if(on)speak(k);else setI(k)};
  if(!ok)return <div className="box text-neutral-500">તમારું બ્રાઉઝર અવાજ (text-to-speech) સપોર્ટ કરતું નથી. Chrome વાપરો.</div>;
  const n=items[i];
  return <div>
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red via-rose-700 to-neutral-900 text-white p-5 sm:p-7">
      <div className="flex items-center gap-2 text-sm font-bold opacity-90"><span className={on?'live !bg-white':'inline-block w-2 h-2 rounded-full bg-white/50'}/>{on?'લાઇવ વાગી રહ્યું છે':'બનાસ રેડિયો'} • {i+1}/{items.length}</div>
      <h2 className="font-head text-2xl sm:text-3xl font-bold leading-snug mt-3 min-h-[5.5rem]">{n?.title}</h2>
      {on&&<div className="flex items-end gap-1 h-8 mt-2" aria-hidden>{[0,1,2,3,4,5,6,7,8,9].map(b=><span key={b} className="w-1.5 rounded-full bg-white/80 animate-pulse" style={{height:`${30+((b*37)%70)}%`,animationDelay:`${b*90}ms`}}/>)}</div>}
      <div className="flex items-center justify-center gap-5 mt-4"><button onClick={()=>go(-1)} aria-label="પાછળ" className="w-12 h-12 rounded-full bg-white/15 text-xl">⏮</button><button onClick={toggle} aria-label={on?'થોભો':'વગાડો'} className="w-20 h-20 rounded-full bg-white text-red text-4xl shadow-xl active:scale-95 transition">{on?'⏸':'▶'}</button><button onClick={()=>go(1)} aria-label="આગળ" className="w-12 h-12 rounded-full bg-white/15 text-xl">⏭</button></div>
      <div className="flex items-center justify-center gap-2 mt-4 text-sm">{[0.8,1,1.25].map(r=><button key={r} onClick={()=>{setRate(r);if(on){rt.current=r;speak(i)}}} className={`px-3 py-1 rounded-full font-bold ${rate===r?'bg-white text-red':'bg-white/15'}`}>{r}x</button>)}</div>
    </div>
    {vn&&<p className="text-xs text-amber-600 mt-2">{vn}</p>}
    <div ref={ref} className="mt-5 space-y-2">{items.map((x,k)=><div key={x.id} data-on={k===i?1:0} className={`flex items-center gap-3 rounded-xl border p-3 transition ${k===i?'border-red bg-red/5':'border-neutral-200 dark:border-neutral-700'}`}><button onClick={()=>speak(k)} className="shrink-0 w-9 h-9 rounded-full bg-red text-white font-bold">{k===i&&on?'♪':k+1}</button><div className="min-w-0 flex-1"><div className="font-semibold leading-snug line-clamp-2">{x.title}</div><div className="text-xs text-neutral-500">{[x.cat,x.place].filter(Boolean).join(' • ')}</div></div><Link href={`/news/${x.slug}`} className="shrink-0 text-red text-sm font-bold">વાંચો</Link></div>)}</div>
  </div>}
