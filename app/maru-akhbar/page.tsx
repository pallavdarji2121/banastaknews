import {Header,Footer} from '@/lib/ui';import {getHomeNews,getTalukas,getNavCats} from '@/lib/cache';import Akhbar from './Akhbar';
export const metadata={title:'મારું અખબાર – તમારું પોતાનું છાપું | બનાસ તક',description:'તમારા તાલુકા અને પસંદગીના વિષયોના સમાચારનું તમારા નામનું અખબાર – પ્રિન્ટ કે PDF કરો.'};
export default async function P(){const [news,ts,cs]=await Promise.all([getHomeNews(),getTalukas(),getNavCats()]);
const items=news.map((n:any)=>({id:n.id,slug:n.slug,title:n.title,summary:n.summary,img:n.thumbnail_url,at:n.published_at,cat:n.category_id,tal:n.taluka_id,catName:n.categories?.name,talName:n.talukas?.name}));
return <div><div className="print:hidden"><Header/></div><main className="wrap max-w-5xl"><Akhbar items={items} talukas={ts.map((t:any)=>({id:t.id,name:t.name}))} cats={cs.map((c:any)=>({id:c.id,name:c.name}))} site={process.env.NEXT_PUBLIC_SITE_URL||''}/></main><div className="print:hidden"><Footer/></div></div>}
