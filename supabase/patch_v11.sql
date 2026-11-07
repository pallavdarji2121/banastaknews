-- v11: jobs board + mandi (market yard) rates (safe to re-run)
create table if not exists jobs(id serial primary key,title text not null,company text,place text,salary text,phone text not null,details text,active bool default true,created_at timestamptz default now());
create table if not exists mandi_rates(id serial primary key,day date not null,market text not null,crop text not null,min_p int,max_p int,unique(day,market,crop));
alter table jobs enable row level security;alter table mandi_rates enable row level security;
drop policy if exists jobs_r on jobs;drop policy if exists jobs_w on jobs;drop policy if exists mandi_r on mandi_rates;drop policy if exists mandi_w on mandi_rates;
create policy jobs_r on jobs for select using(active or is_admin());create policy jobs_w on jobs for all using(is_admin()) with check(is_admin());
create policy mandi_r on mandi_rates for select using(true);create policy mandi_w on mandi_rates for all using(is_admin()) with check(is_admin());
