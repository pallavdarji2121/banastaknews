import {NextResponse} from 'next/server';import {syncApmc} from '@/lib/mandiSync';
export const maxDuration=30;export const dynamic='force-dynamic';
// 1) Vercel Cron (daily) sends  Authorization: Bearer $CRON_SECRET  -> always syncs
// 2) Visitors' browsers ping  /api/mandi-sync?lazy=1  -> syncs only if the last sync is older than 90 minutes (6am–10pm IST)
export async function GET(req:Request){
  const auth=process.env.CRON_SECRET&&req.headers.get('authorization')===`Bearer ${process.env.CRON_SECRET}`;
  if(auth)return NextResponse.json(await syncApmc({force:true}));
  if(new URL(req.url).searchParams.get('lazy')){const r=await syncApmc({minGapMin:90,window:true});return NextResponse.json({ok:r.ok,updated:r.updated})}
  return NextResponse.json({error:'unauthorized'},{status:401})}
