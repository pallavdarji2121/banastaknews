import './globals.css';import {Noto_Sans_Gujarati} from 'next/font/google';import T from './ThemeToggle';
const f=Noto_Sans_Gujarati({subsets:['gujarati'],weight:['400','600','800']});
export const metadata={title:'બનાસ તક',description:'બનાસકાંઠા અને વાવ-થરાદના તાજા સમાચાર'};
export default function L({children}:{children:React.ReactNode}){return <html lang="gu" suppressHydrationWarning><body className={`${f.className} bg-white text-neutral-900 dark:bg-[#0b0d12] dark:text-neutral-100`}><script dangerouslySetInnerHTML={{__html:"try{if(localStorage.getItem('t')=='dark')document.documentElement.classList.add('dark')}catch(e){}"}}/><div className="mesh"/>{children}<T/></body></html>}
