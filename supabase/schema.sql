-- BANAS TAK schema + RLS. Run in Supabase SQL editor.
create extension if not exists pgcrypto;
create type role_t as enum('admin','reporter');
create type news_status as enum('draft','pending','approved','published','rejected','scheduled','archived');
create table districts(id serial primary key,name text unique not null);
create table talukas(id serial primary key,district_id int not null references districts on delete cascade,name text not null,unique(district_id,name));
create table villages(id serial primary key,taluka_id int not null references talukas on delete cascade,name text not null,unique(taluka_id,name));
create table categories(id serial primary key,name text unique not null,sort int default 0,active bool default true);
create sequence reporter_seq;
create table profiles(id uuid primary key references auth.users on delete cascade,role role_t not null default 'reporter',reporter_code text unique,full_name text,mobile text,district_id int references districts,taluka_id int references talukas,active bool not null default true,can_publish bool not null default false,created_at timestamptz default now());
create table news(id uuid primary key default gen_random_uuid(),slug text unique not null,title text not null,summary text,body text not null,category_id int references categories,district_id int references districts,taluka_id int references talukas,village_id int references villages,author_id uuid not null references profiles,status news_status not null default 'draft',is_breaking bool default false,is_featured bool default false,breaking_requested bool default false,reject_reason text,thumbnail_url text,video_url text,views int default 0,published_at timestamptz,deleted_at timestamptz,created_at timestamptz default now(),updated_at timestamptz default now());
create index on news(status,published_at desc);create index on news(district_id,taluka_id,village_id);create index on news(category_id);create index on news(author_id);
create table notifications(id bigserial primary key,to_user uuid references profiles,to_admin bool default false,title text,ref_id uuid,read bool default false,created_at timestamptz default now());
create table activity_logs(id bigserial primary key,actor_id uuid,action text,ref_id uuid,created_at timestamptz default now());
create table website_settings(key text primary key,value jsonb);
create function next_reporter_code() returns text language sql as $$select 'reporter'||nextval('reporter_seq')$$;
revoke execute on function next_reporter_code() from public,anon,authenticated;
create function is_admin() returns bool language sql stable security definer set search_path=public as $$select exists(select 1 from profiles where id=auth.uid() and role='admin' and active)$$;
create function news_guard() returns trigger language plpgsql security definer set search_path=public as $$
declare p profiles;
begin
 if is_admin() then new.updated_at=now();return new;end if;
 select * into p from profiles where id=auth.uid();
 if p.id is null or not p.active then raise exception 'inactive account';end if;
 if tg_op='INSERT' then new.author_id:=auth.uid();new.is_breaking:=false;new.is_featured:=false;new.reject_reason:=null;
 else new.author_id:=old.author_id;new.is_breaking:=old.is_breaking;new.is_featured:=old.is_featured;new.reject_reason:=old.reject_reason;end if;
 if new.status in('approved','scheduled','archived') then new.status:='pending';end if;
 if new.status='published' and not p.can_publish then new.status:='pending';end if;
 if new.status='published' and new.published_at is null then new.published_at:=now();end if;
 new.updated_at:=now();return new;
end $$;
create trigger news_guard before insert or update on news for each row execute function news_guard();
alter table districts enable row level security;alter table talukas enable row level security;alter table villages enable row level security;alter table categories enable row level security;
alter table profiles enable row level security;alter table news enable row level security;alter table notifications enable row level security;alter table activity_logs enable row level security;alter table website_settings enable row level security;
create policy geo_r on districts for select using(true);create policy geo_w on districts for all using(is_admin()) with check(is_admin());
create policy geo_r on talukas for select using(true);create policy geo_w on talukas for all using(is_admin()) with check(is_admin());
create policy geo_r on villages for select using(true);create policy geo_w on villages for all using(is_admin()) with check(is_admin());
create policy cat_r on categories for select using(true);create policy cat_w on categories for all using(is_admin()) with check(is_admin());
create policy set_r on website_settings for select using(true);create policy set_w on website_settings for all using(is_admin()) with check(is_admin());
create policy prof_r on profiles for select using(id=auth.uid() or is_admin());
create policy prof_w on profiles for all using(is_admin()) with check(is_admin()); -- reporters cannot edit own role/permissions
create policy news_pub on news for select using(status='published' and deleted_at is null and published_at<=now());
create policy news_own on news for select using(author_id=auth.uid());
create policy news_adm on news for all using(is_admin()) with check(is_admin());
create policy news_ins on news for insert with check(author_id=auth.uid() and status in('draft','pending','published'));
create policy news_upd on news for update using(author_id=auth.uid() and status in('draft','rejected')) with check(author_id=auth.uid());
create policy nt_r on notifications for select using(to_user=auth.uid() or (to_admin and is_admin()));
create policy nt_i on notifications for insert with check(auth.uid() is not null);
create policy nt_u on notifications for update using(to_user=auth.uid() or (to_admin and is_admin()));
create policy log_i on activity_logs for insert with check(actor_id=auth.uid());create policy log_r on activity_logs for select using(is_admin());
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('media','media',true,52428800,array['image/jpeg','image/png','image/webp','video/mp4']) on conflict do nothing;
create policy media_r on storage.objects for select using(bucket_id='media');
create policy media_w on storage.objects for insert to authenticated with check(bucket_id='media' and (storage.foldername(name))[1]=auth.uid()::text);
-- Seed (VERIFY official talukas/villages before launch; add villages from admin)
insert into districts(name) values('બનાસકાંઠા'),('વાવ-થરાદ');
insert into talukas(district_id,name) select 1,n from unnest(array['પાલનપુર','ડીસા','વડગામ','દાંતા','ધાનેરા','દાંતીવાડા','અમીરગઢ','કાંકરેજ','હડાદ','ઓગડ']) n;
insert into talukas(district_id,name) select 2,n from unnest(array['વાવ','થરાદ','સુઈગામ','ભાભર','દિયોદર','લાખણી','રાહ','ધરણિધર']) n;
insert into categories(name,sort) select n,row_number() over() from unnest(array['સ્થાનિક','ગુજરાત','દેશ','વિશ્વ','રાજકારણ','બિઝનેસ','શેરબજાર','ક્રિકેટ','રમતગમત','મનોરંજન','ટેકનોલોજી','શિક્ષણ','રોજગાર','કૃષિ','આરોગ્ય','ધાર્મિક','અકસ્માત અને ગુનાખોરી','વિડિયો']) n;
