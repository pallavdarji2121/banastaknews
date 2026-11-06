-- v9: polls, reactions, citizen tips (safe to re-run)
create table if not exists polls(id serial primary key,question text not null,options text[] not null,active bool default true,created_at timestamptz default now());
create table if not exists poll_votes(poll_id int references polls on delete cascade,voter text not null,choice int not null,created_at timestamptz default now(),primary key(poll_id,voter));
create table if not exists reactions(news_id uuid references news on delete cascade,voter text not null,kind text not null,created_at timestamptz default now(),primary key(news_id,voter));
create table if not exists tips(id uuid primary key default gen_random_uuid(),name text,phone text,village text,text text not null,photo_url text,status text default 'new',created_at timestamptz default now());
alter table polls enable row level security;alter table poll_votes enable row level security;alter table reactions enable row level security;alter table tips enable row level security;
drop policy if exists polls_r on polls;drop policy if exists polls_w on polls;drop policy if exists tips_a on tips;
create policy polls_r on polls for select using(true);create policy polls_w on polls for all using(is_admin()) with check(is_admin());
create policy tips_a on tips for all using(is_admin()) with check(is_admin());
insert into polls(question,options) select 'તમારા ગામમાં સૌથી મોટી સમસ્યા કઈ છે? (નમૂના)',array['પાણી','રસ્તા','વીજળી','આરોગ્ય'] where not exists(select 1 from polls);
