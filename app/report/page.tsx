import {redirect} from 'next/navigation';import {sb,RMAIL,me} from '@/lib/supabase';import {LoginBox} from '@/lib/ui';
async function login(f:FormData){'use server';const id=String(f.get('id')).trim().toLowerCase();const s=await sb();
const {error}=await s.auth.signInWithPassword({email:RMAIL(id),password:String(f.get('pw'))});if(error)redirect('/report?e=1');
const m=await me();if(!m||!m.active||m.reporter_code!==id){await s.auth.signOut();redirect('/report?e=1')}redirect(`/reporter/${id}`)}
export default async function P({searchParams}:{searchParams:Promise<any>}){const q=await searchParams;
return <LoginBox title="રિપોર્ટર લોગિન" sub="તમારા રિપોર્ટર ID અને પાસવર્ડથી પ્રવેશ કરો"><form action={login} className="space-y-3"><input name="id" placeholder="રિપોર્ટર ID (દા.ત. reporter1)" className="inp !py-3" required/><input name="pw" type="password" placeholder="પાસવર્ડ" className="inp !py-3" required/>{q.e&&<p className="text-red font-semibold">ખોટો ID/પાસવર્ડ અથવા ખાતું બંધ છે.</p>}<button className="btnr w-full !py-3 text-lg">લોગિન</button></form></LoginBox>}
