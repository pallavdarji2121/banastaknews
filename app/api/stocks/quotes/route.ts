import {NextResponse} from 'next/server';import {quote} from '@/lib/stocks';
export async function GET(req:Request){const s=(new URL(req.url).searchParams.get('symbols')||'').split(',').map(x=>x.trim()).filter(x=>/^[A-Za-z0-9&.\-^]{1,20}$/.test(x)).slice(0,15);
const r=await Promise.all(s.map(x=>quote(x,30)));return NextResponse.json(r.filter(Boolean).map((q:any)=>({symbol:q.symbol,name:q.name,price:q.price,pct:q.pct})))}
