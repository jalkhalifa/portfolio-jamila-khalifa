create table if not exists public.portfolio_leads (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 name text not null,
 email text not null,
 answers jsonb not null,
 recommendation text not null,
 consent boolean not null check (consent = true),
 consent_version text not null
);
alter table public.portfolio_leads enable row level security;
revoke all on public.portfolio_leads from anon, authenticated;
grant insert on public.portfolio_leads to service_role;
