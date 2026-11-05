import {NextResponse} from 'next/server';import {syncRashifal} from '@/lib/rashifal';
export const maxDuration=60;
// Vercel Cron (daily 00:30 IST) calls this with Authorization: Bearer $CRON_SECRET
export async function GET(req:Request){if(!process.env.CRON_SECRET||req.headers.get('authorization')!==`Bearer ${process.env.CRON_SECRET}`)return NextResponse.json({error:'unauthorized'},{status:401});return NextResponse.json(await syncRashifal())}
