import Link from 'next/link';import {Header,Footer,Sec} from '@/lib/ui';import CardMaker from './CardMaker';import DiyaSet from '@/app/DiyaSet';
export const metadata={title:'દિવાળી શુભેચ્છા | બનાસ તક'};
export default function P(){return <div><Header/><main className="wrap max-w-4xl"><div id="diya" className="mt-6"><DiyaSet/></div><Sec t="🎁 દિવાળી શુભેચ્છા કાર્ડ બનાવો"><CardMaker/></Sec>
<Link href="/frame" className="block rounded-2xl bg-gradient-to-r from-amber-500 to-red text-white p-5 font-bold text-center my-6">🖼 તમારા ફોટા સાથે દિવાળી ફ્રેમ બનાવો →</Link></main><Footer/></div>}
