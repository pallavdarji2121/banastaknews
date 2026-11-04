-- Run once in Supabase SQL editor (safe to re-run)
alter table news add column if not exists gallery text[] default '{}';
