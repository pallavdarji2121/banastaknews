'use client';
import Link from 'next/link';import {usePathname} from 'next/navigation';
export default function NL({href,children}:{href:string,children:React.ReactNode}){const on=usePathname()===href;
return <Link href={href} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl whitespace-nowrap font-semibold transition ${on?'bg-red text-white shadow-lg shadow-red/30':'hover:bg-white/10 hover:text-white'}`}>{children}</Link>}
