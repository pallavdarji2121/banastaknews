'use client';
import Link from 'next/link';import {useRouter} from 'next/navigation';import {useCallback,useEffect,useRef,useState} from 'react';
type S={id:number,slug:string,title:string,summary:string,img:string,at?:string,cat:string,place:string};
const DUR=7000;const GR=['from-rose-700 to-red-950','from-indigo-700 to-slate-950','from-emerald-700 to-teal-950','from-amber-600 to-orange-950','from-fuchsia-700 to-purple-950'];
const ago=(d?:string)=>{if(!d)return '';const m=Math.max(1,Math.round((Date.now()-new Date(d).getTime())/6e4));return m<60?`${m} મિનિટ પહેલાં`:m<1440?`${Math.round(m/60)} કલાક પહેલાં`:`${Math.round(m/1440)} દિવસ પહેલાં`};
export default function Stories({items,start,site}:{items:S[],start:number,site:string}){
  const r=useRouter();const [i,setI]=useState(start);const [p,setP]=useState(0);const [hold,setHold]=useState(false);const down=useRef({t:0,x:0,y:0});
  const close=useCallback(()=>r.push('/'),[r]);
  const pr=useRef(0);
  const next=useCallback(()=>{if(i+1>=items.length)close();else setI(i+1)},[i,items.length,close]);
  const prev=useCallback(()=>{setI(Math.max(0,i-1))},[i]);
  useEffect(()=>{pr.current=0;setP(0)},[i]);
  useEffect(()=>{if(hold||!items.length)return;const id=setInterval(()=>{pr.current+=50/DUR;if(pr.current>=1){pr.current=0;setP(0);next()}else setP(pr.current)},50);return()=>clearInterval(id)},[hold,next,items.length]);
  useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.key==='ArrowRight')next();else if(e.key==='ArrowLeft')prev();else if(e.key==='Escape')close()};window.addEventListener('keydown',k);const o=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{window.removeEventListener('keydown',k);document.body.style.overflow=o}},[next,prev,close]);
  useEffect(()=>{const n=items[i+1];if(n){const im=new Image();im.src=n.img}},[i,items]);
  if(!items.length)return <div className="fixed inset-0 z-[1000] bg-neutral-950 text-white flex flex-col items-center justify-center gap-4 p-6 text-center"><div className="text-5xl">⚡</div><p>હજી ફોટા સાથેના સમાચાર ઉપલબ્ધ નથી.</p><Link href="/" className="btnr">← હોમ</Link></div>;
  const n=items[i];
  const share=async()=>{const url=`${site}/news/${n.slug}`;try{if(navigator.share){await navigator.share({title:n.title,url});return}}catch{}window.open(`https://wa.me/?text=${encodeURIComponent(n.title+'\n'+url)}`,'_blank')};
  return <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center select-none">
    <div className="relative w-full h-full sm:max-w-[430px] sm:h-[min(100vh,860px)] sm:rounded-3xl overflow-hidden bg-neutral-900"
      onPointerDown={e=>{down.current={t:Date.now(),x:e.clientX,y:e.clientY};setHold(true)}}
      onPointerUp={e=>{setHold(false);const d=down.current,dy=e.clientY-d.y,dx=e.clientX-d.x;if(dy>110&&Math.abs(dx)<80){close();return}if(Date.now()-d.t<260&&Math.abs(dx)<20&&Math.abs(dy)<20){const b=(e.currentTarget as HTMLElement).getBoundingClientRect();(e.clientX-b.left)<b.width/3?prev():next()}}}
      onPointerCancel={()=>setHold(false)} onContextMenu={e=>e.preventDefault()}>
      <div className={`absolute inset-0 bg-gradient-to-b ${GR[n.id%GR.length]}`}/>
      <img key={n.id} src={n.img} alt="" className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_.4s_ease]" draggable={false}/>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/35"/>
      <div className="absolute top-0 inset-x-0 p-3 pt-[max(12px,env(safe-area-inset-top))]"><div className="flex gap-1">{items.map((_,k)=><span key={k} className="h-[3px] flex-1 rounded-full bg-white/30 overflow-hidden"><span className="block h-full bg-white" style={{width:k<i?'100%':k===i?`${p*100}%`:'0%'}}/></span>)}</div>
        <div className="flex items-center justify-between mt-3 text-white"><div className="flex items-center gap-2"><img src="/logo.png" alt="" className="w-8 h-8 rounded-full bg-white"/><span className="text-xs font-bold drop-shadow">{ago(n.at)}</span></div><div className="flex gap-2" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}><button onClick={share} aria-label="શેર" className="w-9 h-9 rounded-full bg-black/40 backdrop-blur">📤</button><button onClick={close} aria-label="બંધ" className="w-9 h-9 rounded-full bg-black/40 backdrop-blur text-lg">✕</button></div></div></div>
      <div className="absolute bottom-0 inset-x-0 p-5 pb-[max(24px,env(safe-area-inset-bottom))] text-white">
        <div className="flex gap-2 mb-3 flex-wrap">{n.cat&&<span className="bg-red text-white text-xs font-black rounded-full px-3 py-1">{n.cat}</span>}{n.place&&<span className="bg-white/20 backdrop-blur text-xs font-bold rounded-full px-3 py-1">📍 {n.place}</span>}</div>
        <h1 className="font-head font-black text-2xl sm:text-3xl leading-snug drop-shadow-lg">{n.title}</h1>
        {n.summary&&<p className="mt-3 text-[15px] leading-relaxed text-white/90 line-clamp-4">{n.summary}</p>}
        <div onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}><Link href={`/news/${n.slug}`} className="mt-4 inline-flex items-center gap-2 bg-white text-red font-black rounded-full px-5 py-2.5">સંપૂર્ણ સમાચાર વાંચો →</Link></div>
        <div className="mt-3 text-center text-[11px] text-white/60">{i+1} / {items.length} • ટેપ કરો: પાછળ/આગળ • પકડી રાખો: થોભો • નીચે ખેંચો: બંધ</div></div></div></div>}
