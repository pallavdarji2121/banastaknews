// Real APIs only. No key / API error => clear "data unavailable" message. Nothing is ever faked.
export async function getMarket():Promise<any>{const k=process.env.STOCK_API_KEY;if(!k)return {err:'શેરબજાર ડેટા ઉપલબ્ધ નથી – STOCK_API_KEY ગોઠવાયેલ નથી'};
const defs=(process.env.MARKET_SYMBOLS||'NIFTY 50|NIFTY:NSE,SENSEX|SENSEX:BSE,BANK NIFTY|BANKNIFTY:NSE').split(',');
try{const rows=await Promise.all(defs.map(async d=>{const [label,sx]=d.split('|');const [sym,ex]=sx.split(':');
const r=await fetch(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(sym)}${ex?`&exchange=${ex}`:''}&apikey=${k}`,{next:{revalidate:60}});const j=await r.json();
if(j.status==='error'||!j.close)return {label,err:j.message||'ડેટા નથી'};return {label,price:+j.close,pct:+j.percent_change,chg:+j.change,open:j.is_market_open,at:j.datetime}}));return {rows}}catch{return {err:'શેરબજાર ડેટા ઉપલબ્ધ નથી'}}}
export async function getCricket():Promise<any>{const k=process.env.CRICKET_API_KEY;if(!k)return {err:'ક્રિકેટ ડેટા ઉપલબ્ધ નથી – CRICKET_API_KEY ગોઠવાયેલ નથી'};
try{const r=await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${k}&offset=0`,{next:{revalidate:60}});const j=await r.json();if(j.status!=='success')return {err:'ક્રિકેટ ડેટા ઉપલબ્ધ નથી ('+(j.reason||'API ભૂલ')+')'};return {m:(j.data||[]).slice(0,20)}}catch{return {err:'ક્રિકેટ ડેટા ઉપલબ્ધ નથી'}}}
