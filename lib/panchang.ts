// Choghadiya / Rahukaal calculation from real sunrise & sunset (Open-Meteo). Nothing is invented.
export const VAR=['રવિવાર','સોમવાર','મંગળવાર','બુધવાર','ગુરુવાર','શુક્રવાર','શનિવાર'];
const CH=['ઉદ્વેગ','ચલ','લાભ','અમૃત','કાળ','શુભ','રોગ'];            // fixed Vedic cycle
const GOOD=[false,true,true,true,false,true,false];
const START=[0,3,6,2,5,1,4];                                        // day choghadiya of Sun..Sat
const RAHU=[8,2,7,5,6,4,3],GULIKA=[7,6,5,4,3,2,1],YAMA=[5,4,3,2,1,7,6]; // 1-based eighth of the day
export type Slot={n:string,good:boolean,s:number,e:number};
export type Block={label:string,kind:'day'|'night',slots:Slot[]};
const ist=(s:string)=>new Date(s+':00+05:30').getTime();
const wd=(d:string)=>new Date(d+'T12:00:00+05:30').getUTCDay();
// day order moves +1 through the cycle, night order moves -2 (traditional)
function chog(a:number,b:number,first:number,step:number):Slot[]{const l=(b-a)/8;return Array.from({length:8},(_,i)=>{const k=(((first+step*i)%7)+7)%7;return {n:CH[k],good:GOOD[k],s:a+i*l,e:a+(i+1)*l}})}
// idx: 0 = yesterday, 1 = today, 2 = tomorrow (as returned by lib/weather sun())
export function build(d:{rise:string[],set:string[],day:string[]}){
  const blocks:Block[]=[];
  const mk=(i:number,tag:string)=>{const w=wd(d.day[i]);const rise=ist(d.rise[i]),set=ist(d.set[i]),nrise=ist(d.rise[i+1]);
    return {w,rise,set,nrise,day:{label:tag+' – દિવસ',kind:'day' as const,slots:chog(rise,set,START[w],1)},night:{label:tag+' – રાત્રિ',kind:'night' as const,slots:chog(set,nrise,(START[w]+5)%7,-2)}}};
  const y=mk(0,'ગઈકાલ'),t=mk(1,'આજ');
  const part=(n:number)=>{const l=(t.set-t.rise)/8;return {s:t.rise+(n-1)*l,e:t.rise+n*l}};
  const m=(t.set-t.rise)/15;
  return {
    wd:t.w,name:VAR[t.w],rise:t.rise,set:t.set,
    blocks:[y.night,t.day,t.night] as Block[],
    rahu:part(RAHU[t.w]),gulika:part(GULIKA[t.w]),yama:part(YAMA[t.w]),
    abhijit:t.w===3?null:{s:t.rise+7*m,e:t.rise+8*m},
  };
}
