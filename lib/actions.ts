'use server';
import {cookies} from 'next/headers';import {revalidatePath} from 'next/cache';import {redirect} from 'next/navigation';import {svc} from './supabase';import {getMember} from './member';
async function voter(){const m=await getMember();if(m)return m.id;const c=await cookies();let v=c.get('vid')?.value;if(!v){v=crypto.randomUUID();c.set('vid',v,{maxAge:31536000,path:'/',httpOnly:true,sameSite:'lax'})}return v}
export async function vote(f:FormData){const id=+(f.get('poll') as string),ch=+(f.get('c') as string);const x=svc();const {data:p}=await x.from('polls').select('options,active').eq('id',id).maybeSingle();
if(!p||!p.active||!(ch>=0&&ch<p.options.length))return;await x.from('poll_votes').upsert({poll_id:id,voter:await voter(),choice:ch},{onConflict:'poll_id,voter',ignoreDuplicates:true});revalidatePath('/')}
export async function react(f:FormData){const id=String(f.get('id')),k=String(f.get('k'));if(!['like','love','wow','sad'].includes(k))return;
await svc().from('reactions').upsert({news_id:id,voter:await voter(),kind:k},{onConflict:'news_id,voter'});revalidatePath('/news/'+String(f.get('slug')))}
export async function sendTip(f:FormData){if(f.get('website'))redirect('/mokalo?ok=1');const text=String(f.get('text')||'').trim().slice(0,2000),phone=String(f.get('phone')||'').trim().slice(0,15);if(text.length<10||!phone)redirect('/mokalo?e=1');
const x=svc();let photo:string|null=null;const file=f.get('photo') as File;
if(file&&file.size>0){if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>4e6)redirect('/mokalo?e=2');const p=`tips/${Date.now()}-${Math.random().toString(36).slice(2)}.${file.type.split('/')[1]}`;const {error}=await x.storage.from('media').upload(p,file,{contentType:file.type});if(!error)photo=x.storage.from('media').getPublicUrl(p).data.publicUrl}
await x.from('tips').insert({name:String(f.get('name')||'').trim().slice(0,80),phone,village:String(f.get('village')||'').slice(0,80),text,photo_url:photo});redirect('/mokalo?ok=1')}
