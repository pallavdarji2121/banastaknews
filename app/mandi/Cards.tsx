import Link from 'next/link';
export type Row={crop:string,en?:string|null,min:number,max:number,d:number|null};
export type CardT={market:string,day:string,age:number,rows:Row[]};
const META:Record<string,{sub:string,icon:string,g:string}>={
  'ડીસા':{sub:'મુખ્ય યાર્ડ • અનાજ અને કઠોળ',icon:'🌾',g:'from-lime-600 via-green-700 to-emerald-900'},
  'ડીસા – વી.જે.પટેલ (શાકભાજી)':{sub:'શાકભાજી માર્કેટ',icon:'🥬',g:'from-orange-500 via-red to-rose-800'},
  'ભીલડી':{sub:'સબ યાર્ડ',icon:'🚜',g:'from-sky-600 via-blue-700 to-indigo-900'},
};
export const slug=(m:string)=>'y-'+[...m].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7).toString(36);
const inr=(n:number)=>'₹'+n.toLocaleString('en-IN');
const dmy=(d:string)=>d.split('-').reverse().join('/');
const gu=(d:string)=>new Date(d+'T12:00:00+05:30').toLocaleDateString('gu-IN',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'});
export default function Cards({cards,site=''}:{cards:CardT[],site?:string}){
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 items-start">{cards.map(c=>{const m=META[c.market]||{sub:'માર્કેટયાર્ડ',icon:'🏪',g:'from-slate-600 to-neutral-900'};const stale=c.age>=2;
    const wa=`${m.icon} ${c.market} – ${dmy(c.day)}\n(ભાવ રૂ. પ્રતિ 20 કિલો)\n\n`+c.rows.map(r=>`${r.crop}: ${r.min} – ${r.max}`).join('\n')+`\n\nસ્ત્રોત: APMC ડીસા • બનાસ તક ${site}/mandi`;
    return <section key={c.market} id={slug(c.market)} className="scroll-mt-24 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-xl transition duration-300">
      <div className={`relative bg-gradient-to-br ${m.g} text-white px-5 py-4 overflow-hidden`}><div className="absolute -right-3 -bottom-6 text-[84px] opacity-20 select-none">{m.icon}</div>
        <div className="relative flex items-start justify-between gap-3"><div><div className="text-xs font-bold opacity-90">{m.icon} {m.sub}</div><h2 className="font-head text-2xl font-bold leading-tight mt-0.5">{c.market}</h2></div><span className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-xs font-black whitespace-nowrap" title={gu(c.day)}>📅 {dmy(c.day)}</span></div>
        {stale&&<div className="relative mt-3 text-xs bg-black/30 rounded-lg px-3 py-1.5 font-semibold">⚠️ {c.age} દિવસ જૂના ભાવ – APMC એ નવા ભાવ મૂક્યા નથી</div>}</div>
      <table className="w-full text-left"><thead className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/60"><tr><th className="px-4 py-2.5 font-bold">પાક</th><th className="px-3 py-2.5 font-bold text-right">ઓછામાં ઓછા</th><th className="px-4 py-2.5 font-bold text-right">વધુમાં વધુ</th></tr></thead>
        <tbody>{c.rows.map((r,i)=><tr key={r.crop} className={`border-t border-neutral-100 dark:border-neutral-800 ${i%2?'bg-neutral-50/60 dark:bg-neutral-800/30':''}`}><td className="px-4 py-2.5"><div className="font-bold leading-tight">{r.crop}</div>{r.en&&r.en.toLowerCase()!==r.crop.toLowerCase()&&<div className="text-[11px] text-neutral-400 capitalize leading-tight">{r.en}</div>}</td><td className="px-3 py-2.5 text-right font-semibold tabular-nums">{inr(r.min)}</td><td className="px-4 py-2.5 text-right tabular-nums"><div className="font-black text-emerald-700 dark:text-emerald-400">{inr(r.max)}</div>{r.d!==null&&r.d!==0&&<div className={`text-[11px] font-bold ${r.d>0?'text-green-600':'text-red'}`}>{r.d>0?'▲':'▼'} ₹{Math.abs(r.d)}</div>}</td></tr>)}</tbody></table>
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500"><span>{c.rows.length} પાક • રૂ. પ્રતિ 20 કિલો</span><a href={`https://wa.me/?text=${encodeURIComponent(wa)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-600 hover:bg-green-500 text-white font-bold px-3.5 py-1.5 transition">💬 શેર</a></div>
    </section>})}</div>}
