-- Budgy — mortgage snapshots.
-- One row per scrape: the outstanding balance, the per-route breakdown, and
-- the raw payload it was read from (so a field rename at the bank can be
-- re-parsed after the fact instead of losing the month).
--
-- Already applied to the project (migration: create_mortgage_snapshots).
-- Kept here so the schema is reproducible from the repo; it is idempotent,
-- so re-running it in the SQL editor is harmless.

create table if not exists public.mortgage_snapshots (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  snapshot_date   date not null default current_date,
  institution_id  text,
  -- Principal outstanding. This is the series Budgy tracks and charts; the
  -- two figures below are context only and never feed the month-over-month
  -- delta, or the chart would jump.
  balance         numeric not null,
  payoff_balance  numeric,  -- principal + accrued interest
  early_repayment_fees numeric,  -- penalty if settled on the snapshot date
  routes          jsonb not null default '[]'::jsonb,
  confidence      text,
  source          jsonb,   -- which endpoint / path the number came from
  raw             jsonb,   -- redacted original response
  created_at      timestamptz not null default now(),
  unique (user_id, snapshot_date)
);

create index if not exists mortgage_snapshots_user_date_idx
  on public.mortgage_snapshots (user_id, snapshot_date desc);

alter table public.mortgage_snapshots enable row level security;

-- Same sharing model as monthly_records: the owner, plus anyone they have
-- added as a partner.
drop policy if exists "Users manage own mortgage snapshots" on public.mortgage_snapshots;
create policy "Users manage own mortgage snapshots"
  on public.mortgage_snapshots
  for all
  using (
    auth.uid() = user_id
    or auth.uid() in (
      select partnerships.partner_id
      from partnerships
      where partnerships.owner_id = mortgage_snapshots.user_id
    )
  );
