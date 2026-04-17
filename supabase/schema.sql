-- Paste this whole file into Supabase SQL Editor and run it once.

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  bio text,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  created_at timestamptz default now()
);

create table if not exists public.tutorials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  content text,
  video_url text,
  cover_image text,
  created_at timestamptz default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references public.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  updated_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.tutorials enable row level security;
alter table public.community_posts enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "read users" on public.users;
create policy "read users" on public.users for select using (true);
drop policy if exists "update own user" on public.users;
create policy "update own user" on public.users for update using (auth.uid() = id);

drop policy if exists "read posts" on public.posts;
create policy "read posts" on public.posts for select using (true);

drop policy if exists "read tutorials if subscribed" on public.tutorials;
create policy "read tutorials if subscribed" on public.tutorials for select using (
  exists (select 1 from public.subscriptions s
          where s.user_id = auth.uid()
            and s.status in ('active','trialing'))
);

drop policy if exists "read community" on public.community_posts;
create policy "read community" on public.community_posts for select using (true);
drop policy if exists "insert own community" on public.community_posts;
create policy "insert own community" on public.community_posts for insert with check (auth.uid() = user_id);

drop policy if exists "read own sub" on public.subscriptions;
create policy "read own sub" on public.subscriptions for select using (auth.uid() = user_id);

-- Seed data so the site is not empty
insert into public.posts (title, slug, excerpt, content, cover_image) values
  ('Why Architecture Students Should Learn CAD Early',
   'learn-cad-early',
   'The earlier you master your tools, the more you can focus on design.',
   'Starting with CAD software early in your education unlocks creative freedom later.',
   'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200')
on conflict (slug) do nothing;

insert into public.tutorials (title, description, video_url) values
  ('Intro to Rhino 8',
   'A quick walkthrough of the Rhino interface.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ')
on conflict do nothing;
