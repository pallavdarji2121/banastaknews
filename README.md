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
