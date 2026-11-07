import {NextResponse} from 'next/server';import {search} from '@/lib/stocks';
export async function GET(req:Request){const q=(new URL(req.url).searchParams.get('q')||'').replace(/[^\w\s&.\-]/g,'').trim().slice(0,40);if(q.length<2)return NextResponse.json([]);return NextResponse.json(await search(q))}
