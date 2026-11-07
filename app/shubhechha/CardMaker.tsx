'use client';
import {useEffect,useRef,useState} from 'react';
export default function CM(){const [name,setName]=useState('');const ref=useRef<HTMLCanvasElement>(null);
useEffect(()=>{const draw=()=>{const c=ref.current;if(!c)return;const x=c.getContext('2d')!;const W=1080,H=1350;c.width=W;c.height=H;
const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#7f1d1d');g.addColorStop(.5,'#E53935');g.addColorStop(1,'#f59e0b');x.fillStyle=g;x.fillRect(0,0,W,H);
for(let i=0;i<70;i++){x.globalAlpha=.15+((i*37)%25)/100;x.fillStyle='#fff';x.beginPath();x.arc((i*263)%W,(i*131)%(H*.55),(i%5)+1.5,0,7);x.fill()}x.globalAlpha=1;
const fam=getComputedStyle(document.body).getPropertyValue('--f-head')||'serif';x.textAlign='center';x.fillStyle='#fff';
x.font='230px serif';x.fillText('🪔',W/2,420);x.font=`700 150px ${fam}, serif`;x.fillText('શુભ દિવાળી',W/2,650);x.font=`700 80px ${fam}, serif`;x.fillText('નૂતન વર્ષાભિનંદન',W/2,760);
x.font=`600 64px ${fam}, serif`;x.fillStyle='#fde68a';x.fillText(name.trim()?name.trim().slice(0,28)+' અને પરિવારને':'આપ સૌને',W/2,920);x.fillStyle='#fff';x.font=`500 54px ${fam}, serif`;x.fillText('દિવાળીની હાર્દિક શુભેચ્છાઓ',W/2,1000);
x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,1190,W,160);x.fillStyle='#fff';x.font=`700 60px ${fam}, serif`;x.fillText('બનાસ તક પરિવાર તરફથી',W/2,1260);x.font='500 36px sans-serif';x.fillText(location.host,W/2,1315)};
draw();document.fonts?.ready.then(draw)},[name]);
const dl=()=>ref.current?.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b!);a.download='diwali-shubhechha.png';a.click()});
const share=()=>ref.current?.toBlob(async b=>{const f=new File([b!],'shubhechha.png',{type:'image/png'});const n:any=navigator;if(n.canShare?.({files:[f]})){try{await n.share({files:[f],text:'દિવાળીની શુભેચ્છાઓ – બનાસ તક'})}catch{}}else window.open('https://wa.me/?text='+encodeURIComponent('દિવાળીની શુભેચ્છાઓ! 🪔 '+location.origin+'/shubhechha'))});
return <div className="grid gap-6 md:grid-cols-2 items-start"><canvas ref={ref} className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"/><div className="space-y-4"><div><label className="font-bold block mb-1">તમારું (કે પરિવારનું) નામ લખો</label><input value={name} onChange={e=>setName(e.target.value)} maxLength={28} placeholder="દા.ત. પટેલ" className="inp !py-3 text-lg"/></div><div className="flex gap-3 flex-wrap"><button onClick={dl} className="btnr !py-3 flex-1">⬇ ડાઉનલોડ</button><button onClick={share} className="btn !py-3 flex-1">💬 શેર કરો</button></div><p className="text-sm text-neutral-500">કાર્ડ તમારા ફોનમાં જ બને છે. ડાઉનલોડ કરીને WhatsApp/Instagram પર મોકલો.</p></div></div>}
