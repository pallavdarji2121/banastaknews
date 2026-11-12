// Auto-copies the daily rates published on https://www.apmcdeesa.com/ (3 tables: Deesa, V.J.Patel, Bhildi)
// into our `mandi_rates` table. Nothing is invented: if the parser finds nothing, old data stays untouched.
import {svc} from './supabase';import {revalidatePath,revalidateTag} from 'next/cache';import {parseApmc,K,GU} from './apmcParse';
export const APMC_URL='https://www.apmcdeesa.com/';
export const YARDS:Record<string,{market:string,order:number}>={
  deesa:{market:'ડીસા',order:0},
  vj:{market:'ડીસા – વી.જે.પટેલ (શાકભાજી)',order:1},
  bhildi:{market:'ભીલડી',order:2},
};
const today=()=>new Date(Date.now()+5.5*3600e3).toISOString().slice(0,10);
const istHour=()=>new Date(Date.now()+5.5*3600e3).getUTCHours();
type Status={at:string,ok:boolean,msg:string,running?:boolean,yards?:{market:string,date:string,n:number}[],unknown?:string[],schema?:boolean};
export async function getStatus():Promise<Status|null>{try{const {data}=await svc().from('website_settings').select('value').eq('key','mandi_sync').maybeSingle();return (data?.value as Status)||null}catch{return null}}
async function setStatus(v:Status){try{await svc().from('website_settings').upsert({key:'mandi_sync',value:v})}catch{}}
export async function syncApmc(o:{force?:boolean,minGapMin?:number,window?:boolean}={}):Promise<{ok:boolean,updated:boolean,msg:string}>{
  const prev=await getStatus();
  if(!o.force){
    if(o.window&&(istHour()<6||istHour()>=22))return {ok:true,updated:false,msg:'રાત્રિનો સમય – સિંક નથી'};
    const gap=(o.minGapMin??90)*60e3;if(prev?.at&&Date.now()-new Date(prev.at).getTime()<gap)return {ok:true,updated:false,msg:'તાજેતરમાં જ સિંક થયું છે'};
  }
  await setStatus({at:new Date().toISOString(),ok:prev?.ok??false,msg:'સિંક ચાલુ…',running:true,yards:prev?.yards,unknown:prev?.unknown});   // acts as a lock for parallel visitors
  const fail=async(msg:string)=>{await setStatus({at:new Date().toISOString(),ok:false,msg,yards:prev?.yards,unknown:prev?.unknown});return {ok:false,updated:false,msg}};
  let html='';
  try{const r=await fetch(APMC_URL,{cache:'no-store',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'Mozilla/5.0 (compatible; BanasTakRates/1.0)','Accept-Language':'en'}});if(!r.ok)return fail(`APMC સાઇટ ખૂલી નહીં (HTTP ${r.status})`);html=await r.text()}
  catch(e:any){return fail('APMC સાઇટ સુધી પહોંચી શક્યા નહીં (ટાઇમઆઉટ/નેટવર્ક)')}
  const parsed=parseApmc(html);
  if(!parsed.length)return fail('APMC સાઇટમાંથી ભાવ વાંચી શકાયા નહીં – સાઇટની રચના બદલાઈ હશે');
  const unknown=new Set<string>();const sum:{market:string,date:string,n:number}[]=[];let schema=true;const sv=svc();let bad='';
  for(const y of parsed){
    const Y=YARDS[y.key];const seen=new Set<string>();const rows:any[]=[];
    y.rows.forEach((r,i)=>{const g=GU[K(r.en)];if(!g)unknown.add(r.en);const crop=g||(r.en.charAt(0).toUpperCase()+r.en.slice(1));if(seen.has(crop))return;seen.add(crop);rows.push({day:y.date,market:Y.market,crop,min_p:r.min,max_p:r.max,crop_en:r.en,sort:i})});
    let {error}=await sv.from('mandi_rates').upsert(rows,{onConflict:'day,market,crop'});
    if(error&&/column|schema/i.test(error.message)){schema=false;const plain=rows.map(({crop_en,sort,...x})=>x);({error}=await sv.from('mandi_rates').upsert(plain,{onConflict:'day,market,crop'}))}
    if(error){bad=error.message;continue}
    sum.push({market:Y.market,date:y.date,n:rows.length});
  }
  if(!sum.length)return fail('ડેટાબેઝમાં સાચવી શકાયું નહીં: '+bad);
  const msg=`${sum.map(s=>`${s.market}: ${s.n} પાક (${s.date})`).join(' • ')}`;
  await setStatus({at:new Date().toISOString(),ok:true,msg,yards:sum,unknown:[...unknown],schema});
  try{revalidateTag('news');revalidatePath('/mandi');revalidatePath('/')}catch{}
  return {ok:true,updated:true,msg};
}
