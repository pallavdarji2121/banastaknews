'use client';
import {useEffect,useState} from 'react';
export default function TS(){const [d,setD]=useState(false);useEffect(()=>setD(document.documentElement.classList.contains('dark')),[]);
const set=(v:boolean)=>{document.documentElement.classList.toggle('dark',v);try{localStorage.setItem('t',v?'dark':'light')}catch{}setD(v)};
return <span className="inline-flex rounded-full bg-white/10 p-0.5 text-[11px] font-bold"><button onClick={()=>set(false)} className={`px-2.5 py-0.5 rounded-full ${!d?'bg-white text-black':''}`}>☀️<span className="hidden sm:inline"> લાઇટ</span></button><button onClick={()=>set(true)} className={`px-2.5 py-0.5 rounded-full ${d?'bg-white text-black':''}`}>🌙<span className="hidden sm:inline"> ડાર્ક</span></button></span>}
