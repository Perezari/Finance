-- Budgy — everything an institution reported in one visit.
--
-- `accounts` holds the balances that land on cards; `details` holds the rest —
-- credit limits, the securities split, upcoming card charges — which the bank
-- detail screen is built from. One row per institution per day.
--
-- Already applied (migration: bank_snapshots). Idempotent — safe to re-run.

create table if not exists public.bank_snapshots (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  institution_id text not null,
  snapshot_date  date not null default current_date,
  accounts       jsonb not null default '[]'::jsonb,
  details        jsonb,
  created_at     timestamptz not null default now(),
  unique (user_id, institution_id, snapshot_date)
);

create index if not exists bank_snapshots_user_inst_date_idx
  on public.bank_snapshots (user_id, institution_id, snapshot_date desc);

alter table public.bank_snapshots enable row level security;

drop policy if exists "Users manage own bank snapshots" on public.bank_snapshots;
create policy "Users manage own bank snapshots"
  on public.bank_snapshots
  for all
  using (
    auth.uid() = user_id
    or auth.uid() in (
      select partnerships.partner_id
      from partnerships
      where partnerships.owner_id = bank_snapshots.user_id
    )
  );
