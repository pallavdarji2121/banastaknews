import {redirect} from 'next/navigation';import {me} from './supabase';
export async function guard(){const m=await me();if(!m||m.role!=='admin'||!m.active)redirect('/admin');return m}
