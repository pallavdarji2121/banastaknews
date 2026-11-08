// All extra services of the site in ONE place: used by the header "✨ સેવાઓ" menu and the /seva page.
export type Sv={i:string,t:string,d:string,h:string,c:string};
export const NEWS_SV:Sv[]=[
  {i:'⚡',t:'સ્ટોરીઝ',d:'30 સેકન્ડમાં સમાચાર',h:'/stories',c:'from-fuchsia-500 to-pink-700'},
  {i:'🔍',t:'અફવા ચેક',d:'વાયરલ મેસેજ સાચો કે ખોટો?',h:'/afwah',c:'from-sky-500 to-blue-700'},
  {i:'⏳',t:'વચન ટ્રેકર',d:'વચન પાળ્યું કે નહીં?',h:'/vachan',c:'from-yellow-500 to-amber-700'},
  {i:'📰',t:'મારું અખબાર',d:'તમારું પોતાનું છાપું',h:'/maru-akhbar',c:'from-slate-600 to-neutral-900'},
  {i:'📻',t:'બનાસ રેડિયો',d:'સમાચાર સાંભળો',h:'/radio',c:'from-emerald-500 to-teal-700'},
];
export const DAILY_SV:Sv[]=[
  {i:'🕉',t:'પંચાંગ અને ચોઘડિયા',d:'અત્યારનો શુભ સમય',h:'/panchang',c:'from-indigo-500 to-violet-700'},
  {i:'🌦',t:'હવામાન',d:'તાલુકા મુજબ આગાહી',h:'/havaman',c:'from-cyan-500 to-blue-600'},
  {i:'🌾',t:'માર્કેટયાર્ડ ભાવ',d:'આજના ભાવ',h:'/mandi',c:'from-lime-500 to-green-700'},
  {i:'💼',t:'જોબ્સ',d:'નોકરીની તકો',h:'/jobs',c:'from-orange-500 to-red'},
  {i:'🔮',t:'રાશિફળ',d:'આજનું રાશિફળ',h:'/rashifal',c:'from-purple-500 to-fuchsia-700'},
  {i:'🪙',t:'ગોલ્ડ ભાવ',d:'સોના-ચાંદીના ભાવ',h:'/gold',c:'from-amber-400 to-yellow-700'},
  {i:'📈',t:'શેરબજાર',d:'સેન્સેક્સ, નિફ્ટી',h:'/market',c:'from-green-500 to-emerald-800'},
  {i:'🏏',t:'ક્રિકેટ સ્કોર',d:'લાઇવ સ્કોર',h:'/cricket',c:'from-blue-500 to-indigo-800'},
];
export const FEST_SV:Sv[]=[
  {i:'🖼',t:'ફોટો ફ્રેમ',d:'તમારા ફોટા સાથે દિવાળી DP',h:'/frame',c:'from-rose-500 to-red'},
  {i:'🎁',t:'શુભેચ્છા કાર્ડ',d:'નામ સાથે કાર્ડ બનાવો',h:'/shubhechha',c:'from-amber-500 to-orange-600'},
];
export const MENU_SV:Sv[]=[...NEWS_SV,DAILY_SV[0],...FEST_SV];
