import Link from 'next/link';import {NEWS_SV,DAILY_SV,FEST_SV} from './services';
const SOC_SVG:Record<string,React.ReactNode>={
  Facebook:<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>,
  Instagram:<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
  YouTube:<svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg>,
  WhatsApp:<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12.04 2a9.9 9.9 0 0 0-8.46 15.07L2 22l5.07-1.55A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.32 14.96l-.31-.18-3 .92.95-2.93-.2-.32A8.1 8.1 0 0 1 12.04 3.8zM8.6 7.6c-.2 0-.5.07-.74.35-.25.28-.97.95-.97 2.3s1 2.7 1.13 2.88c.14.18 1.95 3.1 4.8 4.2 2.37.93 2.85.75 3.37.7.52-.05 1.67-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33-.28-.14-1.67-.82-1.93-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.19-.44-2.27-1.4-.84-.75-1.4-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55z"/></svg>,
};
export default function FooterView({S,cats,talukas,year,pages}:{S:any,cats:any[],talukas:any[],year:number,pages:Record<string,string[]>}){
  const soc=[['Facebook',S.fb],['Instagram',S.ig],['YouTube',S.yt],['WhatsApp',`https://wa.me/${S.wa}`]].filter(x=>x[1]);
  const Hd=({t}:{t:string})=><h4 className="text-white font-black text-base sm:text-lg mb-4 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-gradient-to-b from-red to-orange-500"/>{t}</h4>;
  const L=({h,children}:{h:string,children:React.ReactNode})=><li><Link href={h} className="inline-block py-1 text-[15px] text-neutral-400 hover:text-white hover:translate-x-1 transition">{children}</Link></li>;
  const NEW=[...NEWS_SV,DAILY_SV.find(s=>s.h==='/suvichar')!,...FEST_SV];const DAILY=DAILY_SV.filter(s=>s.h!=='/suvichar');
  const wa=`https://wa.me/${S.wa}?text=${encodeURIComponent('નમસ્તે, મને બનાસ તકના સમાચાર WhatsApp પર જોઈએ છે.')}`;
  return <footer className="mt-24 relative bg-neutral-950 text-neutral-400 pb-16 md:pb-0">
    <div className="h-1.5 bg-gradient-to-r from-red via-orange-500 to-red"/>
    <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(700px 320px at 90% 0%,rgba(229,57,53,.16),transparent 70%),radial-gradient(600px 340px at 0% 100%,rgba(255,140,0,.09),transparent 70%)'}}/>
    <div className="wrap relative">
      <div className="-mt-12 sm:-mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-r from-red via-rose-600 to-orange-500 text-white p-6 sm:p-9 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute -right-12 -top-14 w-52 h-52 rounded-full bg-white/10"/><div className="absolute right-40 -bottom-16 w-40 h-40 rounded-full bg-black/10"/>
        <div className="relative"><div className="text-sm font-bold opacity-90">📲 સૌથી પહેલા, સૌથી સચોટ</div><div className="font-head text-2xl sm:text-4xl font-bold leading-tight mt-1">તમારા ગામના સમાચાર, સીધા WhatsApp પર!</div></div>
        <div className="relative flex gap-3 flex-wrap"><a href={wa} target="_blank" rel="noopener noreferrer" className="bg-white text-red font-black rounded-full px-6 py-3 shadow-lg hover:scale-105 transition">💬 WhatsApp પર જોડાઓ</a><Link href="/mokalo" className="bg-black/25 backdrop-blur font-bold rounded-full px-6 py-3 hover:bg-black/40 transition">✍ સમાચાર મોકલો</Link></div>
      </div>
      <div className="py-10 sm:py-14 grid gap-x-6 gap-y-9 grid-cols-2 lg:grid-cols-12">
        <div className="col-span-2 lg:col-span-4">
          <div className="flex items-center gap-3 mb-4"><img src={S.logo||'/logo.png'} className="w-16 h-16 rounded-full ring-2 ring-white/10" alt=""/><div><b className="block text-3xl text-white font-head leading-none">{S.name}</b><span className="text-xs text-amber-400 font-bold">{S.tag}</span></div></div>
          <p className="text-sm leading-7 max-w-sm">{S.footer}</p>
          <div className="flex gap-2.5 mt-5">{soc.map(([l,h])=><a key={l} href={h as string} target="_blank" rel="noopener noreferrer" aria-label={l as string} className="w-11 h-11 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-red hover:ring-red text-white flex items-center justify-center hover:-translate-y-1 transition">{SOC_SVG[l as string]}</a>)}</div>
          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex gap-3"><span className="w-8 h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center">📍</span><span className="pt-1">{S.addr}</span></li>
            <li><a href={`tel:${S.phone}`} className="flex gap-3 hover:text-white"><span className="w-8 h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center">📞</span><span className="pt-1 font-bold text-white">{S.phone}</span></a></li>
            {S.email&&<li className="flex gap-3"><span className="w-8 h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center">✉️</span><span className="pt-1">{S.email}</span></li>}
          </ul>
        </div>
        <div className="lg:col-span-2"><Hd t="વિભાગો"/><ul>{cats.map((c:any)=><L key={c.id} h={`/?c=${c.id}`}>{c.name}</L>)}<L h="/video">વિડિયો</L><L h="/reels">રીલ</L><L h="/epaper">ઈ-પેપર</L></ul></div>
        <div className="lg:col-span-2"><Hd t="નવી સેવાઓ"/><ul>{NEW.map(s=><L key={s.h} h={s.h}>{s.i} {s.t}</L>)}</ul></div>
        <div className="lg:col-span-2"><Hd t="રોજિંદી સેવાઓ"/><ul>{DAILY.map(s=><L key={s.h} h={s.h}>{s.i} {s.t}</L>)}</ul></div>
        <div className="lg:col-span-2"><Hd t="તમારો તાલુકો"/><ul>{talukas.map((t:any)=><L key={t.id} h={`/?t=${t.id}`}>{t.name}</L>)}</ul><Link href="/report" className="inline-block mt-4 bg-white/5 ring-1 ring-white/15 hover:bg-red hover:ring-red text-white font-bold rounded-full px-5 py-2.5 text-sm transition">👤 રિપોર્ટર લોગિન</Link></div>
      </div>
    </div>
    <div className="relative border-t border-white/10"><div className="wrap py-5 flex flex-wrap items-center justify-between gap-3 text-xs"><span>© {year} {S.name}. સર્વાધિકાર સુરક્ષિત.</span><div className="flex gap-x-5 gap-y-2 flex-wrap items-center">{Object.keys(pages).map(k=><Link key={k} href={`/p/${k}`} className="hover:text-white">{pages[k][0]}</Link>)}<a href="#" aria-label="ઉપર જાઓ" className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-red text-white font-bold px-3.5 py-1.5 transition">↑ ઉપર</a></div></div></div>
    <div className="relative border-t border-white/10 bg-black/40"><div className="wrap py-4 flex flex-col items-center gap-1.5 text-center text-xs sm:text-[13px]"><div>💻 Design, Develop &amp; Maintained by <a href="https://wa.me/918200877397" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/40">Pallav Chavda</a> – Deesa</div><div className="text-neutral-500">વેબસાઇટ, મોબાઇલ એપ કે કોઈ પણ સોફ્ટવેર બનાવડાવવું છે? સંપર્ક કરો: <a href="tel:+918200877397" className="font-bold text-white hover:text-amber-300">📞 8200877397</a><a href="https://wa.me/918200877397" target="_blank" rel="noopener noreferrer" className="ml-2 inline-block rounded-full bg-green-600/90 hover:bg-green-500 text-white font-bold px-3 py-0.5">💬 WhatsApp</a></div></div></div>
  </footer>}
