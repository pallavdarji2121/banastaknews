'use client';
import {useEffect,useState} from 'react';
export default function T(){const [up,setUp]=useState(false);
useEffect(()=>{const f=()=>setUp(scrollY>600);addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
return <><button aria-label="ઉપર જાઓ" onClick={()=>scrollTo({top:0,behavior:'smooth'})} className={`fixed right-3 bottom-36 md:bottom-20 z-50 w-11 h-11 rounded-full bg-red text-white shadow-lg font-black transition ${up?'opacity-100':'opacity-0 pointer-events-none'}`}>↑</button>
<button aria-label="થીમ બદલો" onClick={()=>{const d=document.documentElement.classList.toggle('dark');try{localStorage.setItem('t',d?'dark':'light')}catch{}}} className="fixed right-3 bottom-20 md:bottom-4 z-50 w-11 h-11 rounded-full border bg-white dark:bg-neutral-800 shadow-lg">🌓</button></>}
