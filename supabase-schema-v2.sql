-- ============================================================
-- LOYAGO App – Schema v2: Kundenprofil & Verträge
-- Ausführen im Supabase SQL Editor
-- ============================================================


-- ── 1. PROFILES (erweitern) ───────────────────────────────
alter table profiles
  add column if not exists title      text,
  add column if not exists score      int default 75,
  add column if not exists created_at timestamptz default now();

-- Marcos Profil befüllen (UUID aus auth.users holen)
update profiles
set
  first_name = 'Marco',
  last_name  = 'Adelt',
  title      = 'Herr',
  phone      = '',
  street     = 'Europa-Allee 165',
  zip        = '60486',
  city       = 'Frankfurt am Main',
  score      = 75
where id = (select id from auth.users where email = 'marco.adelt@gmx.de');


-- ── 2. CONTRACTS ─────────────────────────────────────────
create table if not exists contracts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null,

  -- Grunddaten
  name             text not null,
  insurer          text not null,
  category         text not null,        -- "Hausrat" | "Haftpflicht" | ...
  category_icon    text not null,        -- "home" | "shield" | "scale" | "heart"

  -- Finanzen
  monthly_premium  numeric(10,2) not null,
  annual_premium   numeric(10,2) not null,

  -- Status & Bewertung
  status           text not null default 'gut'
                     check (status in ('gut', 'mangelhaft')),

  -- Vertragsdaten
  policy_number    text,
  start_date       date,
  renewal_date     date,                 -- Kündigungsfrist-Datum
  coverage         text,
  deductible       text,
  notes            text,
  document_url     text,

  -- Optimierungshinweis (optional)
  optimization     jsonb,               -- { headline, saving, detail }

  -- UI
  color            text default '#4a6da8',
  sort_order       int  default 0,

  created_at       timestamptz default now()
);

-- Row Level Security
alter table contracts enable row level security;

create policy "Nutzer sieht nur eigene Verträge"
  on contracts for select
  using (auth.uid() = user_id);

create policy "Nutzer kann eigene Verträge anlegen"
  on contracts for insert
  with check (auth.uid() = user_id);

create policy "Nutzer kann eigene Verträge aktualisieren"
  on contracts for update
  using (auth.uid() = user_id);


-- ── 3. MARCOS VERTRÄGE (Seed-Daten) ───────────────────────
do $$
declare
  marco_id uuid;
begin
  select id into marco_id from auth.users where email = 'marco.adelt@gmx.de';

  insert into contracts
    (user_id, name, insurer, category, category_icon,
     monthly_premium, annual_premium, status,
     policy_number, start_date, renewal_date,
     coverage, deductible, notes, color, document_url, sort_order)
  values

  -- Hausrat
  (marco_id,
   'Hausrat Exclusiv 2.0', 'Ammerländer Versicherung', 'Hausrat', 'home',
   4.13, 49.57, 'gut',
   '1014556402', '2024-05-29', '2026-05-29',
   '43.550 €', '–',
   'Versicherungssumme prüfen – ggf. an aktuelle Wohnverhältnisse anpassen',
   '#5e559c',
   'https://drive.google.com/file/d/1v7U4ye_JMBqZgxGiRRVfxX6YVU41Enkd/view?usp=sharing',
   1),

  -- Haftpflicht
  (marco_id,
   'Privathaftpflicht', 'Die Haftpflichtkasse', 'Haftpflicht', 'shield',
   6.69, 80.33, 'gut',
   '37262920/PK', '2025-01-06', '2027-01-05',
   'Privathaftpflicht', 'mit Selbstbeteiligung',
   'SEPA-Lastschrift via Targobank · Gläubiger-ID: DE73HK000000020189',
   '#4a6da8',
   'https://drive.google.com/file/d/1WgHR2nL6vupl819Hh9kvlkgyPs3am-Zc/view?usp=sharing',
   2),

  -- Rechtsschutz
  (marco_id,
   'Aktiv-Rechtsschutz Komfort', 'ARAG', 'Rechtsschutz', 'scale',
   24.40, 292.85, 'mangelhaft',
   '11 0052 1440 1146', '2025-03-30', '2027-03-30',
   'Aktiv-Rechtsschutz Komfort', '–',
   'Jährliche Zahlungsweise',
   '#4a5294',
   'https://drive.google.com/file/d/1UU9kMd0QcHshZ2RQMYHrs1GjaZcXPDsa/view?usp=sharing',
   3),

  -- BU
  (marco_id,
   'Berufsunfähigkeitsversicherung', 'Nürnberger Versicherung', 'Berufsunfähigkeit', 'heart',
   85.63, 1027.56, 'gut',
   'L 190479 317 012', '2020-06-01', '2039-06-01',
   '32.551 € Jahresrente bei BU', '–',
   'Tarif SBU2600C*M · Dynamik 3 % p.a. · max. 48.000 € Jahresrente · Nettobeitrag nach Überschuss: 59,94 €/Monat',
   '#8a4a68',
   'https://drive.google.com/file/d/1cF_PxkQa6oAeZzAvamojp7jCK9HOMZGa/view?usp=sharing',
   4);

  -- Optimierungshinweis für Rechtsschutz
  update contracts
  set optimization = '{
    "headline": "Bis zu 88 € / Jahr einsparen",
    "saving": "ca. 88 €",
    "detail": "Gleichwertiger Rechtsschutz mit identischer Deckung ist bei anderen Anbietern günstiger verfügbar. Ein Wechsel lohnt sich – besonders vor dem nächsten Verlängerungstermin."
  }'::jsonb
  where user_id = marco_id and category = 'Rechtsschutz';

end $$;
