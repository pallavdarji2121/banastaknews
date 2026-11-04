-- Run once if you already ran an older schema.sql
create or replace function news_guard() returns trigger language plpgsql security definer set search_path=public as $$
declare p profiles;
begin
 if auth.uid() is null or is_admin() then new.updated_at=now();return new;end if;
 select * into p from profiles where id=auth.uid();
 if p.id is null or not p.active then raise exception 'inactive account';end if;
 if tg_op='INSERT' then new.author_id:=auth.uid();new.is_breaking:=false;new.is_featured:=false;new.reject_reason:=null;
 else new.author_id:=old.author_id;new.is_breaking:=old.is_breaking;new.is_featured:=old.is_featured;new.reject_reason:=old.reject_reason;end if;
 if new.status in('approved','scheduled','archived') then new.status:='pending';end if;
 if new.status='published' and not p.can_publish then new.status:='pending';end if;
 if new.status='published' and new.published_at is null then new.published_at:=now();end if;
 new.updated_at:=now();return new;
end $$;
