-- v19: APMC auto-sync (safe to re-run). Adds optional columns used to keep the APMC row order and the English crop name.
alter table mandi_rates add column if not exists sort int default 0;
alter table mandi_rates add column if not exists crop_en text;
