import {cache} from 'react';import {sb,hasAuth} from './supabase';
export const getMember=cache(async()=>{try{if(!(await hasAuth()))return null;const s=await sb();const {data:{user}}=await s.auth.getUser();if(!user)return null;
const [{data:m},{data:p}]=await Promise.all([s.from('members').select('*').eq('id',user.id).maybeSingle(),s.from('profiles').select('role,reporter_code,full_name').eq('id',user.id).maybeSingle()]);
return {id:user.id,email:user.email,name:m?.full_name||p?.full_name||user.email?.split('@')[0]||'યુઝર',taluka_id:m?.taluka_id||null,mobile:m?.mobile||'',role:(p?.role||'user') as string,code:p?.reporter_code as string}}catch{return null}});
