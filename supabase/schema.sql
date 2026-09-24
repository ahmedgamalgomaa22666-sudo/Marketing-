-- Bloom GCC Corporate Growth Engine — relational schema for the future SupabaseStore adapter.
-- Not used by the MVP (local demo mode). Mirrors src/lib/types.ts.
-- Enable Supabase Auth and add row-level security policies per team before storing real data.

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null check (country in ('UAE', 'Saudi Arabia')),
  city text not null,
  industry text not null,
  size_band text not null,
  website text not null default '',
  owner_id uuid references users(id) on delete set null,
  stage text not null default 'Target',
  highest_stage text not null default 'Target',
  priority text not null default 'Medium',
  training_potential text not null default 'Medium',
  signals text[] not null default '{}',
  tags text[] not null default '{}',
  notes text not null default '',
  last_contacted_at date,
  next_follow_up_at date,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table account_scores (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references accounts(id) on delete cascade,
  training_need smallint not null default 0 check (training_need between 0 and 5),
  strategic_relevance smallint not null default 0 check (strategic_relevance between 0 and 5),
  evidence text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  name text not null,
  title text not null,
  department text not null default '',
  seniority text not null,
  role text not null default 'Unknown',
  linkedin_url text not null default '',
  email text not null default '',
  phone text not null default '',
  notes text not null default '',
  last_interaction_at date,
  next_action text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table programmes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_demo boolean not null default false,
  description text not null default '',
  capabilities text[] not null default '{}',
  levels text[] not null default '{}',
  format text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  name text not null,
  stage text not null default 'Qualified',
  programme_ids uuid[] not null default '{}',
  primary_contact_id uuid references contacts(id) on delete set null,
  contact_ids uuid[] not null default '{}',
  estimated_value numeric,            -- optional: never populated with invented figures
  currency text not null default 'AED',
  probability smallint check (probability between 0 and 100),
  target_close_date date,
  business_problem text not null default '',
  next_step text not null default '',
  next_step_date date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Notes are activities of type 'Note'.
create table activities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  opportunity_id uuid references opportunities(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  type text not null,
  status text not null check (status in ('planned', 'done')),
  summary text not null,
  date date not null,
  outcome text check (outcome in ('positive', 'neutral', 'no-response')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table opportunity_recommendations (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  opportunity_id uuid references opportunities(id) on delete set null,
  inputs jsonb not null,
  gaps text[] not null default '{}',
  programme_ids uuid[] not null default '{}',
  business_case jsonb not null,
  validated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on contacts (account_id);
create index on opportunities (account_id);
create index on activities (account_id, status, date);

alter table accounts enable row level security;
alter table account_scores enable row level security;
alter table contacts enable row level security;
alter table opportunities enable row level security;
alter table activities enable row level security;
alter table programmes enable row level security;
alter table opportunity_recommendations enable row level security;
alter table users enable row level security;
-- TODO (Phase 2): policies scoped to the authenticated user's team.
