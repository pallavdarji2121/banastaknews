// Canvas drawing for the festival photo frame and the daily thought (સુવિચાર) card.
// The logo is the only branding – no website text is drawn on the images.
import type {Fest} from './festivals';

type Ctx=CanvasRenderingContext2D;
const GOLD='#fbbf24',LIGHT='#fde68a',PALE='#fff8c9',DEEP='#b45309';
const EMOJI='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

function rng(seed:number){let s=seed>>>0;return()=>{s=(s+0x6d2b79f5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const hash=(s:string)=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};

export function fontFamily(){try{const v=getComputedStyle(document.body).getPropertyValue('--f-head').trim();return v?`${v}, serif`:'serif'}catch{return 'serif'}}
export async function loadFonts(fam:string){try{await Promise.all([document.fonts.load(`700 100px ${fam}`,'શુભ દિવાળી નૂતન વર્ષાભિનંદન સુવિચાર'),document.fonts.load(`600 100px ${fam}`,'હાર્દિક શુભેચ્છાઓ પરિવાર')])}catch{}}

function bg(x:Ctx,W:number,H:number,t:{a:string,b:string,c:string},cy:number,seed:number){
  const g=x.createRadialGradient(W/2,cy,60,W/2,cy,Math.max(W,H)*0.85);g.addColorStop(0,t.a);g.addColorStop(0.55,t.b);g.addColorStop(1,t.c);x.fillStyle=g;x.fillRect(0,0,W,H);
  const r=rng(seed);
  for(let i=0;i<24;i++){const px=r()*W,py=r()*H,pr=8+r()*26;const b=x.createRadialGradient(px,py,0,px,py,pr);b.addColorStop(0,`rgba(255,240,190,${0.08+r()*0.12})`);b.addColorStop(1,'rgba(255,240,190,0)');x.fillStyle=b;x.beginPath();x.arc(px,py,pr,0,7);x.fill()}
}
// faint scattered festival emojis in the background
function scatter(x:Ctx,m:string[],W:number,H:number,seed:number,n=22){
  const r=rng(seed+3);x.save();x.textAlign='center';x.textBaseline='middle';
  for(let i=0;i<n;i++){const px=60+r()*(W-120),py=60+r()*(H-120),s=34+r()*58;x.save();x.translate(px,py);x.rotate((r()-0.5)*0.9);x.globalAlpha=0.1+r()*0.12;x.font=`${s}px ${EMOJI}`;x.fillText(m[i%m.length],0,0);x.restore()}
  x.restore();
}
function border(x:Ctx,W:number,H:number,acc:string){
  x.strokeStyle=acc;x.lineWidth=3;x.strokeRect(34,34,W-68,H-68);x.globalAlpha=0.55;x.lineWidth=1.2;x.strokeRect(50,50,W-100,H-100);x.globalAlpha=1;x.fillStyle=acc;
  for(const [px,py] of [[34,34],[W-34,34],[34,H-34],[W-34,H-34]]){x.save();x.translate(px,py);x.rotate(Math.PI/4);x.fillRect(-9,-9,18,18);x.restore()}
}
function lights(x:Ctx,W:number){
  const n=4,seg=(W-100)/n,top=84,drop=46,bulbs=['#fde047','#fb923c','#fef3c7','#f59e0b'];x.lineWidth=2;x.strokeStyle='rgba(251,191,36,.55)';
  for(let k=0;k<n;k++){const x0=50+k*seg,x1=x0+seg,cm=(x0+x1)/2;x.beginPath();x.moveTo(x0,top);x.quadraticCurveTo(cm,top+drop*2,x1,top);x.stroke();
    for(let i=1;i<6;i++){const u=i/6,ax=(1-u)*(1-u)*x0+2*(1-u)*u*cm+u*u*x1,ay=(1-u)*(1-u)*top+2*(1-u)*u*(top+drop*2)+u*u*top;
      const g=x.createRadialGradient(ax,ay+12,0,ax,ay+12,26);g.addColorStop(0,'rgba(255,214,102,.65)');g.addColorStop(1,'rgba(255,214,102,0)');x.fillStyle=g;x.beginPath();x.arc(ax,ay+12,26,0,7);x.fill();
      x.fillStyle=bulbs[(k*5+i)%bulbs.length];x.beginPath();x.ellipse(ax,ay+12,6,9,0,0,7);x.fill()}}
}
function fit(x:Ctx,text:string,weight:number,size:number,max:number,fam:string,min=28){let fs=size;x.font=`${weight} ${fs}px ${fam}`;while(x.measureText(text).width>max&&fs>min){fs-=2;x.font=`${weight} ${fs}px ${fam}`}return fs}
function wrap(x:Ctx,text:string,maxW:number){const w=text.split(/\s+/);const out:string[]=[];let cur='';for(const t of w){const n=cur?cur+' '+t:t;if(x.measureText(n).width>maxW&&cur){out.push(cur);cur=t}else cur=n}if(cur)out.push(cur);return out}
function goldText(x:Ctx,text:string,cx:number,base:number,size:number,fam:string,glow='rgba(251,191,36,.65)'){
  x.save();x.textAlign='center';x.shadowColor=glow;x.shadowBlur=34;const fs=fit(x,text,700,size,900,fam,56);
  const g=x.createLinearGradient(0,base-fs,0,base+10);g.addColorStop(0,PALE);g.addColorStop(0.5,GOLD);g.addColorStop(1,DEEP);x.fillStyle=g;x.fillText(text,cx,base);x.restore();
}
function rr(x:Ctx,px:number,py:number,w:number,h:number,r:number){x.beginPath();x.moveTo(px+r,py);x.arcTo(px+w,py,px+w,py+h,r);x.arcTo(px+w,py+h,px,py+h,r);x.arcTo(px,py+h,px,py,r);x.arcTo(px,py,px+w,py,r);x.closePath()}
function logoBadge(x:Ctx,logo:HTMLImageElement|null,cx:number,cy:number,r:number,acc=GOLD){
  const g=x.createRadialGradient(cx,cy,r*0.8,cx,cy,r*1.9);g.addColorStop(0,'rgba(255,214,102,.5)');g.addColorStop(1,'rgba(255,214,102,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r*1.9,0,7);x.fill();
  x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.closePath();x.fillStyle='#fff';x.fill();x.clip();
  if(logo){x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(logo,cx-r+4,cy-r+4,(r-4)*2,(r-4)*2)}x.restore();
  x.strokeStyle=acc;x.lineWidth=6;x.beginPath();x.arc(cx,cy,r+4,0,7);x.stroke();x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=1.5;x.beginPath();x.arc(cx,cy,r+14,0,7);x.stroke();
}

export type FrameOpts={f:Fest,name:string,msg:string,shape:'circle'|'square',logo:HTMLImageElement|null,photo:HTMLImageElement|null,zoom:number,ox:number,oy:number,fam:string};
// 1080 x 1080 festival photo frame
export function drawFrame(c:HTMLCanvasElement,o:FrameOpts){
  const W=1080,H=1080,cx=W/2,cy=565,R=280,f=o.f,acc=f.acc||GOLD,fam=o.fam;
  c.width=W;c.height=H;const x=c.getContext('2d')!;x.textAlign='center';
  const seed=hash(f.id);bg(x,W,H,f,cy,seed);scatter(x,f.m,W,H,seed);border(x,W,H,acc);if(f.lights!==false)lights(x,W);
  goldText(x,f.name,cx,262,112,fam);
  const sq=o.shape==='square',h=sq?R*0.93:R;
  const path=()=>{if(sq)rr(x,cx-h,cy-h,h*2,h*2,64);else{x.beginPath();x.arc(cx,cy,R,0,7);x.closePath()}};
  const gl=x.createRadialGradient(cx,cy,R*0.9,cx,cy,R*1.5);gl.addColorStop(0,'rgba(255,210,100,.4)');gl.addColorStop(1,'rgba(255,210,100,0)');x.fillStyle=gl;x.beginPath();x.arc(cx,cy,R*1.5,0,7);x.fill();
  x.save();path();x.fillStyle='rgba(255,255,255,.14)';x.fill();x.clip();
  if(o.photo){const iw=o.photo.naturalWidth,ih=o.photo.naturalHeight,sc=Math.max((2*h)/iw,(2*h)/ih)*o.zoom,dw=iw*sc,dh=ih*sc;
    const dx=cx-h-(dw-2*h)*((o.ox+1)/2),dy=cy-h-(dh-2*h)*((o.oy+1)/2);x.imageSmoothingQuality='high';x.drawImage(o.photo,dx,dy,dw,dh)}
  else{x.fillStyle='rgba(255,255,255,.3)';x.beginPath();x.arc(cx,cy-40,82,0,7);x.fill();x.beginPath();x.ellipse(cx,cy+190,170,150,0,0,7);x.fill()}
  x.restore();
  x.save();path();x.strokeStyle=acc;x.lineWidth=10;x.stroke();x.restore();
  if(sq){x.save();rr(x,cx-h-26,cy-h-26,h*2+52,h*2+52,84);x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=2;x.stroke();x.restore()}
  else{x.strokeStyle='rgba(255,255,255,.3)';x.lineWidth=2;x.beginPath();x.arc(cx,cy,R+38,0,7);x.stroke()}
  if(sq)logoBadge(x,o.logo,cx+h-6,cy+h-6,62,acc);else{const a=Math.PI/4;logoBadge(x,o.logo,cx+Math.cos(a)*(R+5),cy+Math.sin(a)*(R+5),62,acc)}
  // big festival emoji in both bottom corners
  x.save();x.textAlign='center';x.textBaseline='middle';
  for(const px of [150,W-150]){const g=x.createRadialGradient(px,935,0,px,935,110);g.addColorStop(0,'rgba(255,214,102,.45)');g.addColorStop(1,'rgba(255,214,102,0)');x.fillStyle=g;x.beginPath();x.arc(px,935,110,0,7);x.fill();x.font=`104px ${EMOJI}`;x.fillStyle='#fff';x.fillText(f.e,px,940)}
  x.restore();
  // text block: optional name + wish (wraps to 2 lines)
  const n=o.name.trim().slice(0,28),wish=(o.msg.trim()||f.wish).slice(0,90);
  x.font=`600 40px ${fam}`;const lines=wrap(x,wish,600).slice(0,2);const last=1024,lh=52;
  const all:{t:string,c:string,w:number,s:number}[]=[];if(n)all.push({t:`${n} પરિવાર તરફથી`,c:'#fff',w:700,s:46});lines.forEach(t=>all.push({t,c:LIGHT,w:600,s:40}));
  all.forEach((l,i)=>{const by=last-(all.length-1-i)*lh;x.fillStyle=l.c;const fs=fit(x,l.t,l.w,l.s,600,fam,28);x.font=`${l.w} ${fs}px ${fam}`;x.fillText(l.t,cx,by)});
}

export type Mood={id:string,label:string,a:string,b:string,c:string,m:string[]};
export const MOODS:Mood[]=[
  {id:'sun',label:'સૂર્યોદય',a:'#ff9a3c',b:'#e5484d',c:'#5a1233',m:['🌅','☀️','🐦','🌼']},
  {id:'sea',label:'સમુદ્ર',a:'#1e88e5',b:'#0b4a8f',c:'#041b3d',m:['🌊','🐚','⛵','✨']},
  {id:'leaf',label:'હરિયાળી',a:'#43a047',b:'#1b5e20',c:'#052208',m:['🌿','🍃','🌳','🦋']},
  {id:'royal',label:'શાહી',a:'#7b1fa2',b:'#4a148c',c:'#1a0535',m:['👑','✨','💜','🌟']},
  {id:'rose',label:'ગુલાબી',a:'#ec407a',b:'#ad1457',c:'#3b0820',m:['🌸','🌷','💖','🦋']},
  {id:'gold',label:'સોનેરી',a:'#d4a017',b:'#8a5a00',c:'#2e1d00',m:['✨','🌾','🪙','🌟']},
  {id:'teal',label:'શાંત',a:'#00897b',b:'#00574d',c:'#01211e',m:['🍀','🪷','🌿','✨']},
  {id:'night',label:'રાત્રિ',a:'#3949ab',b:'#1a237e',c:'#080b2c',m:['🌙','⭐','✨','🌌']},
];
export type ThoughtOpts={text:string,greet:string,name:string,mood:number,date:string,logo:HTMLImageElement|null,fam:string};
// 1080 x 1350 good-morning / thought card for WhatsApp status
export function drawThought(c:HTMLCanvasElement,o:ThoughtOpts){
  const W=1080,H=1350,cx=W/2,fam=o.fam,t=MOODS[o.mood]||MOODS[0];
  c.width=W;c.height=H;const x=c.getContext('2d')!;x.textAlign='center';
  const seed=hash(t.id);bg(x,W,H,t,520,seed);scatter(x,t.m,W,H,seed,26);border(x,W,H,'rgba(255,255,255,.75)');
  logoBadge(x,o.logo,cx,190,82,'#ffffff');
  goldText(x,o.greet,cx,420,128,fam);
  // glass card
  const px=90,py=500,pw=W-180,ph=560;
  x.save();rr(x,px,py,pw,ph,44);x.fillStyle='rgba(255,255,255,.13)';x.fill();x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=2;x.stroke();x.restore();
  x.save();x.fillStyle=GOLD;x.globalAlpha=0.9;x.font=`700 150px ${fam}`;x.textAlign='left';x.fillText('“',px+34,py+120);x.restore();
  let fs=88,lines:string[]=[];const maxW=pw-120,top=py+110,bottom=py+ph-50;
  for(;fs>=38;fs-=2){x.font=`700 ${fs}px ${fam}`;lines=wrap(x,o.text,maxW);if(lines.length*fs*1.42<=bottom-top)break}
  x.fillStyle='#fff';x.textAlign='center';x.font=`700 ${fs}px ${fam}`;const lh=fs*1.42,bh=lines.length*lh,y0=top+((bottom-top)-bh)/2+fs*0.95;
  lines.forEach((l,i)=>x.fillText(l,cx,y0+i*lh));
  // footer: name + date
  x.fillStyle=LIGHT;x.font=`600 44px ${fam}`;
  const nm=o.name.trim().slice(0,28);if(nm){fit(x,`– ${nm} તરફથી`,600,48,820,fam,30);x.fillText(`– ${nm} તરફથી`,cx,1150)}
  x.fillStyle='rgba(255,255,255,.85)';x.font=`600 38px ${fam}`;x.fillText(o.date,cx,nm?1220:1170);
}

export function download(c:HTMLCanvasElement,file:string){c.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=file;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)})}
// Phone share sheet (WhatsApp etc.). Desktop fallback: saves the image.
export function share(c:HTMLCanvasElement,file:string,text:string):Promise<'shared'|'saved'>{
  return new Promise(res=>{c.toBlob(async b=>{if(!b)return res('saved');const f=new File([b],file,{type:'image/png'});const n:any=navigator;
    if(n.canShare?.({files:[f]})){try{await n.share({files:[f],text});return res('shared')}catch{return res('saved')}}
    download(c,file);res('saved')})});
}
export function loadImage(src:string):Promise<HTMLImageElement|null>{return new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src})}
