'use client';
import {useRef} from 'react';
export default function NavScroller({children}:{children:React.ReactNode}){const r=useRef<HTMLDivElement>(null);const go=(d:number)=>r.current?.scrollBy({left:d*320,behavior:'smooth'});
const B="hidden md:flex shrink-0 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center font-black hover:bg-red hover:text-white transition";
return <div className="flex-1 min-w-0 flex items-center gap-1"><button aria-label="પાછળ" onClick={()=>go(-1)} className={B}>‹</button><div ref={r} className="flex overflow-x-auto no-scrollbar flex-1">{children}</div><button aria-label="આગળ" onClick={()=>go(1)} className={B}>›</button></div>}
