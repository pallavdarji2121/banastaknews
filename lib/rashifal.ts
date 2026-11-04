import {svc} from './supabase';
export const SIGNS=[['મેષ','Aries','♈'],['વૃષભ','Taurus','♉'],['મિથુન','Gemini','♊'],['કર્ક','Cancer','♋'],['સિંહ','Leo','♌'],['કન્યા','Virgo','♍'],['તુલા','Libra','♎'],['વૃશ્ચિક','Scorpio','♏'],['ધન','Sagittarius','♐'],['મકર','Capricorn','♑'],['કુંભ','Aquarius','♒'],['મીન','Pisces','♓']];
export const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
// Free English horoscope API (unofficial). Manual Gujarati entries (src='manual') are never overwritten.
export async function syncRashifal(){const x=svc();const d=today();const {data:ex}=await x.from('rashifal').select('sign,src').eq('day',d);let ok=0;
for(const [gu,en] of SIGNS){if(ex?.find((e:any)=>e.sign===gu&&e.src==='manual'))continue;try{const r=await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${en}&day=TODAY`,{cache:'no-store'});const j=await r.json();const t=j?.data?.horoscope_data;if(t){await x.from('rashifal').upsert({sign:gu,day:d,text:t,src:'api-en'});ok++}}catch{}}return ok}
