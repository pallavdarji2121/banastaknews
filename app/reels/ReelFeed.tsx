'use client';
import {useEffect,useRef,useState} from 'react';
const YT=/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/;
export default function ReelFeed({items}:{items:any[]}){const [mute,setMute]=useState(true);const refs=useRef<(HTMLVideoElement|null)[]>([]);
useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target as HTMLVideoElement;if(e.isIntersecting)v.play().catch(()=>{});else v.pause()}),{threshold:.7});refs.current.forEach(v=>v&&io.observe(v));return()=>io.disconnect()},[items]);
useEffect(()=>{refs.current.forEach(v=>{if(v)v.muted=mute})},[mute]);
return <div className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory bg-black">{items.map((r,i)=>{const y=r.video_url.match(YT);return <section key={r.id} className="snap-start h-[100dvh] relative flex items-center justify-center">{y?<iframe src={`https://www.youtube.com/embed/${y[1]}?playsinline=1&rel=0`} className="h-full w-full max-w-[480px]" allowFullScreen/>:<video ref={el=>{refs.current[i]=el}} src={r.video_url} loop muted playsInline preload="metadata" className="h-full w-full max-w-[480px] object-cover" onClick={()=>setMute(m=>!m)}/>}
<div className="absolute bottom-0 inset-x-0 max-w-[480px] mx-auto px-5 pb-10 pt-20 text-white pointer-events-none bg-gradient-to-t from-black/80 to-transparent"><b className="text-lg leading-snug">{r.title}</b><div className="text-xs opacity-70 mt-1">{mute?'🔇 અવાજ માટે ટૅપ કરો':'🔊'} • ઉપર સ્વાઇપ કરો ↑</div></div></section>})}</div>}
