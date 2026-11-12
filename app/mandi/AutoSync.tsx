'use client';
import {useEffect} from 'react';import {useRouter} from 'next/navigation';
// Visitors silently ping the sync endpoint (max once per 30 min per phone). The server itself only
// re-reads APMC Deesa if its last sync is older than 90 minutes, so the source site is never hammered.
export default function AutoSync(){const r=useRouter();
  useEffect(()=>{try{const t=+(localStorage.getItem('mandi-ping')||0);if(Date.now()-t<30*60e3)return;localStorage.setItem('mandi-ping',String(Date.now()))}catch{}
    fetch('/api/mandi-sync?lazy=1',{cache:'no-store'}).then(x=>x.json()).then(j=>{if(j?.updated)r.refresh()}).catch(()=>{})},[r]);
  return null}
