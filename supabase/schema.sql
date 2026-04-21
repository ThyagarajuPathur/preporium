create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'progress_status'
  ) then
    create type public.progress_status as enum (
      'not_started',
      'in_progress',
      'solved',
      'revisit'
    );
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.problems (
  id text primary key,
  leetcode_number integer not null unique,
  title text not null,
  slug text not null unique,
  url text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  topic text not null,
  focus text not null,
  pattern text not null,
  day_number integer not null check (day_number between 1 and 30),
  day_order integer not null check (day_order between 1 and 5),
  path_name text not null default 'senior-30-day',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_problem_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  problem_id text not null references public.problems (id) on delete cascade,
  status public.progress_status not null default 'not_started',
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, problem_id)
);

alter table public.profiles enable row level security;
alter table public.problems enable row level security;
alter table public.user_problem_progress enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "problems_select_all" on public.problems;
create policy "problems_select_all"
on public.problems
for select
to authenticated
using (true);

drop policy if exists "progress_select_own" on public.user_problem_progress;
create policy "progress_select_own"
on public.user_problem_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.user_problem_progress;
create policy "progress_insert_own"
on public.user_problem_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.user_problem_progress;
create policy "progress_update_own"
on public.user_problem_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
