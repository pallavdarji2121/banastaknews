import {svc} from './supabase';
export const SIGNS=[['મેષ','Aries','♈'],['વૃષભ','Taurus','♉'],['મિથુન','Gemini','♊'],['કર્ક','Cancer','♋'],['સિંહ','Leo','♌'],['કન્યા','Virgo','♍'],['તુલા','Libra','♎'],['વૃશ્ચિક','Scorpio','♏'],['ધન','Sagittarius','♐'],['મકર','Capricorn','♑'],['કુંભ','Aquarius','♒'],['મીન','Pisces','♓']];
export const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
const TO=()=>AbortSignal.timeout(8000);
async function fetchEn(en:string):Promise<string>{
 try{const r=await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${en}&day=TODAY`,{cache:'no-store',signal:TO()});const j=await r.json();const t=j?.data?.horoscope_data;if(t)return t;throw new Error('empty')}
 catch{const r=await fetch(`https://ohmanda.com/api/horoscope/${en.toLowerCase()}/`,{cache:'no-store',signal:TO()});const j=await r.json();if(j?.horoscope)return j.horoscope;throw new Error('બંને English API માંથી ડેટા ન મળ્યો')}}
// English -> Gujarati. Google Cloud Translation if GOOGLE_TRANSLATE_KEY is set, else MyMemory (free, machine translation).
async function toGu(t:string):Promise<string|null>{try{const gk=process.env.GOOGLE_TRANSLATE_KEY;
 if(gk){const r=await fetch(`https://translation.googleapis.com/language/translate/v2?key=${gk}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q:t,source:'en',target:'gu',format:'text'}),signal:TO()});const j=await r.json();return j?.data?.translations?.[0]?.translatedText||null}
 const em=process.env.MYMEMORY_EMAIL;const parts:string[]=[];let cur='';for(const s of t.split(/(?<=[.!?])\s+/)){if((cur+' '+s).length>450){if(cur)parts.push(cur);cur=s}else cur=cur?cur+' '+s:s}if(cur)parts.push(cur);
 const out:string[]=[];for(const p of parts){const r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(p)}&langpair=en|gu${em?`&de=${encodeURIComponent(em)}`:''}`,{signal:TO()});const j=await r.json();const x=j?.responseData?.translatedText;if(!x||/MYMEMORY WARNING/i.test(x))return null;out.push(x)}return out.join(' ')}catch{return null}}
// Manual (Gujarati typed by admin) entries are never overwritten.
export async function syncRashifal(force=false){const x=svc();const d=today();const errs:string[]=[];let gu=0,en=0;
const {data:ex,error:e0}=await x.from('rashifal').select('sign,src').eq('day',d);if(e0)return {gu,en,errs:['rashifal ટેબલ/કી: '+e0.message]};
await Promise.all(SIGNS.map(async([g,e])=>{const old=ex?.find((r:any)=>r.sign===g);if(old&&(old.src==='manual'||(!force&&old.src==='api-gu')))return;
 try{const t=await fetchEn(e);const tr=await toGu(t);const {error}=await x.from('rashifal').upsert({sign:g,day:d,text:tr||t,src:tr?'api-gu':'api-en'});if(error)throw new Error(error.message);tr?gu++:en++}catch(err:any){errs.push(`${g}: ${String(err.message||err).slice(0,80)}`)}}));
return {gu,en,errs}}
