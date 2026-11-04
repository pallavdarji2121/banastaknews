// npm run seed  -> creates 5 sample reporters (random passwords) + 24 SAMPLE news. Needs Node 20.6+ and admin already created.
import {createClient} from '@supabase/supabase-js';import {writeFileSync} from 'fs';import {randomBytes} from 'crypto';
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const {data:tal}=await sb.from('talukas').select('id,name,district_id');const {data:cats}=await sb.from('categories').select('id,name');
const T=n=>tal.find(x=>x.name===n);const C=n=>cats.find(x=>x.name===n)?.id;
const {data:adm}=await sb.from('profiles').select('id').eq('role','admin').limit(1).single();if(!adm){console.log('પહેલા admin બનાવો (README step 3)');process.exit(1)}
const R=[['કિરણ પટેલ','ડીસા'],['મહેશ ચૌધરી','પાલનપુર'],['જયેશ ઠાકોર','થરાદ'],['રાજેશ રબારી','વાવ'],['હિતેશ પરમાર','ધાનેરા']];
const reps=[],lines=['ID\tPASSWORD\tNAME'];
for(const [name,tk] of R){const {data:code}=await sb.rpc('next_reporter_code');const p=randomBytes(9).toString('base64url');
const {data,error}=await sb.auth.admin.createUser({email:`${code}@reporter.banastak.com`,password:p,email_confirm:true});if(error){console.log('skip:',error.message);continue}
const t=T(tk);await sb.from('profiles').insert({id:data.user.id,role:'reporter',reporter_code:code,full_name:name,taluka_id:t.id,district_id:t.district_id});reps.push({id:data.user.id});lines.push(`${code}\t${p}\t${name} (${tk})`)}
const N=[
['સ્થાનિક','ડીસા','ડીસામાં બટાટા ઉત્પાદકો માટે નવી ખરીદી વ્યવસ્થા','ખેડૂતોને યોગ્ય ભાવ મળે તે માટે નવી વ્યવસ્થાની ચર્ચા.','agri'],
['સ્થાનિક','પાલનપુર','પાલનપુરમાં નવા બાયપાસ રોડનું કામ શરૂ','ટ્રાફિકમાં રાહતની આશા, શહેરીજનોમાં ખુશી.','loc'],
['કૃષિ','થરાદ','થરાદમાં કેનાલનું પાણી છોડાતા ખેડૂતોમાં આનંદ','રવિ પાક માટે સિંચાઈની ચિંતા દૂર થવાની અપેક્ષા.','agri'],
['આરોગ્ય','વાવ','વાવ તાલુકામાં મફત આરોગ્ય શિબિરનું આયોજન','ગ્રામજનો માટે તપાસ અને દવાની સુવિધા.','hlth'],
['શિક્ષણ','પાલનપુર','શાળાઓમાં ડિજિટલ શિક્ષણનો નવો પ્રયોગ','બાળકો માટે સ્માર્ટ ક્લાસની શરૂઆત.','edu'],
['રોજગાર','વાવ','જિલ્લા કક્ષાનો રોજગાર ભરતી મેળો યોજાશે','યુવાનો માટે નોકરીની તક.','job'],
['સ્થાનિક','દિયોદર','દિયોદરમાં નાના વેપારીઓ માટે બજાર સુધારણા','સ્થાનિક અર્થતંત્રને વેગ મળવાની આશા.','biz'],
['ધાર્મિક','દાંતા','દાંતા વિસ્તારમાં ધાર્મિક મેળાની તૈયારીઓ પૂર્ણ','સુરક્ષા અને સુવિધાની વ્યવસ્થા.','rel'],
['અકસ્માત અને ગુનાખોરી','ધાનેરા','ધાનેરા હાઇવે પર વાહનચાલકોને સાવચેતીની અપીલ','ધુમ્મસમાં ગતિ ઓછી રાખવા સૂચન.','crime'],
['સ્થાનિક','ભાભર','ભાભરમાં પીવાના પાણીની નવી પાઇપલાઇન','ગામોને નિયમિત પાણી મળશે.','loc'],
['ગુજરાત',null,'રાજ્યમાં હળવા વરસાદની શક્યતા, ખેડૂતોને સલાહ','હવામાન અંગે સાવચેતી રાખવા અપીલ.','guj'],
['દેશ',null,'દેશભરમાં ડિજિટલ ચુકવણીનો વ્યાપ વધ્યો','નાના વેપારીઓમાં ઉપયોગ વધ્યો.','desh'],
['વિશ્વ',null,'વિશ્વ બજારમાં ઊર્જા ભાવ પર નજર','નિષ્ણાતો સ્થિતિ પર નજર રાખી રહ્યા છે.','world'],
['રાજકારણ',null,'સ્થાનિક સ્વરાજ્યની સંસ્થાઓમાં બેઠકનો દોર','વિકાસ કામો અંગે ચર્ચા.','pol'],
['બિઝનેસ',null,'નાના ઉદ્યોગો માટે નવી લોન યોજનાની માહિતી','અરજી પ્રક્રિયા સરળ બની.','biz'],
['શેરબજાર',null,'રોકાણકારો માટે બજારની સાપ્તાહિક સમીક્ષા','સાવચેતીપૂર્વક રોકાણની સલાહ.','mkt'],
['ક્રિકેટ',null,'ગામડાંની ક્રિકેટ સ્પર્ધામાં યુવાનોનો ઉત્સાહ','ફાઇનલ મેચ રોમાંચક રહી.','cri'],
['રમતગમત','પાલનપુર','પાલનપુરમાં જિલ્લા કક્ષાની રમતોત્સવ સ્પર્ધા','વિવિધ રમતોમાં ખેલાડીઓનું પ્રદર્શન.','spo'],
['મનોરંજન',null,'ગુજરાતી લોકસંગીત કાર્યક્રમમાં શ્રોતાઓની ભીડ','પરંપરાગત સંગીતને પ્રોત્સાહન.','ent'],
['ટેકનોલોજી',null,'ગ્રામ્ય વિસ્તારોમાં ઇન્ટરનેટ સુવિધાનો વિસ્તાર','ડિજિટલ સેવાઓ સુધી પહોંચ સરળ.','tech'],
['કૃષિ','ડીસા','બનાસકાંઠામાં ટપક સિંચાઈથી પાણીની બચત','ખેડૂતો માટે ખર્ચ ઘટાડવાના ઉપાયો.','agri'],
['શિક્ષણ','થરાદ','થરાદમાં વિદ્યાર્થીઓ માટે કારકિર્દી માર્ગદર્શન સેમિનાર','નિષ્ણાતોએ માર્ગદર્શન આપ્યું.','edu'],
['આરોગ્ય','સુઈગામ','સુઈગામમાં સ્વચ્છતા અભિયાનને ગ્રામજનોનો સાથ','સ્વચ્છ ગામ માટે સંકલ્પ.','hlth'],
['સ્થાનિક','લાખણી','લાખણીમાં નવા પશુ દવાખાનાનું ઉદ્ઘાટન','પશુપાલકોને સુવિધા મળશે.','loc'],
['કૃષિ','કાંકરેજ','કાંકરેજમાં પશુપાલકો માટે તાલીમ શિબિર','દૂધ ઉત્પાદન વધારવાની ટિપ્સ.','agri']];
const body=n=>`આ નમૂના (સેમ્પલ) સમાચાર છે, વાસ્તવિક ઘટના નથી.\n\n${n[3]}\n\nવાસ્તવિક સમાચાર રિપોર્ટર પેનલમાંથી ઉમેરાશે ત્યારે આ નમૂના સમાચાર એડમિન પેનલમાંથી કાઢી શકાશે.`;
const rows=N.map((n,i)=>{const t=n[1]?T(n[1]):null;return {slug:'demo-'+Date.now().toString(36)+i,title:n[2]+' (નમૂના)',summary:n[3],body:body(n),category_id:C(n[0]),district_id:t?.district_id??null,taluka_id:t?.id??null,author_id:(reps[i%Math.max(reps.length,1)]||adm).id,status:'published',published_at:new Date(Date.now()-i*5400000).toISOString(),is_breaking:i<4,is_featured:i===0||i===5,views:Math.floor(Math.random()*900),thumbnail_url:`/demo/${n[4]}.svg`}});
const {error}=await sb.from('news').insert(rows);console.log(error?error.message:`✅ ${rows.length} નમૂના સમાચાર ઉમેર્યા`);
writeFileSync('reporters-credentials.txt',lines.join('\n'));console.log(lines.join('\n'),'\n(ફાઇલ: reporters-credentials.txt – કોઈને શેર/commit ન કરો)');
