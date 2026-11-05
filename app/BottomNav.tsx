'use client';
import Link from 'next/link';import {usePathname} from 'next/navigation';
const I=[['🏠','હોમ','/'],['📺','વિડિયો','/video'],['🎬','રીલ','/reels'],['📰','ઈ-પેપર','/epaper'],['👤','પ્રોફાઇલ','/me']];
export default function BN(){const p=usePathname()||'';
return <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">{I.map(([i,l,h])=>{const on=h==='/'?p==='/':p.startsWith(h);return <Link key={h} href={h} className={`relative flex flex-col items-center py-1.5 text-[11px] font-bold ${on?'text-red':'text-neutral-500'}`}>{on&&<span className="absolute top-0 h-0.5 w-8 bg-red rounded-full"/>}<span className="text-xl leading-none">{i}</span>{l}</Link>})}</nav>}
