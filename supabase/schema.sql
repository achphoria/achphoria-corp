-- ACHPHORIA CORP — skema kantor virtual
-- Jalankan seluruh file ini di Supabase SQL Editor (lihat README).

create extension if not exists pgcrypto;

-- updated_at otomatis
create or replace function public.ac_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- ac_agents
-- ---------------------------------------------------------------------------
create table if not exists public.ac_agents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  title text not null,
  desk_row text not null check (desk_row in ('klien', 'build')),
  sort_order integer not null default 0,
  is_front_door boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists ac_agents_set_updated_at on public.ac_agents;
create trigger ac_agents_set_updated_at
  before update on public.ac_agents
  for each row execute function public.ac_set_updated_at();

-- ---------------------------------------------------------------------------
-- ac_projects
-- ---------------------------------------------------------------------------
create table if not exists public.ac_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brief text not null default '',
  status text not null default 'baru'
    check (status in ('baru', 'discovery', 'build', 'qc', 'selesai', 'ditutup')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists ac_projects_set_updated_at on public.ac_projects;
create trigger ac_projects_set_updated_at
  before update on public.ac_projects
  for each row execute function public.ac_set_updated_at();

-- ---------------------------------------------------------------------------
-- ac_tasks
-- ---------------------------------------------------------------------------
create table if not exists public.ac_tasks (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.ac_agents (id) on delete restrict,
  project_id uuid not null references public.ac_projects (id) on delete cascade,
  title text not null,
  status text not null default 'antrian'
    check (status in ('antrian', 'proses', 'selesai', 'ditahan')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists ac_tasks_agent_id_idx on public.ac_tasks (agent_id);
create index if not exists ac_tasks_project_id_idx on public.ac_tasks (project_id);

drop trigger if exists ac_tasks_set_updated_at on public.ac_tasks;
create trigger ac_tasks_set_updated_at
  before update on public.ac_tasks
  for each row execute function public.ac_set_updated_at();

-- ---------------------------------------------------------------------------
-- ac_messages
-- ---------------------------------------------------------------------------
create table if not exists public.ac_messages (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.ac_agents (id) on delete restrict,
  project_id uuid not null references public.ac_projects (id) on delete cascade,
  sender_label text not null default 'klien',
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists ac_messages_agent_id_idx on public.ac_messages (agent_id);
create index if not exists ac_messages_project_id_idx on public.ac_messages (project_id);

drop trigger if exists ac_messages_set_updated_at on public.ac_messages;
create trigger ac_messages_set_updated_at
  before update on public.ac_messages
  for each row execute function public.ac_set_updated_at();

-- ---------------------------------------------------------------------------
-- ac_activity
-- ---------------------------------------------------------------------------
create table if not exists public.ac_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.ac_projects (id) on delete set null,
  agent_id uuid references public.ac_agents (id) on delete set null,
  kind text not null,
  detail text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists ac_activity_project_id_idx on public.ac_activity (project_id);

drop trigger if exists ac_activity_set_updated_at on public.ac_activity;
create trigger ac_activity_set_updated_at
  before update on public.ac_activity
  for each row execute function public.ac_set_updated_at();

-- ---------------------------------------------------------------------------
-- Seed agen (10 meja)
-- ---------------------------------------------------------------------------
insert into public.ac_agents (slug, display_name, title, desk_row, sort_order, is_front_door)
values
  ('arka',  'Pak Arka',  'Principal',        'klien', 1, true),
  ('nisa',  'Mbak Nisa', 'Discovery',        'klien', 2, false),
  ('bima',  'Pak Bima',  'Solution',         'klien', 3, false),
  ('laras', 'Mbak Laras','Implementation',   'klien', 4, false),
  ('dimas', 'Pak Dimas', 'Data & Otomasi',   'klien', 5, false),
  ('sari',  'Mbak Sari', 'Client Desk',      'klien', 6, false),
  ('maya',  'Mbak Maya', 'UX',               'build', 1, false),
  ('galih', 'Pak Galih', 'Tech lead',        'build', 2, false),
  ('reza',  'Pak Reza',  'Builder',          'build', 3, false),
  ('tia',   'Mbak Tia',  'QC',               'build', 4, false)
on conflict (slug) do update set
  display_name = excluded.display_name,
  title = excluded.title,
  desk_row = excluded.desk_row,
  sort_order = excluded.sort_order,
  is_front_door = excluded.is_front_door,
  updated_at = timezone('utc', now());

-- ---------------------------------------------------------------------------
-- RLS
-- anon: baca agent, proyek, tugas — tidak boleh baca pesan
-- ---------------------------------------------------------------------------
alter table public.ac_agents enable row level security;
alter table public.ac_projects enable row level security;
alter table public.ac_tasks enable row level security;
alter table public.ac_messages enable row level security;
alter table public.ac_activity enable row level security;

drop policy if exists "ac_agents_anon_select" on public.ac_agents;
create policy "ac_agents_anon_select"
  on public.ac_agents
  for select
  to anon
  using (true);

drop policy if exists "ac_projects_anon_select" on public.ac_projects;
create policy "ac_projects_anon_select"
  on public.ac_projects
  for select
  to anon
  using (true);

drop policy if exists "ac_projects_anon_insert" on public.ac_projects;
create policy "ac_projects_anon_insert"
  on public.ac_projects
  for insert
  to anon
  with check (true);

drop policy if exists "ac_tasks_anon_select" on public.ac_tasks;
create policy "ac_tasks_anon_select"
  on public.ac_tasks
  for select
  to anon
  using (true);

-- Pesan: boleh kirim brief ke Pak Arka, tidak boleh dibaca publik
drop policy if exists "ac_messages_anon_insert" on public.ac_messages;
create policy "ac_messages_anon_insert"
  on public.ac_messages
  for insert
  to anon
  with check (true);

-- Tidak ada policy SELECT pada ac_messages untuk anon → tidak terbaca publik

drop policy if exists "ac_activity_anon_insert" on public.ac_activity;
create policy "ac_activity_anon_insert"
  on public.ac_activity
  for insert
  to anon
  with check (true);

grant usage on schema public to anon;
grant select on public.ac_agents to anon;
grant select, insert on public.ac_projects to anon;
grant select on public.ac_tasks to anon;
grant insert on public.ac_messages to anon;
grant insert on public.ac_activity to anon;
