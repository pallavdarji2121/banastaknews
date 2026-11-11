# બનાસ તક – Next.js + Supabase
1. `npm i` · copy `.env.example` → `.env.local` and fill the 3 Supabase values (service role key is server-only).
2. Supabase → SQL editor → run `supabase/schema.sql`.
3. **First Super Admin (no password in code):** Supabase → Authentication → Add user (your email + strong password). Then SQL:
   `insert into profiles(id,role,full_name) select id,'admin','Super Admin' from auth.users where email='YOUR_EMAIL';`
4. `npm run dev` → `/admin` login → create reporters (reporter1, reporter2…). Reporter login: `/report` → redirected to `/reporter/reporter1`.
5. Flow: reporter submits → pending → admin approves/rejects (reason) → public site. Trusted reporter: toggle "સીધું પ્રકાશન".
6. Deploy (Vercel) on banastak.com; set the same env vars + NEXT_PUBLIC_SITE_URL.
## Not done yet
Rich-text editor, gallery/video upload UI, village directory import, analytics charts/CSV, ads, sitemap/robots, notifications UI, stock/cricket API adapters, e-paper.
Note: this code was written without running `npm install`/build; run `npm run build` and fix any type issue first.

## v2 additions
- New premium UI (hero, numbered latest, most-read, district chips, market strip, ticker, mobile bottom nav, dark mode).
- `/video`, `/market`, `/cricket` pages. API keys go in `.env.local`: STOCK_API_KEY (twelvedata.com), CRICKET_API_KEY (cricketdata.org). Without keys the site shows "ડેટા ઉપલબ્ધ નથી" – never fake data.
- Index symbols (NIFTY/SENSEX) depend on your Twelve Data plan; edit MARKET_SYMBOLS if a symbol returns an error.
- Optional demo content: run `supabase/seed_demo.sql` once (after creating the admin).

## v3
- Already ran older schema? Run `supabase/patch_v3.sql` once (lets the seed script insert).
- `npm run seed` (Node 20.6+) → 5 sample reporters (random passwords saved in `reporters-credentials.txt`, gitignored) + 24 sample news with demo covers.
- NEVER commit `.env.local`. `.gitignore` is included now.

## v4 (run in this order)
1. Supabase SQL editor: (old DB) run `supabase/patch_v3.sql` then `supabase/patch_v4.sql`. New DB: `schema.sql` + `patch_v4.sql`.
2. `.env.local`: MARKET_PROVIDER=yahoo (default, no key; unofficial/delayed) or twelvedata. CRICKET_API_KEY from cricketdata.org. Restart dev server after editing.
3. `npm i` → `npm run seed` → `npm run dev`. Admin → "API સ્થિતિ" shows exact API errors.
4. Admin sidebar: Dashboard, News, Reporters, Categories, Locations, Site Settings (name, logo, contact, socials, ticker, footer, pages, section toggles), API status.

## v5 (IMPORTANT order)
1. Supabase → SQL editor → run `supabase/patch_v5.sql` (new tables: members, bookmarks, epapers, reels, rashifal; sections, nav; PDF uploads).
2. Supabase → Authentication → Sign In / Providers: turn ON "Allow new users to sign up" (needed for reader signup). Optional: turn OFF "Confirm email" for instant login.
3. Env (optional): CRON_SECRET (rashifal daily sync on Vercel), MARKET_PROVIDER, CRICKET_API_KEY.
4. New: user login/signup/profile (/login, /me), bookmarks, e-paper (/epaper), reels (/reels), rashifal (/rashifal), gold (/gold), multi-section publishing, admin Users/Reels/E-paper/Rashifal, sitemap/robots/PWA manifest.

## v6
- Menu: all categories + વિડિયો/રીલ/રાશિફળ in ONE scrollable line (‹ › arrows); ઈ-પેપર next to WhatsApp in the top bar. Works even before patch_v5 (falls back to all categories).
- Site opens in LIGHT mode by default; ☀️ લાઇટ / 🌙 ડાર્ક switch in top bar (choice remembered).
- Home: weather (Open-Meteo, no key), e-paper promo with download, rashifal chips, reels row.
- Still REQUIRED: run `supabase/patch_v5.sql` once (login, e-paper, reels, multi-section tables).

## v7 – Rashifal in Gujarati, automatic
English horoscope API -> Gujarati (MyMemory free, or Google Translation if GOOGLE_TRANSLATE_KEY). Auto: first visit of /rashifal each day fetches it; on Vercel a daily cron (00:30 IST) too. Admin text (manual) is never overwritten. Admin -> રાશિફળ shows exact error if a fetch fails.

## v8
UI polish (animations, skeleton loading, glass nav, active sidebar item), Ctrl+K live search, article tools (progress bar, listen in Gujarati, A−/A+, print, reading time), friendly 404/error pages, back-to-top, session refresh middleware on all pages.
Checklist: SQL order patch_v3 -> patch_v4 -> patch_v5; Auth: sign-ups ON; `npm i`; `npm run seed`; `npm run dev`.

## v9
- NEW SQL: run `supabase/patch_v9.sql` once (polls, reactions, tips).
- Fonts: Hind Vadodara (body) + Rasa (headlines). Mobile: app-style header with ☰ drawer menu + chip nav.
- New: daily poll, article reactions, citizen news form (/mokalo) + admin Polls/Tips pages, taluka "stories" row on mobile.

## v10
Stock search + detail (price, today change, day range, 52w range, 1W/1M/6M/1Y performance, charts, watchlist), top gainers/losers (Yahoo Finance, unofficial/delayed). Diwali popup + banner (admin -> Website Settings, auto-off after end date) and greeting-card maker (/shubhechha).

## v11
SQL: run supabase/patch_v11.sql (jobs, mandi_rates). New: pretty Diwali card with logo, diya-lighting (Happy Diwali to your family), Mandi bhav (/mandi, admin enters daily), taluka weather + farmer advice (/havaman, Open-Meteo), jobs board (/jobs).

## v12 (no new SQL needed)
- **Diwali card redesigned**: clean layout, big diya, logo badge on top, 4 colour themes (red / blue / saffron / green). No website text on the card. WhatsApp share button.
- **Diya**: tap any diya to light it → "Happy Diwali to your family!". "Light all" button; when all 5 are lit a button leads to the card maker.
- **NEW /frame – Diwali photo frame**: user picks a photo, zoom/move, adds family name → round gold frame with logo → download / WhatsApp status. Runs fully on the phone (nothing uploaded).
- **NEW /panchang – Choghadiya, Rahukaal, Gulika, Yamaganda, Abhijit** for the chosen taluka, calculated from real sunrise/sunset (Open-Meteo). Live "current choghadiya" box.
- **NEW /radio – Banas Radio**: phone reads the latest 15 news aloud in Gujarati (browser text-to-speech, play/pause/next, speed 0.8x–1.25x). Best in Chrome on Android.
- Home page: 4 quick tiles (frame, card, panchang, radio); menus/footer/sitemap updated.

## v13 – speed
- Shared data (categories, talukas, site settings, home news, e-paper/reels/mandi) is cached on the server (lib/cache.ts) and refreshed automatically after any admin/reporter save (lib/rv.ts). Home news refreshes at most every 45 s.
- Visitors without a login cookie skip the Supabase auth call completely (middleware, getMember, me()).
- Header/Footer queries run in parallel; slow external APIs (Yahoo, cricket, weather) time out after 3 s instead of blocking the page.
- Photos are compressed in the browser before upload (max 1600px JPEG) – app/ImgCompress.tsx.
- Instant skeleton screens in admin and reporter panels (loading.tsx).
- `npm run dev` now uses Turbopack. For real speed use: `npm run build` then `npm start` (dev mode is always slower).
- Tip: Supabase project region should be Mumbai (ap-south-1); a far region adds 200–400 ms to every query.

## v14 – 4 new news features  (RUN supabase/patch_v14.sql once in Supabase SQL editor)
- **🔍 /afwah – અફવા ચેક**: readers send a viral WhatsApp message; admin (Admin → અફવા ચેક) writes a verdict (ખોટું / ભ્રામક / સાચું …) + explanation → public verdict cards with WhatsApp share. Reader messages stay hidden until published. Honeypot + 5/day per device limit.
- **⏳ /vachan – વચન ટ્રેકર**: promises by leaders/government/panchayat with deadline countdown ("12 દિવસ બાકી" / "5 દિવસ મોડું"), work-progress bar vs time-elapsed bar and dated updates. Admin → વચન ટ્રેકર.
- **📰 /maru-akhbar – મારું અખબાર**: reader picks talukas + topics + own name → a personal newspaper page (masthead, lead story, columns). Remembered on the phone; Print / Save as PDF and WhatsApp share. No database needed.
- **⚡ /stories – સ્ટોરીઝ**: Instagram-style full-screen news stories (auto-advance, tap left/right, hold to pause, swipe down to close). Story circles also appear at the top of the home page. No database needed.

## v15
- "દીવો પ્રગટાવો" (DiyaSet) now appears ONLY inside the festival pop-up – removed from the home page and the card page.
- Mobile home: the round taluka circles are replaced by the Stories row (tap a circle → /stories). Taluka filter chips are still available in the news section.

## v16 – cleaner landing page
- Removed the 8 coloured service cards from the home page. Home now = Stories row (mobile + desktop) → trending → news.
- New **✨ સેવાઓ** dropdown in the desktop menu and **✨ સેવાઓ** chip on mobile, plus the full hub page **/seva** (grouped cards: news experiences, daily services, festival). All services are defined once in lib/services.ts.

## v17
- Removed all Diwali-only items: pop-up, diya, greeting-card page (/shubhechha now redirects to /frame) and the festival panel in Admin → Settings.
- **🖼 /frame – ફેસ્ટિવલ ફોટો ફ્રેમ**: 32 festivals/occasions (ઉત્તરાયણ … ક્રિસમસ, જન્મદિવસ, શુભ સવાર), round/square frame, own message. Add a festival = one line in lib/festivals.ts. Link a festival directly: /frame?f=holi
- **🌅 Home "આજનો દિવસ" widget** (daily thought + 3 daily habits + 🔥 streak, stored on the phone) and **/suvichar** – daily thought card maker for WhatsApp status (lib/thoughts.ts).
- **🧮 /kamai** – farmer earnings calculator from mandi rates (which market pays most). **🕰 /archive** – news time-machine: pick any date.
- New premium footer (lib/FooterView.tsx): WhatsApp CTA band, grouped links, social icons, back-to-top, developer credit.

## v18
- Home page: the "આજનો દિવસ" card removed from the landing page – it now lives on **/seva** (top).
- NEW **once-a-day pop-up "આજની ખાસ ઝલક"** (app/BriefPopup.tsx): top 5 news (breaking first), latest રુમર checks (અફવા ચેક) and overdue promises (વચન ટ્રેકર) + quick buttons (Stories / Radio / Services). Shows only on the plain home page, once per day per phone, after ~2 s; hidden automatically when there is nothing to show.
- UI polish: gradient buttons with soft shadow, input focus glow, scroll-progress line at the top (app/ReadBar.tsx), reduced-motion support.
