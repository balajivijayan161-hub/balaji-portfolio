-- Visitor sign-in log for the portfolio.
-- Paste this whole file into the Supabase SQL editor and run it.
-- Safe to run again: objects are replaced or created only if missing.
--
-- The admin email lives in public.admin_email(). Row Level Security uses that
-- function. Do not rely on a frontend check alone.
-- Use the anon public key in the site. Never put the service_role key in VITE_ env vars.

create or replace function public.admin_email()
returns text
language sql
immutable
as $$
  select 'balajivijayan161@gmail.com'::text;
$$;

comment on function public.admin_email() is
  'Email allowed to read the visitor list. Change the return value here, then run this function again.';

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower(public.admin_email())
    and (
      coalesce((auth.jwt() -> 'email_verified') = 'true'::jsonb, false)
      or lower(coalesce(auth.jwt() ->> 'email_verified', '')) = 'true'
      or nullif(btrim(coalesce(auth.jwt() ->> 'email_confirmed_at', '')), '') is not null
    );
$$;

comment on function public.current_user_is_admin() is
  'True only when the JWT email matches public.admin_email() and the email is verified (email_verified true, or email_confirmed_at set).';

create table if not exists public.visitor_logins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  provider text,
  signed_in_at timestamptz not null default now()
);

comment on table public.visitor_logins is
  'One row per sign-in. Name, email, and time come from the auth JWT, not from arbitrary client fields.';

create index if not exists visitor_logins_user_id_idx
  on public.visitor_logins (user_id);

create index if not exists visitor_logins_signed_in_at_idx
  on public.visitor_logins (signed_in_at desc);

create or replace function public.enforce_visitor_login_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  claims jsonb := coalesce(auth.jwt(), '{}'::jsonb);
  meta jsonb := coalesce(claims -> 'user_metadata', '{}'::jsonb);
  app_meta jsonb := coalesce(claims -> 'app_metadata', '{}'::jsonb);
  v_email text := nullif(claims ->> 'email', '');
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  new.user_id := auth.uid();

  -- One stored sign-in per user per 10 minutes, including direct inserts.
  -- security definer so this check can see the caller's earlier rows under RLS.
  if exists (
    select 1
    from public.visitor_logins
    where user_id = new.user_id
      and signed_in_at > now() - interval '10 minutes'
  ) then
    return null;
  end if;

  new.email := v_email;
  new.signed_in_at := now();
  new.name := coalesce(
    nullif(meta ->> 'full_name', ''),
    nullif(meta ->> 'name', ''),
    nullif(split_part(coalesce(v_email, ''), '@', 1), '')
  );
  new.avatar_url := coalesce(
    nullif(meta ->> 'avatar_url', ''),
    nullif(meta ->> 'picture', '')
  );
  new.provider := coalesce(nullif(app_meta ->> 'provider', ''), 'email');
  return new;
end;
$$;

drop trigger if exists visitor_logins_enforce_owner on public.visitor_logins;

create trigger visitor_logins_enforce_owner
  before insert on public.visitor_logins
  for each row
  execute function public.enforce_visitor_login_owner();

create or replace function public.log_visit()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if exists (
    select 1
    from public.visitor_logins
    where user_id = auth.uid()
      and signed_in_at > now() - interval '10 minutes'
  ) then
    return;
  end if;

  insert into public.visitor_logins (user_id)
  values (auth.uid());
end;
$$;

comment on function public.log_visit() is
  'Inserts at most one sign-in row per user every 10 minutes. The before-insert trigger fills name, email, provider, and time from the JWT and enforces the same limit on direct inserts.';

revoke all on function public.admin_email() from public;
revoke all on function public.current_user_is_admin() from public;
revoke all on function public.log_visit() from public;
revoke all on function public.enforce_visitor_login_owner() from public;

grant execute on function public.admin_email() to authenticated;
grant execute on function public.current_user_is_admin() to anon, authenticated;
grant execute on function public.log_visit() to authenticated;
grant execute on function public.enforce_visitor_login_owner() to authenticated;

alter table public.visitor_logins enable row level security;

revoke all on table public.visitor_logins from anon, public;
grant insert, select on table public.visitor_logins to authenticated;

drop policy if exists visitor_logins_insert_own on public.visitor_logins;
drop policy if exists visitor_logins_select_admin on public.visitor_logins;

create policy visitor_logins_insert_own
  on public.visitor_logins
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy visitor_logins_select_admin
  on public.visitor_logins
  for select
  to authenticated
  using (public.current_user_is_admin());

-- One row per person: latest profile fields, first seen, last seen, login count.
-- security_invoker makes the view obey visitor_logins RLS instead of bypassing it.
create or replace view public.visitor_summary
with (security_invoker = true) as
select distinct on (l.user_id)
  l.user_id,
  l.name,
  l.email,
  l.avatar_url,
  l.provider,
  s.first_seen,
  l.signed_in_at as last_seen,
  s.login_count
from public.visitor_logins as l
join (
  select
    user_id,
    min(signed_in_at) as first_seen,
    count(*)::integer as login_count
  from public.visitor_logins
  group by user_id
) as s on s.user_id = l.user_id
order by l.user_id, l.signed_in_at desc;

comment on view public.visitor_summary is
  'Per-user summary of visitor_logins. Readable only when visitor_logins RLS allows the rows (the admin email).';

revoke all on table public.visitor_summary from anon, public;
grant select on table public.visitor_summary to authenticated;
