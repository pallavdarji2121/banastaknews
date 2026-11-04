import {sb,svc} from './supabase';import {up} from './upload';
const IMG=['image/jpeg','image/png','image/webp'];
export async function saveNews(m:any,f:FormData,mode:string){const s=await sb();const adm=m.role==='admin';
const t=adm?(+(f.get('t') as string)||null):m.taluka_id;let d=m.district_id;
if(adm&&t){const {data:tk}=await s.from('talukas').select('district_id').eq('id',t).single();d=tk?.district_id}
let vid=null;const vn=String(f.get('vn')||'').trim().slice(0,80);
if(vn&&t){const x=svc();const {data:ex}=await x.from('villages').select('id').eq('taluka_id',t).eq('name',vn).maybeSingle();vid=ex?.id||(await x.from('villages').insert({taluka_id:t,name:vn}).select('id').single()).data?.id||null}
const thumb=await up(s,m.id,f.get('img') as File,IMG,5e6);const gal:string[]=[];
for(const g of f.getAll('gal') as File[]){if(gal.length>=6)break;const u=await up(s,m.id,g,IMG,5e6);if(u)gal.push(u)}
const vf=await up(s,m.id,f.get('vf') as File,['video/mp4'],50e6);
const st=mode==='draft'?'draft':(adm||m.can_publish?'published':'pending');
const {data:n,error}=await s.from('news').insert({title:String(f.get('title')).slice(0,250),summary:String(f.get('summary')||'').slice(0,500),body:String(f.get('body')),category_id:+(f.get('c') as string)||null,district_id:d,taluka_id:t,village_id:vid,thumbnail_url:thumb,gallery:gal,video_url:vf||String(f.get('yt')||'').trim()||null,breaking_requested:!!f.get('bk'),is_breaking:adm&&!!f.get('bk')&&st==='published',author_id:m.id,slug:'n-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),status:st,published_at:st==='published'?new Date().toISOString():null}).select('id,status').single();
if(error)return {err:error.message};
await s.from('activity_logs').insert({actor_id:m.id,action:'news_'+n.status,ref_id:n.id});
if(n.status==='pending')await s.from('notifications').insert({to_admin:true,title:'નવા સમાચાર મંજૂરી માટે',ref_id:n.id});
return {ok:n.status}}
