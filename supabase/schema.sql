-- ============================================================
-- INKOTANYI SINCE 90 — Supabase (PostgreSQL) Schema
-- Run this in the Supabase SQL Editor (or via migrations).
-- ============================================================

-- ------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------
create table if not exists public.orders (
  id            text primary key,
  reference_id  text,
  external_id   text,
  items         jsonb not null default '[]'::jsonb,
  total         numeric not null default 0,
  currency      text not null default 'RWF',
  status        text not null default 'pending',
  customer_name text,
  customer_phone text,
  customer_email text,
  customer_address text,
  payment_method text not null default 'mtn',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_reference_id_idx on public.orders (reference_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ------------------------------------------------------------
-- SUBSCRIBERS
-- ------------------------------------------------------------
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- DNSMPI REQUESTS (Do Not Sell/Share My Personal Info)
-- ------------------------------------------------------------
create table if not exists public.dnsmpi_requests (
  id         uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name  text not null,
  email      text not null,
  phone      text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ADMIN PRODUCTS (admin-added/edited products persist)
-- ------------------------------------------------------------
create table if not exists public.admin_products (
  id          text primary key,
  code        text not null unique,
  name        text not null,
  price       numeric not null default 0,
  description text,
  category    text not null default 'tshirts',
  images      jsonb not null default '[]'::jsonb,
  sizes       jsonb not null default '["S","M","L"]'::jsonb,
  is_new      boolean not null default false,
  stock       integer not null default 0,
  gender      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- All writes happen server-side through the service-role client,
-- so we lock tables down. RLS is enabled; no policies are needed
-- for the anon/public role.
-- ============================================================
alter table public.orders set row level security;
alter table public.subscribers set row level security;
alter table public.dnsmpi_requests set row level security;
alter table public.admin_products set row level security;
