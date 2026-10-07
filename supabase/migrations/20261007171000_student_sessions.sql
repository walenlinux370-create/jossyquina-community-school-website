begin;
create table public.student_sessions (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.students(id) on delete cascade,
 token_hash text not null unique,
 expires_at timestamptz not null,
 created_at timestamptz not null default now(),
 last_seen_at timestamptz not null default now()
);
alter table public.student_sessions enable row level security;
revoke all on public.student_sessions from public,anon,authenticated;
grant select,insert,update,delete on public.student_sessions to service_role;
create index student_sessions_token_idx on public.student_sessions(token_hash);
commit;