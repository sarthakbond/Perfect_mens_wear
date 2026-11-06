create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  name_mr text,
  brand text not null,
  category text not null,
  category_mr text,
  price numeric(12, 2) not null check (price >= 0),
  mrp numeric(12, 2) check (mrp is null or mrp >= price),
  stock integer not null default 0 check (stock >= 0),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  images text[] not null default '{}',
  tag text not null default '',
  tag_mr text,
  bestseller boolean not null default false,
  new_arrival boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 2 and 80),
  customer_contact text not null check (char_length(customer_contact) between 7 and 40),
  message text not null check (char_length(message) between 5 and 5000),
  selected_items jsonb not null default '[]'::jsonb,
  expected_total numeric(12, 2) not null default 0 check (expected_total >= 0),
  status text not null default 'new' check (status in ('new', 'handled')),
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_mr text,
  image_url text not null,
  link_url text,
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.is_store_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_store_admin() from public;
grant execute on function public.is_store_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.order_enquiries enable row level security;
alter table public.store_settings enable row level security;
alter table public.homepage_banners enable row level security;

drop policy if exists "Admins can read their own membership" on public.admin_users;
create policy "Admins can read their own membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products
  for select to anon, authenticated using (active or (select public.is_store_admin()));
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
  for all to authenticated using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));

drop policy if exists "Customers can create enquiries" on public.order_enquiries;
create policy "Customers can create enquiries" on public.order_enquiries
  for insert to anon, authenticated with check (
    char_length(customer_name) between 2 and 80
    and char_length(customer_contact) between 7 and 40
    and char_length(message) between 5 and 5000
    and status = 'new'
  );
drop policy if exists "Admins manage enquiries" on public.order_enquiries;
create policy "Admins manage enquiries" on public.order_enquiries
  for all to authenticated using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings" on public.store_settings
  for select to anon, authenticated using (true);
drop policy if exists "Admins manage store settings" on public.store_settings;
create policy "Admins manage store settings" on public.store_settings
  for all to authenticated using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));

drop policy if exists "Public can read active banners" on public.homepage_banners;
create policy "Public can read active banners" on public.homepage_banners
  for select to anon, authenticated using (active or (select public.is_store_admin()));
drop policy if exists "Admins manage homepage banners" on public.homepage_banners;
create policy "Admins manage homepage banners" on public.homepage_banners
  for all to authenticated using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));

grant select on public.products, public.store_settings, public.homepage_banners to anon, authenticated;
grant insert on public.order_enquiries to anon, authenticated;
grant select, insert, update, delete on public.admin_users, public.products, public.order_enquiries,
  public.store_settings, public.homepage_banners to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view store images" on storage.objects;
create policy "Public can view store images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');
drop policy if exists "Admins upload store images" on storage.objects;
create policy "Admins upload store images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'product-images' and (select public.is_store_admin())
  );
drop policy if exists "Admins update store images" on storage.objects;
create policy "Admins update store images" on storage.objects
  for update to authenticated using (
    bucket_id = 'product-images' and (select public.is_store_admin())
  ) with check (bucket_id = 'product-images' and (select public.is_store_admin()));
drop policy if exists "Admins delete store images" on storage.objects;
create policy "Admins delete store images" on storage.objects
  for delete to authenticated using (
    bucket_id = 'product-images' and (select public.is_store_admin())
  );

-- Create an Auth user first, then insert that user's auth.users.id here from the SQL Editor.
-- Never grant admin_users INSERT to the browser or place a service-role key in site-config.js.
