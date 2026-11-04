'use client';
import {useRef} from 'react';
export default function Editor({name='body',rows=12,defaultValue=''}:any){const r=useRef<HTMLTextAreaElement>(null);
const wrap=(a:string,b='')=>{const t=r.current!;const s=t.selectionStart,e=t.selectionEnd,v=t.value;const sel=v.slice(s,e)||'લખાણ';t.value=v.slice(0,s)+a+sel+(b||a)+v.slice(e);t.focus()};
const line=(p:string)=>{const t=r.current!;const v=t.value;const i=v.lastIndexOf('\n',t.selectionStart-1)+1;t.value=v.slice(0,i)+p+v.slice(i);t.focus()};
const B:[string,()=>void][]=[['B',()=>wrap('**')],['I',()=>wrap('_')],['H',()=>line('## ')],['• યાદી',()=>line('- ')],['❝ અવતરણ',()=>line('> ')],['🔗 લિંક',()=>{const u=prompt('લિંક URL (https://…)');if(u)wrap('[',`](${u})`)}]];
return <div><div className="flex gap-1.5 flex-wrap border border-b-0 border-neutral-300 dark:border-neutral-700 rounded-t-lg p-1.5 bg-neutral-100 dark:bg-neutral-800">{B.map(([l,f])=><button type="button" key={l} onClick={f} className="px-3 py-1 rounded-md bg-white dark:bg-neutral-700 border text-sm font-bold hover:border-red">{l}</button>)}</div><textarea ref={r} name={name} rows={rows} defaultValue={defaultValue} required className="inp !rounded-t-none" placeholder="સંપૂર્ણ સમાચાર લખો… (ગુજરાતી ટાઇપિંગ ચાલશે)"/></div>}
