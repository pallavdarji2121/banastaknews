'use client';
export default function T(){return <button aria-label="થીમ" onClick={()=>{const d=document.documentElement.classList.toggle('dark');try{localStorage.setItem('t',d?'dark':'light')}catch{}}} className="fixed right-3 bottom-4 z-50 w-11 h-11 rounded-full border bg-white dark:bg-neutral-800 shadow">🌓</button>}
