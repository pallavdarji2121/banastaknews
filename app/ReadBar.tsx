'use client';
import {useEffect,useState} from 'react';
// thin scroll-progress line at the very top of every page
export default function ReadBar(){const [p,setP]=useState(0);
  useEffect(()=>{const f=()=>{const h=document.documentElement.scrollHeight-innerHeight;setP(h>0?Math.min(100,scrollY/h*100):0)};f();addEventListener('scroll',f,{passive:true});addEventListener('resize',f);return()=>{removeEventListener('scroll',f);removeEventListener('resize',f)}},[]);
  return <div aria-hidden className="fixed top-0 left-0 z-[950] h-[3px] bg-gradient-to-r from-red via-orange-500 to-amber-400 transition-[width] duration-100 print:hidden" style={{width:`${p}%`,opacity:p>1?1:0}}/>}
