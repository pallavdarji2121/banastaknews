import {redirect} from 'next/navigation';import {sb,RMAIL,me} from '@/lib/supabase';
async function login(f:FormData){'use server';const id=String(f.get('id')).trim().toLowerCase();const s=await sb();
const {error}=await s.auth.signInWithPassword({email:RMAIL(id),password:String(f.get('pw'))});if(error)redirect('/report?e=1');
const m=await me();if(!m||!m.active||m.reporter_code!==id){await s.auth.signOut();redirect('/report?e=1')}redirect(`/reporter/${id}`)}
export default async function P({searchParams}:{searchParams:Promise<any>}){const q=await searchParams;
return <form action={login} className="max-w-sm mx-auto mt-16 box text-center space-y-3"><img src="/logo.png" className="w-20 mx-auto rounded-full" alt=""/><h1 className="text-xl font-extrabold">રિપોર્ટર લોગિન</h1><input name="id" placeholder="રિપોર્ટર ID (reporter1)" className="inp" required/><input name="pw" type="password" placeholder="પાસવર્ડ" className="inp" required/>{q.e&&<p className="text-red">ખોટો ID/પાસવર્ડ અથવા ખાતું બંધ છે.</p>}<button className="btnr w-full">લોગિન</button></form>}
