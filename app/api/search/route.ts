import {NextResponse} from 'next/server';import {sb} from '@/lib/supabase';
export async function GET(req:Request){const q=(new URL(req.url).searchParams.get('q')||'').replace(/[%,()]/g,'').trim().slice(0,60);if(q.length<2)return NextResponse.json([]);
const s=await sb();const {data}=await s.from('news').select('slug,title,categories(name)').eq('status','published').is('deleted_at',null).ilike('title',`%${q}%`).order('published_at',{ascending:false}).limit(7);return NextResponse.json(data||[])}
