-- =========================================================
-- EcoRent Team B9 - Supabase setup
-- Run this whole file in Supabase SQL Editor.
-- =========================================================

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'EcoRent User',
  role text not null default 'landlord'
    check (role in ('landlord', 'tenant')),
  phone text,
  created_at timestamptz not null default now()
);

-- Public property catalogue + owner-managed properties
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  location text not null,
  type text not null,
  rent numeric(12,2) not null default 0,
  deposit numeric(12,2) not null default 0,
  eco integer not null default 4 check (eco between 1 and 5),
  features text[] not null default '{}',
  description text not null default '',
  address text not null default '',
  bedrooms integer not null default 1,
  status text not null default 'Available'
    check (status in ('Occupied', 'Available')),
  created_at timestamptz not null default now()
);

-- Tenants are owned by the landlord account that created them.
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  id_type text default 'Aadhaar',
  created_at timestamptz not null default now()
);

-- Rental agreements
create table if not exists public.agreements (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  owner_name text,
  start_date date not null,
  end_date date not null,
  monthly_rent numeric(12,2) not null default 0,
  security_deposit numeric(12,2) not null default 0,
  notice_period_days integer not null default 30,
  maintenance numeric(12,2) not null default 0,
  status text not null default 'Active'
    check (status in ('Active', 'Expiring Soon', 'Expired', 'Draft')),
  created_at timestamptz not null default now()
);

-- Monthly rent records
create table if not exists public.rent_payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  agreement_id uuid not null references public.agreements(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  month text not null,
  amount numeric(12,2) not null default 0,
  payment_date date,
  status text not null default 'Pending'
    check (status in ('Paid', 'Pending', 'Overdue')),
  created_at timestamptz not null default now()
);

-- Stored signed documents / attachments
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  agreement_id uuid not null references public.agreements(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  mime_type text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Automatic profile row when a user signs up
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'EcoRent User'),
    coalesce(new.raw_user_meta_data ->> 'role', 'landlord'),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- RLS
-- =========================================================
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.tenants enable row level security;
alter table public.agreements enable row level security;
alter table public.rent_payments enable row level security;
alter table public.documents enable row level security;

drop policy if exists "profiles_self" on public.profiles;
create policy "profiles_self"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- Properties: anyone can browse the catalogue.
drop policy if exists "properties_public_read" on public.properties;
create policy "properties_public_read"
on public.properties for select
using (true);

drop policy if exists "properties_owner_insert" on public.properties;
create policy "properties_owner_insert"
on public.properties for insert
with check (auth.uid() is not null and auth.uid() = owner_id);

drop policy if exists "properties_owner_update" on public.properties;
create policy "properties_owner_update"
on public.properties for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "properties_owner_delete" on public.properties;
create policy "properties_owner_delete"
on public.properties for delete
using (auth.uid() = owner_id);

drop policy if exists "tenants_owner_all" on public.tenants;
create policy "tenants_owner_all"
on public.tenants for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "agreements_owner_all" on public.agreements;
create policy "agreements_owner_all"
on public.agreements for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "payments_owner_all" on public.rent_payments;
create policy "payments_owner_all"
on public.rent_payments for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "documents_owner_all" on public.documents;
create policy "documents_owner_all"
on public.documents for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- =========================================================
-- Supabase Storage bucket
-- =========================================================
insert into storage.buckets (id, name, public)
values ('agreement-documents', 'agreement-documents', false)
on conflict (id) do nothing;

drop policy if exists "agreement_docs_owner_insert" on storage.objects;
create policy "agreement_docs_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'agreement-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "agreement_docs_owner_select" on storage.objects;
create policy "agreement_docs_owner_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'agreement-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "agreement_docs_owner_delete" on storage.objects;
create policy "agreement_docs_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'agreement-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- =========================================================
-- Seed public property catalogue
-- =========================================================
insert into public.properties
(name, location, type, rent, deposit, eco, features, description, address, bedrooms, status)
select * from (
  values
  ('Green Home','Bengaluru','2 BHK Apartment',18000,50000,5,
   array['Solar Power','Rainwater Harvesting','LED Lighting'],
   'A comfortable home designed with simple sustainable features.',
   'Yelahanka New Town, Bengaluru',2,'Occupied'),
  ('Solar Nest','Mysuru','1 BHK Apartment',14000,40000,4,
   array['Solar Water Heater','Natural Ventilation','LED Lighting'],
   'A compact and energy-conscious apartment for comfortable living.',
   'VV Mohalla, Mysuru',1,'Available'),
  ('Eco Villa','Hyderabad','3 BHK Villa',26000,70000,5,
   array['Solar Panels','Garden','Water Recycling'],
   'A spacious eco-friendly villa with greenery and water-saving systems.',
   'Kondapur, Hyderabad',3,'Occupied')
) as seed(name,location,type,rent,deposit,eco,features,description,address,bedrooms,status)
where not exists (
  select 1 from public.properties p where p.name = seed.name and p.location = seed.location
);
