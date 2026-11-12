import Link from 'next/link';import {Header,Footer} from '@/lib/ui';import {getMandiAll,getMandiStatus} from '@/lib/cache';import Cards,{slug,type CardT} from './Cards';import AutoSync from './AutoSync';
export const metadata={title:'માર્કેટયાર્ડ ભાવ – ડીસા, વી.જે.પટેલ, ભીલડી | બનાસ તક',description:'ડીસા APMC ના રોજના ભાવ – મુખ્ય યાર્ડ, વી.જે.પટેલ શાકભાજી માર્કેટ અને ભીલડી સબ યાર્ડ. ભાવ આપમેળે અપડેટ થાય છે.'};
const ORDER=['ડીસા','ડીસા – વી.જે.પટેલ (શાકભાજી)','ભીલડી'];
const dd=(a:string,b:string)=>Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/864e5);
export default async function P(){const [rows,st]=await Promise.all([getMandiAll(),getMandiStatus()]);
  const today=new Date(Date.now()+5.5*3600e3).toISOString().slice(0,10);
  const markets=[...new Set(rows.map((r:any)=>r.market))] as string[];
  markets.sort((a,b)=>{const x=ORDER.indexOf(a),y=ORDER.indexOf(b);return (x<0?99:x)-(y<0?99:y)||a.localeCompare(b)});
  const cards:CardT[]=markets.map(m=>{const mine=rows.filter((r:any)=>r.market===m);const days=[...new Set(mine.map((r:any)=>String(r.day).slice(0,10)))] as string[];const cur=mine.filter((r:any)=>String(r.day).slice(0,10)===days[0]).sort((a:any,b:any)=>(a.sort??a.id)-(b.sort??b.id));
    const prev=new Map(mine.filter((r:any)=>String(r.day).slice(0,10)===days[1]).map((r:any)=>[r.crop,r]));const av=(r:any)=>(r.min_p+r.max_p)/2;
    return {market:m,day:days[0],age:Math.max(0,dd(days[0],today)),rows:cur.map((r:any)=>({crop:r.crop,en:r.crop_en,min:r.min_p,max:r.max_p,d:prev.has(r.crop)?Math.round(av(r)-av(prev.get(r.crop))):null}))}});
  const at=st?.at?new Date(st.at).toLocaleString('gu-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Kolkata'}):'';
  return <div><Header/><AutoSync/><main className="wrap">
    <div className="mt-6 rounded-3xl bg-gradient-to-br from-lime-600 via-green-700 to-emerald-950 text-white p-6 sm:p-9 relative overflow-hidden"><div className="absolute -right-4 -top-8 text-[150px] opacity-15 select-none">🌾</div>
      <div className="text-sm font-bold opacity-90">🌾 માર્કેટયાર્ડ ભાવ</div><h1 className="font-head text-3xl sm:text-5xl font-bold leading-tight mt-1">ડીસા APMC – આજના ભાવ</h1><p className="mt-2 opacity-90 max-w-2xl">મુખ્ય યાર્ડ, વી.જે.પટેલ શાકભાજી માર્કેટ અને ભીલડી સબ યાર્ડના ભાવ – APMC ના જેમ જ, તારીખ સાથે.</p>
      <div className="flex flex-wrap gap-2 mt-4 text-xs font-bold"><span className="bg-white/15 rounded-full px-3 py-1.5">📡 ભાવ APMC ડીસાની વેબસાઇટ પરથી આપમેળે આવે છે</span>{at&&<span className="bg-white/15 rounded-full px-3 py-1.5">🕒 છેલ્લે તપાસ: {at}</span>}<a href="https://www.apmcdeesa.com/" target="_blank" rel="noopener noreferrer" className="bg-white/15 hover:bg-white/25 rounded-full px-3 py-1.5 transition">🔗 સ્ત્રોત: apmcdeesa.com</a></div></div>
    {!cards.length?<div className="box text-neutral-500 mt-6">હજી ભાવ ઉપલબ્ધ નથી. થોડી વારમાં ફરી જુઓ.</div>:<>
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 sticky top-[56px] z-30 bg-white/90 dark:bg-neutral-950/90 backdrop-blur -mx-1 px-1">{cards.map(c=><a key={c.market} href={`#${slug(c.market)}`} className="shrink-0 rounded-full border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-bold hover:border-red hover:text-red transition">{c.market}</a>)}<Link href="/kamai" className="shrink-0 rounded-full bg-red text-white px-4 py-2 text-sm font-bold">🧮 કમાણી કેલ્ક્યુલેટર</Link></div>
      <div className="mt-2"><Cards cards={cards} site={process.env.NEXT_PUBLIC_SITE_URL||''}/></div></>}
    <p className="text-xs text-neutral-500 mt-6 mb-2">ભાવ રૂ. પ્રતિ 20 કિલો (મણ) છે અને ડીસા APMC દ્વારા જાહેર કરાયેલા છે. ગુણવત્તા અને દિવસ પ્રમાણે ભાવ બદલાઈ શકે – સોદો કરતાં પહેલાં માર્કેટયાર્ડમાં ખાતરી કરી લો. ▲▼ = અગાઉના ભાવ કરતાં સરેરાશમાં ફેરફાર.</p>
  </main><Footer/></div>}
