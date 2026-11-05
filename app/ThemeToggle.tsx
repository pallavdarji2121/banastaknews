'use client';
import {useEffect,useState} from 'react';import {usePathname} from 'next/navigation';
export default function T(){const [up,setUp]=useState(false);const pn=usePathname()||'';const panel=/^\/(admin|reporter|report|login|me)/.test(pn);
useEffect(()=>{const f=()=>setUp(scrollY>600);addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
return <><button aria-label="ઉપર જાઓ" onClick={()=>scrollTo({top:0,behavior:'smooth'})} className={`fixed right-3 bottom-20 md:bottom-20 z-50 w-10 h-10 md:w-11 md:h-11 rounded-full bg-red text-white shadow-lg font-black transition ${up?'opacity-100':'opacity-0 pointer-events-none'}`}>↑</button>
<button aria-label="થીમ બદલો" onClick={()=>{const d=document.documentElement.classList.toggle('dark');try{localStorage.setItem('t',d?'dark':'light')}catch{}}} className={`${panel?'':'hidden md:block'} fixed right-3 bottom-20 md:bottom-4 z-50 w-11 h-11 rounded-full border bg-white dark:bg-neutral-800 shadow-lg`}>🌓</button></>}
