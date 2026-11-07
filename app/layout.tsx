import './globals.css';import {Hind_Vadodara,Rasa} from 'next/font/google';import T from './ThemeToggle';import IC from './ImgCompress';
const body=Hind_Vadodara({subsets:['gujarati','latin'],weight:['400','500','600','700'],variable:'--f-body',display:'swap'});
const head=Rasa({subsets:['gujarati','latin'],weight:['500','600','700'],variable:'--f-head',display:'swap'});
export const metadata={title:'બનાસ તક',description:'બનાસકાંઠા અને વાવ-થરાદના તાજા સમાચાર'};
export const viewport={themeColor:'#E53935',width:'device-width',initialScale:1};
export default function L({children}:{children:React.ReactNode}){return <html lang="gu" suppressHydrationWarning><body className={`${body.variable} ${head.variable} font-body bg-white text-neutral-900 dark:bg-[#0b0d12] dark:text-neutral-100`}><script dangerouslySetInnerHTML={{__html:"try{if(localStorage.getItem('t')=='dark')document.documentElement.classList.add('dark')}catch(e){}"}}/><div className="mesh"/>{children}<T/><IC/></body></html>}
