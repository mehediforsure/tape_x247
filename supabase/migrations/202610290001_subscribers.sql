create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'unsubscribed'))
);

create unique index if not exists subscribers_email_unique on public.subscribers (lower(btrim(email)));
alter table public.subscribers enable row level security;
alter table public.subscribers force row level security;
revoke all on table public.subscribers from anon, authenticated;
grant insert on table public.subscribers to service_role;

create table if not exists public.subscription_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0)
);
alter table public.subscription_rate_limits enable row level security;
alter table public.subscription_rate_limits force row level security;
revoke all on table public.subscription_rate_limits from anon, authenticated;
grant select, insert, update, delete on table public.subscription_rate_limits to service_role;
