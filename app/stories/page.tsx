import {getHomeNews} from '@/lib/cache';import Stories from './Stories';
export const metadata={title:'સ્ટોરીઝ – 30 સેકન્ડમાં સમાચાર | બનાસ તક'};
export default async function P({searchParams}:{searchParams:Promise<any>}){const q=await searchParams;const all=await getHomeNews();
const items=all.filter((n:any)=>n.thumbnail_url).slice(0,10).map((n:any)=>({id:n.id,slug:n.slug,title:n.title,summary:(n.summary||'').slice(0,200),img:n.thumbnail_url,at:n.published_at,cat:n.categories?.name||'',place:n.talukas?.name||''}));
const start=Math.min(Math.max(parseInt(q.i||'0')||0,0),Math.max(0,items.length-1));
return <Stories items={items} start={start} site={process.env.NEXT_PUBLIC_SITE_URL||''}/>}
