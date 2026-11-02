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
