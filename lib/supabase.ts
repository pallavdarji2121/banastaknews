import {createServerClient} from '@supabase/ssr';import {createClient} from '@supabase/supabase-js';import {cookies} from 'next/headers';
export async function sb(){const c=await cookies();return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>c.getAll(),setAll:(l)=>{try{l.forEach(({name,value,options})=>c.set(name,value,options))}catch{}}}})}
// server-only, service role: used ONLY after requireAdmin()
export function svc(){return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}})}
export async function me(){const s=await sb();const {data:{user}}=await s.auth.getUser();if(!user)return null;const {data:p}=await s.from('profiles').select('*').eq('id',user.id).single();return p?{...p,user}:null}
export async function requireAdmin(){const m=await me();if(!m||m.role!=='admin'||!m.active)throw new Error('forbidden');return m}
export const RMAIL=(code:string)=>`${code.toLowerCase()}@reporter.banastak.com`;
