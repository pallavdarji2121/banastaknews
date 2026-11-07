import Link from 'next/link';import {sb} from '@/lib/supabase';import {Header,Footer,Sec} from '@/lib/ui';import {geo,sun} from '@/lib/weather';import {build} from '@/lib/panchang';import PanchangLive from './PanchangLive';
export const metadata={title:'આજનું પંચાંગ, ચોઘડિયા અને રાહુકાળ | બનાસ તક',description:'તમારા તાલુકા માટે સૂર્યોદય-સૂર્યાસ્ત, ચોઘડિયા, રાહુકાળ અને અભિજિત મુહૂર્ત.'};
const T=(ms:number)=>new Date(ms).toLocaleTimeString('gu-IN',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Kolkata'});
export default async function P({searchParams}:{searchParams:Promise<any>}){const q=await searchParams;const s=await sb();const {data:ts}=await s.from('talukas').select('id,name').order('id');
const cur=ts?.find((t:any)=>t.id===+q.t)||ts?.find((t:any)=>t.name==='પાલનપુર')||ts?.[0];const g=cur?await geo(cur.name):null;const d=g?await sun(g.lat,g.lon):null;const p=d?build(d):null;
const Row=({i,l,v,bad}:{i:string,l:string,v:string,bad?:boolean})=><div className="flex items-center justify-between rounded-xl bg-neutral-100 dark:bg-neutral-800 px-4 py-3"><span className="font-semibold">{i} {l}</span><b className={bad?'text-red':'text-emerald-600'}>{v}</b></div>;
return <div><Header/><main className="wrap max-w-4xl"><Sec t="🕉 આજનું પંચાંગ અને ચોઘડિયા">
<div className="flex gap-2 flex-wrap mb-5">{ts?.map((t:any)=><Link key={t.id} href={`/panchang?t=${t.id}`} className={`px-3 py-1.5 rounded-full border text-sm font-semibold ${cur?.id===t.id?'bg-red text-white border-red':'hover:border-red'}`}>{t.name}</Link>)}</div>
{!p?<div className="box text-neutral-500">{cur?.name} માટે સૂર્યોદય-સૂર્યાસ્તનો ડેટા અત્યારે ઉપલબ્ધ નથી. થોડી વાર પછી પ્રયત્ન કરો અથવા બીજો તાલુકો પસંદ કરો.</div>:<>
<div className="rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red text-white p-5 sm:p-7 mb-5"><div className="text-sm opacity-90">📍 {cur.name} • {p.name}</div><div className="grid grid-cols-2 gap-4 mt-3"><div><div className="text-sm opacity-90">🌅 સૂર્યોદય</div><div className="text-3xl font-bold">{T(p.rise)}</div></div><div><div className="text-sm opacity-90">🌇 સૂર્યાસ્ત</div><div className="text-3xl font-bold">{T(p.set)}</div></div></div></div>
<PanchangLive blocks={p.blocks}/>
<h3 className="font-bold text-lg mb-2">⏳ આજના ખાસ સમય</h3><div className="grid gap-2 sm:grid-cols-2">
<Row i="⚠️" l="રાહુકાળ" v={`${T(p.rahu.s)} – ${T(p.rahu.e)}`} bad/><Row i="⚠️" l="ગુલિક કાળ" v={`${T(p.gulika.s)} – ${T(p.gulika.e)}`} bad/><Row i="⚠️" l="યમગંડ" v={`${T(p.yama.s)} – ${T(p.yama.e)}`} bad/>
{p.abhijit?<Row i="✅" l="અભિજિત મુહૂર્ત" v={`${T(p.abhijit.s)} – ${T(p.abhijit.e)}`}/>:<div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-500">બુધવારે અભિજિત મુહૂર્ત ગણાતું નથી.</div>}</div></>}
<p className="text-xs text-neutral-500 mt-6">સમય તમારા તાલુકાના સૂર્યોદય-સૂર્યાસ્ત (Open-Meteo) પરથી ગણવામાં આવ્યો છે. તિથિ/નક્ષત્ર અને ખાસ મુહૂર્ત માટે તમારા પંડિત કે પંચાંગની સલાહ લો.</p></Sec></main><Footer/></div>}
