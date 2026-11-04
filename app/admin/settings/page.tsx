import {revalidatePath} from 'next/cache';import {redirect} from 'next/navigation';import {sb} from '@/lib/supabase';import {guard} from '@/lib/admin';import {up} from '@/lib/upload';import {getSite,PAGES} from '@/lib/site';import {PT,Panel,Msg} from '@/lib/ui';
const F=[['name','વેબસાઇટનું નામ'],['tag','ટેગલાઇન'],['phone','સંપર્ક નંબર'],['wa','WhatsApp નંબર (91 સાથે)'],['email','ઈમેલ'],['addr','સરનામું'],['fb','Facebook લિંક'],['ig','Instagram લિંક'],['yt','YouTube લિંક']];
const SH=[['market','શેરબજાર'],['cricket','ક્રિકેટ'],['video','વિડિયો'],['taluka','તાલુકા'],['cats','શ્રેણી બ્લોક']];
async function save(f:FormData){'use server';const m=await guard();const s=await sb();const S=await getSite();const o:any={};F.forEach(([k])=>o[k]=String(f.get(k)||'').trim());
o.footer=String(f.get('footer')||'');o.ticker=String(f.get('ticker')||'');o.show={};SH.forEach(([k])=>o.show[k]=!!f.get('s_'+k));o.pages={};Object.keys(PAGES).forEach(k=>o.pages[k]=String(f.get('p_'+k)||''));
o.logo=(await up(s,m.id,f.get('logo') as File,['image/png','image/jpeg','image/webp'],2e6))||S.logo||'';
const {error}=await s.from('website_settings').upsert({key:'site',value:o});revalidatePath('/','layout');redirect('/admin/settings?m='+(error?'err':'ok'))}
export default async function P({searchParams}:{searchParams:Promise<any>}){const q=await searchParams;await guard();const S=await getSite();
return <><PT t="વેબસાઇટ સેટિંગ" sub="અહીં બદલેલું બધું સીધું જાહેર સાઇટ પર દેખાશે"/><Msg m={q.m}/><form action={save} className="space-y-6">
<Panel t="🏷️ બ્રાન્ડ અને સંપર્ક"><div className="grid gap-4 sm:grid-cols-2">{F.map(([k,l])=><div key={k}><label className="block text-sm font-semibold mb-1">{l}</label><input name={k} defaultValue={S[k]} className="inp"/></div>)}<div><label className="block text-sm font-semibold mb-1">લોગો બદલો (PNG/JPG, 2MB)</label><input name="logo" type="file" accept="image/png,image/jpeg,image/webp" className="inp"/></div></div></Panel>
<Panel t="⚡ બ્રેકિંગ ટિકર (મેન્યુઅલ)"><textarea name="ticker" rows={3} defaultValue={S.ticker} className="inp" placeholder="દરેક લાઇનમાં એક હેડલાઇન (બ્રેકિંગ સમાચાર સાથે ઉમેરાશે)"/></Panel>
<Panel t="🧩 હોમપેજના વિભાગો"><div className="flex gap-6 flex-wrap">{SH.map(([k,l])=><label key={k} className="flex items-center gap-2 font-semibold"><input type="checkbox" name={'s_'+k} defaultChecked={S.show[k]} className="w-5 h-5"/> {l}</label>)}</div></Panel>
<Panel t="🦶 ફૂટર લખાણ"><textarea name="footer" rows={3} defaultValue={S.footer} className="inp"/></Panel>
<Panel t="📄 પેજ કન્ટેન્ટ">{Object.keys(PAGES).map(k=><div key={k} className="mb-4"><label className="block text-sm font-semibold mb-1">{PAGES[k][0]} (/p/{k})</label><textarea name={'p_'+k} rows={4} defaultValue={S.pages[k]||PAGES[k][1]} className="inp"/></div>)}</Panel>
<button className="btnr !px-8 !py-3 text-lg">💾 બધું સાચવો</button></form></>}
