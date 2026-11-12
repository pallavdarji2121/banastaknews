// Pure HTML parser for the APMC Deesa home page (no network, no database) – easy to test.
export const K=(s:string)=>s.toLowerCase().replace(/[^a-z]/g,'');
// English (as written on APMC site) -> Gujarati. Unknown names are kept as written and reported in the admin panel.
export const GU:Record<string,string>={castor:'એરંડા',mustard:'રાયડો',groundnut:'મગફળી',bajari:'બાજરી',bajri:'બાજરી',bajra:'બાજરી',adad:'અડદ',udad:'અડદ',rajkabajari:'રજકા બાજરી',gavar:'ગવાર',guar:'ગવાર',wheat:'ઘઉં',rajgaro:'રાજગરો',rajgira:'રાજગરો',mag:'મગ',moong:'મગ',seseam:'તલ',sesame:'તલ',til:'તલ',bijda:'બીજડા',chana:'ચણા',gram:'ચણા',kapas:'કપાસ',cotton:'કપાસ',jowar:'જુવાર',juwar:'જુવાર',maize:'મકાઈ',makai:'મકાઈ',tur:'તુવેર',toor:'તુવેર',cumin:'જીરું',jeera:'જીરું',isabgul:'ઇસબગુલ',fennel:'વરિયાળી',variyali:'વરિયાળી',methi:'મેથી',dhaniya:'ધાણા',coriander:'ધાણા',soybean:'સોયાબીન',
 potato:'બટાટા',onion:'ડુંગળી',brinjal:'રીંગણ',tomato:'ટામેટા',lemon:'લીંબુ',chilli:'મરચાં',chili:'મરચાં',garlic:'લસણ',cabbage:'કોબીજ',ladyfinger:'ભીંડા',okra:'ભીંડા',bhindi:'ભીંડા',coconut:'નાળિયેર',cauliflower:'ફ્લાવર',carrot:'ગાજર',peas:'વટાણા',vatana:'વટાણા',spinach:'પાલક',cucumber:'કાકડી',capsicum:'સિમલા મરચાં',beetroot:'બીટ',radish:'મૂળા',ginger:'આદુ',pumpkin:'કોળું',bottlegourd:'દૂધી',dudhi:'દૂધી',turia:'તુરિયા',karela:'કારેલા',parval:'પરવળ',banana:'કેળા',papaya:'પપૈયા',guava:'જામફળ',pomegranate:'દાડમ',mango:'કેરી',watermelon:'તડબૂચ',grapes:'દ્રાક્ષ',orange:'સંતરા',apple:'સફરજન'};
export type Parsed={key:string,date:string,rows:{en:string,min:number,max:number}[]};
const dec=(s:string)=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#8211;|&ndash;/gi,'-').replace(/&#?\w+;/g,' ').replace(/\s+/g,' ').trim();
const num=(s:string)=>{const m=s.replace(/,/g,'').match(/\d+(?:\.\d+)?/);return m?Math.round(parseFloat(m[0])):NaN};
function yardOf(head:string,idx:number,total:number){const h=head.toLowerCase();if(/bhildi|bhiladi/.test(h))return 'bhildi';if(/v\.?\s*j|patel|veg/.test(h))return 'vj';if(/deesa|disa/.test(h))return 'deesa';return total===3?['deesa','vj','bhildi'][idx]:''}
// pure function (no network) so it can be tested with sample HTML
export function parseApmc(html:string):Parsed[]{
  const clean=html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  const out:Parsed[]=[];const re=/<table[\s\S]*?<\/table>/gi;let m:RegExpExecArray|null,prevEnd=0,idx=0;const tables:{t:string,head:string}[]=[];
  while((m=re.exec(clean))){const before=clean.slice(prevEnd,m.index);const lines=before.replace(/<[^>]+>/g,'\n').split('\n').map(x=>dec(x)).filter(Boolean);tables.push({t:m[0],head:lines[lines.length-1]||''});prevEnd=m.index+m[0].length}
  for(const {t,head} of tables){
    const key=yardOf(head,idx++,tables.length);if(!key)continue;
    const rows:Parsed['rows']=[];let date='';
    for(const tr of t.match(/<tr[\s\S]*?<\/tr>/gi)||[]){
      const cells=[...tr.matchAll(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi)].map(c=>dec(c[2]));if(!cells.length)continue;
      const d=cells.join(' ').match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
      if(d&&!date){date=`${d[3]}-${d[2].padStart(2,'0')}-${d[1].padStart(2,'0')}`;continue}   // dd/mm/yyyy
      const mn=num(cells[1]||''),mx=num(cells[2]||'');const name=(cells[0]||'').trim();
      if(!name||/^(min|max|crop|item|name)\b/i.test(name)||isNaN(mn)||isNaN(mx))continue;
      rows.push({en:name,min:Math.min(mn,mx),max:Math.max(mn,mx)});
    }
    if(date&&rows.length)out.push({key,date,rows});
  }
  return out;
}
