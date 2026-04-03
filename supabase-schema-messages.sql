-- ============================================================
-- LOYAGO App – Schema v3: Chat-Nachrichten
-- Ausführen im Supabase SQL Editor
-- ============================================================

create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Nutzer sieht eigene Nachrichten"
  on messages for select
  using (auth.uid() = user_id);

create policy "Nutzer kann Nachrichten senden"
  on messages for insert
  with check (auth.uid() = user_id);
