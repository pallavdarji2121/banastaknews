-- v14: અફવા ચેક (factchecks) + વચન ટ્રેકર (promises)  (safe to re-run)
create table if not exists factchecks(
  id serial primary key,
  claim text not null,
  verdict text not null default 'checking',   -- checking | true | false | misleading | unverified
  explanation text,
  source_url text,
  news_slug text,
  status text not null default 'pending',     -- pending (reader sent) | published
  submitter text,
  phone text,
  created_at timestamptz default now(),
  published_at timestamptz
);
create table if not exists promises(
  id serial primary key,
  title text not null,
  by_whom text,
  place text,
  promised_on date,
  deadline date,
  status text not null default 'pending',     -- pending | progress | done | broken
  progress int not null default 0,
  source_url text,
  news_slug text,
  updates jsonb not null default '[]'::jsonb, -- [{"d":"2026-11-08","t":"..."}]
  done_on date,
  active bool not null default true,
  created_at timestamptz default now()
);
create index if not exists factchecks_pub_idx on factchecks(status,published_at desc);
create index if not exists promises_active_idx on promises(active,deadline);
alter table factchecks enable row level security;
alter table promises enable row level security;
drop policy if exists fc_r on factchecks; drop policy if exists fc_w on factchecks;
drop policy if exists pr_r on promises;   drop policy if exists pr_w on promises;
create policy fc_r on factchecks for select using(status='published');
create policy fc_w on factchecks for all using(is_admin()) with check(is_admin());
create policy pr_r on promises for select using(active);
create policy pr_w on promises for all using(is_admin()) with check(is_admin());

-- નમૂના (sample) rows – delete them from the admin panel anytime
insert into factchecks(claim,verdict,explanation,status,published_at)
select 'આ મેસેજ 10 ગ્રુપમાં ફોરવર્ડ કરો તો ફ્રી રિચાર્જ / ઇનામ મળશે (નમૂના)','false',
 'આવા ચેઇન મેસેજ ફોરવર્ડ કરાવવા માટે જ બને છે. કોઈ કંપની ફોરવર્ડ ગણીને ઇનામ આપતી નથી. લિંક ખોલવી નહીં અને કોઈ માહિતી આપવી નહીં.','published',now()
where not exists(select 1 from factchecks);
insert into promises(title,by_whom,place,promised_on,deadline,status,progress,updates)
select 'ગામના મુખ્ય રસ્તાનું સમારકામ (નમૂના)','ગ્રામ પંચાયત (નમૂના)','નમૂના ગામ',current_date-60,current_date+30,'progress',40,
 jsonb_build_array(jsonb_build_object('d',to_char(current_date-10,'YYYY-MM-DD'),'t','કામ શરૂ થયું, અડધો રસ્તો ખોદાયો (નમૂના)'))
where not exists(select 1 from promises);
