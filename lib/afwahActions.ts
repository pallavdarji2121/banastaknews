'use server';
import {cookies} from 'next/headers';import {redirect} from 'next/navigation';import {svc} from './supabase';
// Reader sends a viral message to be checked. It stays hidden (status=pending) until an admin publishes a verdict.
export async function askAfwah(f:FormData){
  if(f.get('website'))redirect('/afwah?ok=1');                       // honeypot for bots
  const claim=String(f.get('claim')||'').trim().slice(0,1500),phone=String(f.get('phone')||'').trim().slice(0,15);
  if(claim.length<10)redirect('/afwah?e=1');
  const c=await cookies();let v=c.get('vid')?.value;if(!v){v=crypto.randomUUID();c.set('vid',v,{maxAge:31536000,path:'/',httpOnly:true,sameSite:'lax'})}
  const x=svc();const {count}=await x.from('factchecks').select('id',{count:'exact',head:true}).eq('submitter',v).gte('created_at',new Date(Date.now()-864e5).toISOString());
  if((count||0)>=5)redirect('/afwah?e=2');                            // max 5 per device per day
  await x.from('factchecks').insert({claim,phone,submitter:v,status:'pending',verdict:'checking'});
  redirect('/afwah?ok=1')}
