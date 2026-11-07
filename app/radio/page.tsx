import {sb} from '@/lib/supabase';import {Header,Footer,Sec} from '@/lib/ui';import Player from './Player';
export const revalidate=120;
export const metadata={title:'બનાસ રેડિયો – સમાચાર સાંભળો | બનાસ તક',description:'વાંચવાનો સમય નથી? આજના મુખ્ય સમાચાર ગુજરાતીમાં સાંભળો.'};
export default async function P(){const s=await sb();const {data}=await s.from('news').select('id,slug,title,summary,categories(name),talukas(name)').eq('status','published').is('deleted_at',null).order('published_at',{ascending:false}).limit(15);
const items=(data||[]).map((n:any)=>({id:n.id,slug:n.slug,title:n.title,summary:n.summary,cat:n.categories?.name,place:n.talukas?.name}));
return <div><Header/><main className="wrap max-w-3xl"><Sec t="📻 બનાસ રેડિયો">{items.length?<><p className="text-neutral-500 -mt-2 mb-5">ખેતરમાં હો, ગાડીમાં હો કે કામમાં – આજના તાજા સમાચાર ફોન પોતે વાંચી સંભળાવશે. ▶ દબાવો.</p><Player items={items}/></>:<div className="box text-neutral-500">હજી કોઈ સમાચાર પ્રકાશિત નથી.</div>}</Sec></main><Footer/></div>}
