-- Budgy — which scraped account feeds which category.
--
-- "kind" is the scraper's stable name for a product (current, securities,
-- deposit...), not the bank's account number, so a renamed or re-opened
-- account keeps working without remapping.
--
-- Already applied (migration: bank_account_map). Idempotent — safe to re-run.

create table if not exists public.bank_account_map (
  user_id        uuid not null references auth.users (id) on delete cascade,
  institution_id text not null,
  kind           text not null,
  category_key   text not null,
  updated_at     timestamptz not null default now(),
  primary key (user_id, institution_id, kind)
);

alter table public.bank_account_map enable row level security;

-- Same sharing model as monthly_records: the owner, plus their partners.
drop policy if exists "Users manage own account map" on public.bank_account_map;
create policy "Users manage own account map"
  on public.bank_account_map
  for all
  using (
    auth.uid() = user_id
    or auth.uid() in (
      select partnerships.partner_id
      from partnerships
      where partnerships.owner_id = bank_account_map.user_id
    )
  );
