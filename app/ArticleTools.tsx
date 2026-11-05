'use client';
import {useEffect,useState} from 'react';
export default function AT({text}:{text:string}){const [p,setP]=useState(0);const [sp,setSp]=useState(false);const [fs,setFs]=useState(18);const [ok,setOk]=useState(false);
useEffect(()=>{setOk('speechSynthesis' in window);const f=()=>setP(Math.min(100,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100));addEventListener('scroll',f,{passive:true});return()=>{removeEventListener('scroll',f);try{speechSynthesis.cancel()}catch{}}},[]);
useEffect(()=>{const el=document.querySelector('#abody > div') as HTMLElement|null;if(el)el.style.fontSize=fs+'px'},[fs]);
const talk=()=>{if(sp){speechSynthesis.cancel();setSp(false);return}const u=new SpeechSynthesisUtterance(text.slice(0,4000));u.lang='gu-IN';u.onend=()=>setSp(false);speechSynthesis.speak(u);setSp(true)};
return <><div className="fixed top-0 left-0 h-1 bg-red z-[60]" style={{width:p+'%'}}/><div className="flex flex-wrap gap-2 my-4">{ok&&<button onClick={talk} className="btn !py-1.5 text-sm">{sp?'⏹ બંધ કરો':'🔊 સાંભળો'}</button>}<button onClick={()=>setFs(f=>Math.max(15,f-2))} className="btn !py-1.5 text-sm">A−</button><button onClick={()=>setFs(f=>Math.min(28,f+2))} className="btn !py-1.5 text-sm">A+</button><button onClick={()=>window.print()} className="btn !py-1.5 text-sm">🖨 પ્રિન્ટ</button></div></>}
