import Editor from '@/app/Editor';
export default function NewsFields({cats,tals,vil,admin}:{cats:any[],tals?:any[],vil?:string[],admin?:boolean}){const L='block text-sm font-semibold mb-1';
return <div className="space-y-4">
<div><label className={L}>હેડલાઇન *</label><input name="title" className="inp text-lg font-bold" required placeholder="સમાચારનું શીર્ષક"/></div>
<div><label className={L}>ટૂંકું વર્ણન</label><input name="summary" className="inp" placeholder="1-2 લીટીમાં સારાંશ"/></div>
<div><label className={L}>સંપૂર્ણ સમાચાર *</label><Editor/></div>
<div className="grid gap-4 sm:grid-cols-3"><div><label className={L}>શ્રેણી *</label><select name="c" className="inp" required><option value="">પસંદ કરો</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
{admin&&<div><label className={L}>તાલુકો</label><select name="t" className="inp"><option value="">— ગુજરાત/દેશ —</option>{tals?.map(t=><option key={t.id} value={t.id}>{t.districts?.name} – {t.name}</option>)}</select></div>}
<div><label className={L}>ગામ (લખો, નવું હશે તો ઉમેરાશે)</label><input name="vn" list="vl" className="inp" placeholder="ગામનું નામ"/><datalist id="vl">{vil?.map(v=><option key={v} value={v}/>)}</datalist></div></div>
<div className="grid gap-4 sm:grid-cols-2"><div><label className={L}>મુખ્ય ફોટો (JPG/PNG/WebP, 5MB સુધી)</label><input name="img" type="file" accept="image/jpeg,image/png,image/webp" className="inp"/></div>
<div><label className={L}>વધારાના ફોટા (6 સુધી)</label><input name="gal" type="file" multiple accept="image/jpeg,image/png,image/webp" className="inp"/></div>
<div><label className={L}>વિડિયો અપલોડ (MP4, 50MB સુધી)</label><input name="vf" type="file" accept="video/mp4" className="inp"/></div>
<div><label className={L}>અથવા YouTube લિંક</label><input name="yt" className="inp" placeholder="https://youtu.be/…"/></div></div>
<label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="bk" className="w-5 h-5"/> ⚡ બ્રેકિંગ ન્યૂઝ {admin?'':'(એડમિન મંજૂરી જરૂરી)'}</label>
<div className="flex gap-3 flex-wrap"><button name="mode" value="draft" className="btn">💾 ડ્રાફ્ટ સાચવો</button><button name="mode" value="submit" className="btnr">{admin?'🚀 પ્રકાશિત કરો':'📤 મંજૂરી માટે મોકલો'}</button></div></div>}
