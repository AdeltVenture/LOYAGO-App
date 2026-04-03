-- ============================================================
-- LOYAGO App – Supabase Schema
-- Ausführen im Supabase SQL Editor
-- ============================================================

-- 1. Betreuungswünsche (care requests)
create table if not exists care_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text,
  street        text,
  zip           text,
  city          text,
  insurers      text[],
  consent_given boolean default false,
  status        text default 'pending',  -- pending | processing | confirmed
  created_at    timestamptz default now()
);

-- Row Level Security: Nutzer sieht nur eigene Anfragen
alter table care_requests enable row level security;

create policy "Nutzer kann eigene Anfragen lesen"
  on care_requests for select
  using (auth.uid() = user_id);

create policy "Nutzer kann Anfragen erstellen"
  on care_requests for insert
  with check (auth.uid() = user_id or user_id is null);


-- 2. Benutzerprofile (optional, für spätere Erweiterung)
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  first_name    text,
  last_name     text,
  title         text,
  phone         text,
  street        text,
  zip           text,
  city          text,
  updated_at    timestamptz default now()
);

alter table profiles enable row level security;

create policy "Nutzer kann eigenes Profil lesen"
  on profiles for select
  using (auth.uid() = id);

create policy "Nutzer kann eigenes Profil aktualisieren"
  on profiles for update
  using (auth.uid() = id);

-- Profil automatisch anlegen bei Registrierung
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ============================================================
-- Demo-Nutzer anlegen (im Supabase Dashboard unter Auth > Users)
-- E-Mail: marco.adelt@gmx.de
-- Passwort: Test123
-- ============================================================
