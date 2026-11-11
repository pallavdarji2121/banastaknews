'use client';
import Link from 'next/link';import {useEffect,useMemo,useState} from 'react';
type It={id:number,slug:string,title:string,summary?:string|null,img?:string|null,at?:string,cat?:number,tal?:number,catName?:string,talName?:string};
const KEY='maru-akhbar-v1';
export default function Akhbar({items,talukas,cats,site}:{items:It[],talukas:{id:number,name:string}[],cats:{id:number,name:string}[],site:string}){
  const [t,setT]=useState<number[]>([]);const [c,setC]=useState<number[]>([]);const [name,setName]=useState('');const [open,setOpen]=useState(false);const [ready,setReady]=useState(false);const [dt,setDt]=useState('');
  useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v){setT(v.t||[]);setC(v.c||[]);setName(v.n||'')}else setOpen(true)}catch{setOpen(true)}
    setDt(new Date().toLocaleDateString('gu-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'}));setReady(true)},[]);
  useEffect(()=>{if(ready)try{localStorage.setItem(KEY,JSON.stringify({t,c,n:name}))}catch{}},[t,c,name,ready]);
  const tog=(a:number[],set:(x:number[])=>void,id:number)=>set(a.includes(id)?a.filter(x=>x!==id):[...a,id]);
  const {list,mine,filtered}=useMemo(()=>{const ok=(n:It)=>(!t.length||(n.tal!=null&&t.includes(n.tal)))&&(!c.length||(n.cat!=null&&c.includes(n.cat)));
    const m=items.filter(ok);const rest=items.filter(n=>!ok(n));const filtered=!!(t.length||c.length);
    const l=filtered&&m.length<8?[...m,...rest.slice(0,8-m.length)]:m;return {list:l.slice(0,18),mine:m.length,filtered}},[items,t,c]);
  const lead=list.find(n=>n.img)||list[0];const rest=list.filter(n=>n!==lead);const second=rest.filter(n=>n.img).slice(0,2);const cols=rest.filter(n=>!second.includes(n));
  const tn=t.length?talukas.filter(x=>t.includes(x.id)).map(x=>x.name).join(', '):'બધા તાલુકા';const cn=c.length?cats.filter(x=>c.includes(x.id)).map(x=>x.name).join(', '):'બધા વિષય';
  const wa=`📰 ${name?name+' નું અખબાર':'મારું અખબાર'} – ${dt}\n\n`+list.slice(0,5).map((n,i)=>`${i+1}. ${n.title}`).join('\n')+`\n\nબનાસ તક ${site}/maru-akhbar`;
  const Chip=({on,l,f}:{on:boolean,l:string,f:()=>void})=><button onClick={f} className={`px-3 py-1.5 rounded-full border text-sm font-bold transition ${on?'bg-red text-white border-red':'hover:border-red'}`}>{l}</button>;
  const Img=({n,cls}:{n:It,cls:string})=>n.img?<img src={n.img} alt="" loading="lazy" className={`w-full object-cover ${cls}`}/>:null;
  return <div className="mt-6">
    <div className="print:hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4 mb-6">
      <div className="flex items-center justify-between gap-3 flex-wrap"><div><div className="font-black text-lg">🛠 તમારું અખબાર બનાવો</div><div className="text-sm text-neutral-500">પસંદગી આ ફોનમાં યાદ રહેશે – રોજ આવીને નવું અખબાર વાંચો.</div></div><button onClick={()=>setOpen(!open)} className="btn !py-1.5 text-sm">{open?'બંધ કરો ▲':'પસંદગી બદલો ▼'}</button></div>
      {open&&<div className="mt-4 space-y-4"><div><label className="font-bold text-sm block mb-1">તમારું નામ (અખબારના મથાળે દેખાશે)</label><input value={name} onChange={e=>setName(e.target.value.slice(0,30))} placeholder="દા.ત. રમેશભાઈ પટેલ" className="inp"/></div>
        <div><div className="font-bold text-sm mb-2">📍 તાલુકા (એક કે વધુ)</div><div className="flex gap-2 flex-wrap">{talukas.map(x=><Chip key={x.id} on={t.includes(x.id)} l={x.name} f={()=>tog(t,setT,x.id)}/>)}</div></div>
        <div><div className="font-bold text-sm mb-2">🏷 વિષય (એક કે વધુ)</div><div className="flex gap-2 flex-wrap">{cats.map(x=><Chip key={x.id} on={c.includes(x.id)} l={x.name} f={()=>tog(c,setC,x.id)}/>)}</div></div>
        {(t.length>0||c.length>0)&&<button onClick={()=>{setT([]);setC([])}} className="text-sm text-red font-bold">✖ બધી પસંદગી હટાવો</button>}</div>}
      <div className="flex gap-2 flex-wrap mt-4"><button onClick={()=>window.print()} className="btnr !py-2">🖨 પ્રિન્ટ / PDF સેવ કરો</button><a href={`https://wa.me/?text=${encodeURIComponent(wa)}`} target="_blank" rel="noopener noreferrer" className="btn !py-2">💬 WhatsApp પર મોકલો</a></div>
    </div>
    {/* ---- the newspaper ---- */}
    <article className="bg-[#fffdf7] text-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg p-4 sm:p-8 print:border-0 print:p-0 shadow-xl print:shadow-none">
      <div className="text-center border-b-4 border-double border-neutral-800 pb-3"><div className="flex items-center justify-center gap-3"><img src="/logo.png" alt="" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"/><h1 className="font-head font-black text-4xl sm:text-7xl leading-none">{name?`${name} નું અખબાર`:'મારું અખબાર'}</h1></div>
        <div className="mt-3 flex justify-between gap-2 flex-wrap text-xs sm:text-sm font-bold border-t border-neutral-800 pt-2"><span>{dt||'\u00a0'}</span><span>📍 {tn}</span><span>🏷 {cn}</span></div></div>
      {!list.length?<p className="py-16 text-center text-neutral-500">હજી કોઈ સમાચાર ઉપલબ્ધ નથી.</p>:<>
        {filtered&&mine<8&&<p className="mt-3 text-xs text-neutral-600 bg-amber-100 rounded px-3 py-1.5 print:hidden">તમારી પસંદગીમાં હાલ {mine} જ સમાચાર છે – બાકી જગ્યા અન્ય મુખ્ય સમાચારથી ભરી છે.</p>}
        {lead&&<Link href={`/news/${lead.slug}`} className="block mt-5 group"><div className="grid md:grid-cols-5 gap-4"><div className={lead.img?'md:col-span-3':'md:col-span-5'}><div className="text-xs font-black text-red uppercase tracking-wide">{[lead.catName,lead.talName].filter(Boolean).join(' • ')}</div><h2 className="font-head font-black text-3xl sm:text-5xl leading-tight mt-1 group-hover:underline">{lead.title}</h2>{lead.summary&&<p className="mt-3 text-base sm:text-lg leading-relaxed text-neutral-700">{lead.summary}</p>}</div>{lead.img&&<div className="md:col-span-2"><Img n={lead} cls="aspect-[4/3] rounded"/></div>}</div></Link>}
        {second.length>0&&<div className="grid sm:grid-cols-2 gap-5 mt-6 pt-5 border-t-2 border-neutral-800">{second.map(n=><Link key={n.id} href={`/news/${n.slug}`} className="group block"><Img n={n} cls="aspect-video rounded mb-2"/><div className="text-[11px] font-black text-red">{[n.catName,n.talName].filter(Boolean).join(' • ')}</div><h3 className="font-head font-black text-xl sm:text-2xl leading-snug group-hover:underline">{n.title}</h3>{n.summary&&<p className="text-sm mt-1 text-neutral-700 line-clamp-3">{n.summary}</p>}</Link>)}</div>}
        {cols.length>0&&<div className="mt-6 pt-5 border-t-2 border-neutral-800 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-rule:1px_solid_#d4d4d4]">{cols.map(n=><Link key={n.id} href={`/news/${n.slug}`} className="block break-inside-avoid mb-5 group"><div className="text-[11px] font-black text-red">{[n.catName,n.talName].filter(Boolean).join(' • ')}</div><h3 className="font-head font-bold text-lg leading-snug group-hover:underline">{n.title}</h3>{n.summary&&<p className="text-sm mt-1 text-neutral-700 line-clamp-3">{n.summary}</p>}</Link>)}</div>}
      </>}
      <div className="mt-6 pt-2 border-t-4 border-double border-neutral-800 text-center text-xs font-bold text-neutral-600">તમારા માટે ખાસ તૈયાર કરેલું અખબાર • {dt}</div>
    </article></div>}
