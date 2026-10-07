-- Jossyquina EdTech foundation
-- Security-first PostgreSQL/Supabase schema. Apply only after reviewing with the institution's legal/security team.
begin;

create extension if not exists pgcrypto;

create type public.app_role as enum ('student','teacher','admin','super_admin');
create type public.user_status as enum ('pending','active','inactive','blocked');
create type public.grade_state as enum ('draft','published');
create type public.trimester as enum ('T1','T2','T3');
create type public.application_status as enum ('pending','approved','rejected');

create table public.users (
  id uuid primary key references auth.users(id) on delete restrict,
  full_name text not null check (length(full_name) between 2 and 160),
  email text,
  phone text,
  role public.app_role not null default 'student',
  status public.user_status not null default 'pending',
  is_active boolean not null default true,
  mfa_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.academic_years (
  id uuid primary key default gen_random_uuid(),
  year smallint not null unique check (year between 2020 and 2100),
  is_current boolean not null default false
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  level smallint not null unique check (level between 1 and 12),
  name text not null unique
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete restrict,
  name text not null,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  unique(class_id,name,academic_year_id)
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete restrict,
  registration_number text not null unique,
  full_name text not null check (length(full_name) between 2 and 160),
  email text,
  phone text,
  guardian_name text,
  guardian_contact text,
  guardian_consent_at timestamptz,
  class_id uuid not null references public.classes(id) on delete restrict,
  section_id uuid not null references public.sections(id) on delete restrict,
  status public.user_status not null default 'pending',
  auth_code_hash text,
  auth_code_issued_at timestamptz,
  auth_failed_attempts smallint not null default 0 check (auth_failed_attempts between 0 and 5),
  auth_locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (guardian_consent_at is not null or status = 'pending')
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  min_level smallint not null check (min_level between 1 and 12),
  max_level smallint not null check (max_level between min_level and 12),
  unique(name,min_level,max_level)
);

create table public.teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.users(id) on delete restrict,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  section_id uuid not null references public.sections(id) on delete restrict,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(teacher_id,subject_id,section_id,academic_year_id),
  unique(subject_id,section_id,academic_year_id)
);

create table public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete restrict,
  assignment_id uuid not null references public.teacher_assignments(id) on delete restrict,
  trimester public.trimester not null,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  component_1 numeric(5,2) check (component_1 between 0 and 20),
  component_2 numeric(5,2) check (component_2 between 0 and 20),
  component_3 numeric(5,2) check (component_3 between 0 and 20),
  final_grade numeric(5,2) generated always as (
    round(((coalesce(component_1,0)+coalesce(component_2,0)+coalesce(component_3,0)) /
      nullif((case when component_1 is null then 0 else 1 end + case when component_2 is null then 0 else 1 end + case when component_3 is null then 0 else 1 end),0))::numeric,2)
  ) stored,
  state public.grade_state not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id,assignment_id,trimester,academic_year_id)
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete restrict,
  assignment_id uuid not null references public.teacher_assignments(id) on delete restrict,
  attendance_date date not null,
  present boolean not null,
  reason text check (reason is null or length(reason) <= 500),
  created_by uuid references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(student_id,assignment_id,attendance_date)
);

create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete restrict,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  teacher_id uuid references public.users(id) on delete restrict,
  weekday smallint not null check (weekday between 1 and 7),
  starts_at time not null,
  ends_at time not null check (ends_at > starts_at),
  room text check (room is null or length(room) <= 80),
  academic_year_id uuid not null references public.academic_years(id) on delete restrict
);

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.teacher_assignments(id) on delete restrict,
  title text not null check (length(title) between 1 and 160),
  storage_path text not null unique,
  mime_type text not null,
  byte_size bigint not null check (byte_size > 0 and byte_size <= 52428800),
  created_at timestamptz not null default now()
);

create table public.student_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(full_name) between 2 and 160),
  email text,
  phone text,
  class_level smallint not null check (class_level between 1 and 12),
  section_name text,
  guardian_name text not null check (length(guardian_name) between 2 and 160),
  guardian_contact text not null,
  consent_at timestamptz not null,
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 3 and 180),
  slug text not null unique,
  excerpt text check (excerpt is null or length(excerpt) <= 500),
  body_html text not null,
  media_url text,
  media_kind text check (media_kind is null or media_kind in ('image','video','embed')),
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 120),
  email text not null,
  phone text,
  message text not null check (length(message) between 10 and 4000),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid,
  event_type text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now()
);

create index students_section_idx on public.students(section_id);
create index grades_student_idx on public.grades(student_id);
create index grades_assignment_idx on public.grades(assignment_id);
create index attendance_student_idx on public.attendance(student_id);
create index materials_assignment_idx on public.materials(assignment_id);
create index audit_logs_created_idx on public.audit_logs(created_at desc);

create or replace function public.current_app_role()
returns public.app_role
language sql stable security definer
set search_path = public
as $$ select role from public.users where id = auth.uid() and is_active = true limit 1 $$;

create or replace function public.my_student_id()
returns uuid
language sql stable security definer
set search_path = public
as $$ select id from public.students where user_id = auth.uid() and status = 'active' limit 1 $$;

create or replace function public.is_teacher_assigned(p_assignment_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$ select exists(select 1 from public.teacher_assignments where id=p_assignment_id and teacher_id=auth.uid()) $$;

create or replace function public.validate_assignment_class()
returns trigger
language plpgsql
set search_path = public
as $$
declare v_level smallint; v_min smallint; v_max smallint;
begin
  select c.level into v_level from public.sections s join public.classes c on c.id=s.class_id where s.id=new.section_id;
  select min_level,max_level into v_min,v_max from public.subjects where id=new.subject_id;
  if v_level is null or v_level not between v_min and v_max then
    raise exception 'Subject is not compatible with class';
  end if;
  if not exists(select 1 from public.users where id=new.teacher_id and role='teacher' and is_active=true) then
    raise exception 'Teacher is not eligible';
  end if;
  return new;
end $$;

create trigger teacher_assignment_class_guard
before insert or update on public.teacher_assignments
for each row execute function public.validate_assignment_class();

create or replace function public.validate_grade_identity()
returns trigger
language plpgsql
set search_path = public
as $$
declare a_teacher uuid; a_section uuid; s_section uuid; s_year uuid;
begin
  select teacher_id,section_id,academic_year_id into a_teacher,a_section,s_year
  from public.teacher_assignments where id=new.assignment_id;
  select section_id into s_section from public.students where id=new.student_id;
  if s_section is distinct from a_section or new.academic_year_id is distinct from s_year then
    raise exception 'Student is outside assignment scope';
  end if;
  if tg_op='UPDATE' and (new.student_id is distinct from old.student_id or new.assignment_id is distinct from old.assignment_id or new.trimester is distinct from old.trimester or new.academic_year_id is distinct from old.academic_year_id) then
    raise exception 'Grade identity is immutable';
  end if;
  if new.state='published' and old.state is distinct from 'published' then
    new.published_at = coalesce(new.published_at,now());
  end if;
  if new.state='draft' then new.published_at=null; end if;
  return new;
end $$;

create trigger grade_identity_guard
before insert or update on public.grades
for each row execute function public.validate_grade_identity();

create or replace function public.audit_sensitive_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op='DELETE' then
    insert into public.audit_logs(actor_user_id,event_type,entity_type,entity_id,before_data)
    values(auth.uid(),tg_table_name||'.delete',tg_table_name,old.id::text,to_jsonb(old));
  else
    if tg_table_name='grades' and tg_op='UPDATE' then
      insert into public.audit_logs(actor_user_id,event_type,entity_type,entity_id,before_data,after_data)
      values(auth.uid(),'grades.update',tg_table_name,new.id::text,to_jsonb(old),to_jsonb(new));
    end if;
  end if;
  return coalesce(new,old);
end $$;

create trigger grades_audit after update on public.grades for each row execute function public.audit_sensitive_changes();

create or replace function public.audit_logs_immutable()
returns trigger language plpgsql set search_path=public as $$ begin raise exception 'audit_logs are immutable'; end $$;
create trigger audit_logs_no_update before update or delete on public.audit_logs for each row execute function public.audit_logs_immutable();

create or replace function public.admin_issue_auth_code(p_student_id uuid)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v_code text; v_chars constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'; v_i int;
begin
  if public.current_app_role() not in ('admin','super_admin') then raise exception 'forbidden'; end if;
  v_code='';
  for v_i in 1..12 loop
    v_code := v_code || substr(v_chars, 1 + floor(random()*length(v_chars))::int, 1);
  end loop;
  update public.students
    set auth_code_hash=crypt(v_code,gen_salt('bf',12)),
        auth_code_issued_at=now(),
        auth_failed_attempts=0,
        auth_locked_until=null,
        status='active',
        updated_at=now()
  where id=p_student_id and status <> 'inactive';
  if not found then raise exception 'student unavailable'; end if;
  insert into public.audit_logs(actor_user_id,event_type,entity_type,entity_id)
  values(auth.uid(),'student.auth_code.issued','students',p_student_id::text);
  return v_code;
end $$;

create or replace function public.verify_student_code(p_registration_number text,p_code text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare s public.students%rowtype; ok boolean;
begin
  select * into s from public.students where registration_number=p_registration_number limit 1;
  if s.id is null or s.status <> 'active' or (s.auth_locked_until is not null and s.auth_locked_until>now()) then
    return null;
  end if;
  ok := s.auth_code_hash is not null and crypt(p_code,s.auth_code_hash)=s.auth_code_hash;
  if ok then
    update public.students set auth_failed_attempts=0,auth_locked_until=null where id=s.id;
    insert into public.audit_logs(actor_user_id,event_type,entity_type,entity_id) values(s.user_id,'student.login.success','students',s.id::text);
    return s.id;
  end if;
  update public.students
    set auth_failed_attempts=least(auth_failed_attempts+1,5),
        auth_locked_until=case when auth_failed_attempts+1>=5 then now()+interval '15 minutes' else auth_locked_until end
  where id=s.id;
  insert into public.audit_logs(actor_user_id,event_type,entity_type,entity_id) values(s.user_id,'student.login.failure','students',s.id::text);
  return null;
end $$;

-- Default deny: RLS on every application table.
do $$
declare t text;
begin
  foreach t in array array['users','academic_years','classes','sections','students','subjects','teacher_assignments','grades','attendance','schedules','materials','student_applications','news','contact_messages','audit_logs'] loop
    execute format('alter table public.%I enable row level security',t);
  end loop;
end $$;

-- Students: own published academic data only.
create policy students_self_select on public.students for select to authenticated using (user_id=auth.uid() or public.current_app_role() in ('admin','super_admin'));
create policy grades_student_select on public.grades for select to authenticated using (
  (student_id=public.my_student_id() and state='published')
  or public.current_app_role() in ('admin','super_admin')
  or (public.current_app_role()='teacher' and public.is_teacher_assigned(assignment_id))
);
create policy attendance_student_select on public.attendance for select to authenticated using (
  student_id=public.my_student_id() or public.current_app_role() in ('admin','super_admin') or (public.current_app_role()='teacher' and public.is_teacher_assigned(assignment_id))
);
create policy assignments_teacher_select on public.teacher_assignments for select to authenticated using (
  teacher_id=auth.uid() or public.current_app_role() in ('admin','super_admin')
);
create policy grades_teacher_insert on public.grades for insert to authenticated with check (
  public.current_app_role() in ('admin','super_admin') or (public.current_app_role()='teacher' and public.is_teacher_assigned(assignment_id))
);
create policy grades_teacher_update on public.grades for update to authenticated using (
  public.current_app_role() in ('admin','super_admin') or (public.current_app_role()='teacher' and public.is_teacher_assigned(assignment_id))
) with check (
  public.current_app_role() in ('admin','super_admin') or (public.current_app_role()='teacher' and public.is_teacher_assigned(assignment_id))
);
create policy attendance_teacher_insert on public.attendance for insert to authenticated with check (
  public.current_app_role() in ('admin','super_admin') or (public.current_app_role()='teacher' and public.is_teacher_assigned(assignment_id))
);
create policy schedules_student_teacher_select on public.schedules for select to authenticated using (
  public.current_app_role() in ('admin','super_admin') or exists(select 1 from public.students st where st.id=public.my_student_id() and st.section_id=schedules.section_id) or teacher_id=auth.uid()
);
create policy materials_student_teacher_select on public.materials for select to authenticated using (
  public.current_app_role() in ('admin','super_admin') or exists(
    select 1 from public.teacher_assignments ta join public.students st on st.section_id=ta.section_id
    where ta.id=materials.assignment_id and st.id=public.my_student_id()
  ) or exists(select 1 from public.teacher_assignments ta where ta.id=materials.assignment_id and ta.teacher_id=auth.uid())
);
create policy admin_users_select on public.users for select to authenticated using (public.current_app_role() in ('admin','super_admin'));
create policy admin_users_update on public.users for update to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_students_all on public.students for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_curriculum_all on public.subjects for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_years_all on public.academic_years for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_classes_all on public.classes for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_sections_all on public.sections for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_assignments_all on public.teacher_assignments for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_schedules_all on public.schedules for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_materials_all on public.materials for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy admin_news_all on public.news for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy public_news_select on public.news for select to anon,authenticated using (published=true);
create policy admin_applications_all on public.student_applications for all to authenticated using (public.current_app_role() in ('admin','super_admin')) with check (public.current_app_role() in ('admin','super_admin'));
create policy public_application_insert on public.student_applications for insert to anon,authenticated with check (status='pending');
create policy admin_contacts_select on public.contact_messages for select to authenticated using (public.current_app_role() in ('admin','super_admin'));
create policy public_contacts_insert on public.contact_messages for insert to anon,authenticated with check (true);
create policy audit_insert_server_only on public.audit_logs for insert to service_role with check (true);

revoke all on all tables in schema public from anon,authenticated;
revoke all on public.users,public.audit_logs from anon,authenticated;
grant select on public.news to anon,authenticated;
grant insert on public.student_applications,public.contact_messages to anon,authenticated;
grant select on public.students,public.grades,public.attendance,public.teacher_assignments,public.schedules,public.materials to authenticated;
grant insert,update on public.grades,public.attendance to authenticated;
grant select,insert,update on public.users,public.students,public.subjects,public.academic_years,public.classes,public.sections,public.teacher_assignments,public.schedules,public.materials,public.news,public.student_applications,public.contact_messages to authenticated;

revoke all on function public.admin_issue_auth_code(uuid) from public,anon,authenticated;
revoke all on function public.verify_student_code(text,text) from public,anon,authenticated;
grant execute on function public.admin_issue_auth_code(uuid) to service_role;
grant execute on function public.verify_student_code(text,text) to service_role;

insert into public.classes(level,name) values
(1,'1ª Classe'),(2,'2ª Classe'),(3,'3ª Classe'),(4,'4ª Classe'),(5,'5ª Classe'),(6,'6ª Classe'),
(7,'7ª Classe'),(8,'8ª Classe'),(9,'9ª Classe'),(10,'10ª Classe'),(11,'11ª Classe'),(12,'12ª Classe')
on conflict do nothing;

insert into public.subjects(name,min_level,max_level) values
('Língua Portuguesa',1,12),('Matemática',1,12),('Ciências Naturais',1,6),('História',1,12),
('Geografia',1,12),('Educação Física',1,12),('Educação Visual e Ofícios',1,6),
('Física',7,12),('Química',7,12),('Biologia',7,12),('Filosofia',10,12),
('Língua Inglesa',7,12),('Francês',7,12),('Agro-Pecuária',7,12)
on conflict do nothing;

commit;