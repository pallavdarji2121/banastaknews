import {redirect} from 'next/navigation';import {sb,me} from '@/lib/supabase';import {Shell} from '@/lib/ui';
async function out(){'use server';const s=await sb();await s.auth.signOut();redirect('/report')}
export default async function L({children,params}:{children:React.ReactNode,params:Promise<{id:string}>}){const {id}=await params;const m=await me();
if(!m||(m.role!=='admin'&&(m.reporter_code!==id||!m.active)))redirect('/report');
return <Shell brand={`રિપોર્ટર • ${id}`} user={m.full_name} logout={out} nav={[['📊','ડેશબોર્ડ',`/reporter/${id}`],['✍️','નવા સમાચાર',`/reporter/${id}/new`],['📰','મારા સમાચાર',`/reporter/${id}/news`],['🎬','રીલ અપલોડ',`/reporter/${id}/reels`],['🌐','વેબસાઇટ જુઓ','/']]}>{children}</Shell>}
