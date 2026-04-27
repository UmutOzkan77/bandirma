create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

do $$
begin
    if not exists (
        select 1
        from pg_type
        where typname = 'student_source'
          and typnamespace = 'public'::regnamespace
    ) then
        create type public.student_source as enum ('imported', 'demo_signup');
    end if;
end;
$$;

do $$
begin
    if not exists (
        select 1
        from pg_type
        where typname = 'exam_type'
          and typnamespace = 'public'::regnamespace
    ) then
        create type public.exam_type as enum ('vize', 'final', 'bütünleme', 'quiz');
    end if;
end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

create table if not exists public.departments (
    id uuid primary key default gen_random_uuid(),
    faculty_name text not null,
    department_name text not null,
    code text not null,
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint departments_code_key unique (code)
);

create table if not exists public.academic_terms (
    id uuid primary key default gen_random_uuid(),
    year integer not null check (year >= 2020),
    term_name text not null,
    starts_at date not null,
    ends_at date not null,
    is_active boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint academic_terms_dates_check check (ends_at >= starts_at),
    constraint academic_terms_year_term_name_key unique (year, term_name)
);

create table if not exists public.students (
    id uuid primary key references auth.users (id) on delete cascade,
    school_email text not null,
    full_name text not null,
    phone text,
    faculty_name text not null,
    department_id uuid references public.departments (id) on delete set null,
    class_level integer check (class_level between 1 and 8),
    student_number text,
    is_active boolean not null default true,
    source public.student_source not null default 'imported',
    must_change_password boolean not null default true,
    password_changed_at timestamptz,
    tc_last4 text check (tc_last4 is null or char_length(tc_last4) = 4),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists students_school_email_lower_key
    on public.students (lower(school_email));
create index if not exists students_department_class_idx
    on public.students (department_id, class_level) where is_active;

create table if not exists public.course_catalog (
    id uuid primary key default gen_random_uuid(),
    course_code text not null,
    course_name text not null,
    credits numeric(4, 1),
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint course_catalog_course_code_key unique (course_code)
);

create index if not exists course_catalog_code_trgm_idx
    on public.course_catalog using gin (course_code gin_trgm_ops);
create index if not exists course_catalog_name_trgm_idx
    on public.course_catalog using gin (course_name gin_trgm_ops);

create table if not exists public.course_offerings (
    id uuid primary key default gen_random_uuid(),
    course_id uuid not null references public.course_catalog (id) on delete cascade,
    term_id uuid not null references public.academic_terms (id) on delete cascade,
    department_id uuid not null references public.departments (id) on delete cascade,
    class_level integer not null check (class_level between 1 and 8),
    section text,
    instructor_name text,
    weekly_hours integer check (weekly_hours is null or weekly_hours >= 0),
    allowed_absence_hours integer check (allowed_absence_hours is null or allowed_absence_hours >= 0),
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists course_offerings_unique_idx
    on public.course_offerings (course_id, term_id, department_id, class_level, coalesce(section, ''));
create index if not exists course_offerings_lookup_idx
    on public.course_offerings (term_id, department_id, class_level) where is_active;

create table if not exists public.schedule_slots (
    id uuid primary key default gen_random_uuid(),
    offering_id uuid not null references public.course_offerings (id) on delete cascade,
    day_of_week smallint not null check (day_of_week between 0 and 6),
    start_time time not null,
    end_time time not null,
    room text,
    building text,
    delivery_type text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint schedule_slots_time_check check (end_time > start_time)
);

create index if not exists schedule_slots_offering_idx
    on public.schedule_slots (offering_id);
create index if not exists schedule_slots_day_time_idx
    on public.schedule_slots (day_of_week, start_time);

create table if not exists public.exam_sessions (
    id uuid primary key default gen_random_uuid(),
    offering_id uuid not null references public.course_offerings (id) on delete cascade,
    exam_type public.exam_type not null,
    exam_date date not null,
    start_time time not null,
    end_time time not null,
    building text,
    room text,
    notes text,
    is_published boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint exam_sessions_time_check check (end_time > start_time)
);

create index if not exists exam_sessions_offering_idx
    on public.exam_sessions (offering_id);
create index if not exists exam_sessions_calendar_idx
    on public.exam_sessions (exam_date, start_time) where is_published;

create table if not exists public.cafeteria_menu_periods (
    id uuid primary key default gen_random_uuid(),
    year integer not null check (year >= 2020),
    month integer not null check (month between 1 and 12),
    valid_from date not null,
    valid_to date not null,
    version integer not null default 1,
    is_published boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint cafeteria_menu_periods_dates_check check (valid_to >= valid_from),
    constraint cafeteria_menu_periods_unique_key unique (year, month, version)
);

create index if not exists cafeteria_menu_periods_published_idx
    on public.cafeteria_menu_periods (valid_from, valid_to, version desc) where is_published;

create table if not exists public.cafeteria_menu_days (
    id uuid primary key default gen_random_uuid(),
    period_id uuid not null references public.cafeteria_menu_periods (id) on delete cascade,
    service_date date not null,
    meal_session text not null default 'lunch',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint cafeteria_menu_days_unique_key unique (period_id, service_date, meal_session)
);

create index if not exists cafeteria_menu_days_period_date_idx
    on public.cafeteria_menu_days (period_id, service_date);

create table if not exists public.cafeteria_menu_items (
    id uuid primary key default gen_random_uuid(),
    menu_day_id uuid not null references public.cafeteria_menu_days (id) on delete cascade,
    item_name text not null,
    item_type text,
    sort_order integer not null default 0,
    calories integer check (calories is null or calories >= 0),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists cafeteria_menu_items_day_idx
    on public.cafeteria_menu_items (menu_day_id, sort_order);
create unique index if not exists academic_terms_single_active_idx
    on public.academic_terms ((1)) where is_active;

create or replace function public.guard_student_profile_update()
returns trigger
language plpgsql
as $$
begin
    if auth.role() = 'authenticated' and auth.uid() = old.id then
        if new.school_email is distinct from old.school_email
            or new.full_name is distinct from old.full_name
            or new.faculty_name is distinct from old.faculty_name
            or new.department_id is distinct from old.department_id
            or new.class_level is distinct from old.class_level
            or new.student_number is distinct from old.student_number
            or new.is_active is distinct from old.is_active
            or new.source is distinct from old.source
            or new.tc_last4 is distinct from old.tc_last4 then
            raise exception 'Only phone and password flags can be updated by the student.';
        end if;
    end if;

    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

create or replace function public.sync_student_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
    current_student public.students%rowtype;
    resolved_department public.departments%rowtype;
    resolved_department_id uuid;
    resolved_source public.student_source;
    resolved_class_level integer;
    resolved_is_active boolean;
    resolved_must_change boolean;
    resolved_password_changed_at timestamptz;
    resolved_full_name text;
    resolved_phone text;
    resolved_student_number text;
    resolved_tc_last4 text;
    resolved_faculty_name text;
begin
    select *
    into current_student
    from public.students
    where id = new.id;

    resolved_department_id := null;
    if nullif(metadata ->> 'department_id', '') is not null then
        resolved_department_id := (metadata ->> 'department_id')::uuid;
    elsif nullif(metadata ->> 'department_code', '') is not null then
        select *
        into resolved_department
        from public.departments
        where code = metadata ->> 'department_code'
        limit 1;

        resolved_department_id := resolved_department.id;
    elsif current_student.department_id is not null then
        resolved_department_id := current_student.department_id;
    end if;

    if resolved_department_id is not null and resolved_department.id is null then
        select *
        into resolved_department
        from public.departments
        where id = resolved_department_id
        limit 1;
    end if;

    resolved_source := case
        when coalesce(nullif(metadata ->> 'source', ''), current_student.source::text, 'imported') = 'demo_signup' then 'demo_signup'::public.student_source
        else 'imported'::public.student_source
    end;

    resolved_class_level := coalesce(nullif(metadata ->> 'class_level', '')::integer, current_student.class_level);
    resolved_is_active := case
        when metadata ? 'is_active' then lower(coalesce(metadata ->> 'is_active', 'true')) in ('true', '1', 't', 'yes')
        else coalesce(current_student.is_active, true)
    end;

    resolved_must_change := case
        when metadata ? 'must_change_password' then lower(coalesce(metadata ->> 'must_change_password', 'false')) in ('true', '1', 't', 'yes')
        else coalesce(current_student.must_change_password, resolved_source = 'imported')
    end;

    resolved_password_changed_at := case
        when metadata ? 'password_changed_at' and nullif(metadata ->> 'password_changed_at', '') is not null then (metadata ->> 'password_changed_at')::timestamptz
        when resolved_must_change then null
        else coalesce(current_student.password_changed_at, timezone('utc', now()))
    end;

    resolved_full_name := coalesce(
        nullif(metadata ->> 'full_name', ''),
        current_student.full_name,
        split_part(coalesce(new.email, ''), '@', 1)
    );
    resolved_phone := coalesce(nullif(metadata ->> 'phone', ''), current_student.phone);
    resolved_student_number := coalesce(nullif(metadata ->> 'student_number', ''), current_student.student_number);
    resolved_tc_last4 := coalesce(nullif(metadata ->> 'tc_last4', ''), current_student.tc_last4);
    resolved_faculty_name := coalesce(
        nullif(metadata ->> 'faculty_name', ''),
        resolved_department.faculty_name,
        current_student.faculty_name,
        'Tanimsiz Fakultesi'
    );

    insert into public.students (
        id,
        school_email,
        full_name,
        phone,
        faculty_name,
        department_id,
        class_level,
        student_number,
        is_active,
        source,
        must_change_password,
        password_changed_at,
        tc_last4
    )
    values (
        new.id,
        coalesce(new.email, current_student.school_email),
        resolved_full_name,
        resolved_phone,
        resolved_faculty_name,
        resolved_department_id,
        resolved_class_level,
        resolved_student_number,
        resolved_is_active,
        resolved_source,
        resolved_must_change,
        resolved_password_changed_at,
        resolved_tc_last4
    )
    on conflict (id) do update
    set school_email = excluded.school_email,
        full_name = excluded.full_name,
        phone = excluded.phone,
        faculty_name = excluded.faculty_name,
        department_id = excluded.department_id,
        class_level = excluded.class_level,
        student_number = excluded.student_number,
        is_active = excluded.is_active,
        source = excluded.source,
        must_change_password = excluded.must_change_password,
        password_changed_at = excluded.password_changed_at,
        tc_last4 = excluded.tc_last4,
        updated_at = timezone('utc', now());

    return new;
end;
$$;

drop trigger if exists departments_touch_updated_at on public.departments;
create trigger departments_touch_updated_at
before update on public.departments
for each row execute function public.touch_updated_at();

drop trigger if exists academic_terms_touch_updated_at on public.academic_terms;
create trigger academic_terms_touch_updated_at
before update on public.academic_terms
for each row execute function public.touch_updated_at();

drop trigger if exists students_guard_before_update on public.students;
create trigger students_guard_before_update
before update on public.students
for each row execute function public.guard_student_profile_update();

drop trigger if exists course_catalog_touch_updated_at on public.course_catalog;
create trigger course_catalog_touch_updated_at
before update on public.course_catalog
for each row execute function public.touch_updated_at();

drop trigger if exists course_offerings_touch_updated_at on public.course_offerings;
create trigger course_offerings_touch_updated_at
before update on public.course_offerings
for each row execute function public.touch_updated_at();

drop trigger if exists schedule_slots_touch_updated_at on public.schedule_slots;
create trigger schedule_slots_touch_updated_at
before update on public.schedule_slots
for each row execute function public.touch_updated_at();

drop trigger if exists exam_sessions_touch_updated_at on public.exam_sessions;
create trigger exam_sessions_touch_updated_at
before update on public.exam_sessions
for each row execute function public.touch_updated_at();

drop trigger if exists cafeteria_menu_periods_touch_updated_at on public.cafeteria_menu_periods;
create trigger cafeteria_menu_periods_touch_updated_at
before update on public.cafeteria_menu_periods
for each row execute function public.touch_updated_at();

drop trigger if exists cafeteria_menu_days_touch_updated_at on public.cafeteria_menu_days;
create trigger cafeteria_menu_days_touch_updated_at
before update on public.cafeteria_menu_days
for each row execute function public.touch_updated_at();

drop trigger if exists cafeteria_menu_items_touch_updated_at on public.cafeteria_menu_items;
create trigger cafeteria_menu_items_touch_updated_at
before update on public.cafeteria_menu_items
for each row execute function public.touch_updated_at();

drop trigger if exists on_auth_user_synced_student_profile on auth.users;
create trigger on_auth_user_synced_student_profile
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_student_profile_from_auth();

alter table public.departments enable row level security;
alter table public.academic_terms enable row level security;
alter table public.students enable row level security;
alter table public.course_catalog enable row level security;
alter table public.course_offerings enable row level security;
alter table public.schedule_slots enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.cafeteria_menu_periods enable row level security;
alter table public.cafeteria_menu_days enable row level security;
alter table public.cafeteria_menu_items enable row level security;

drop policy if exists departments_read_authenticated on public.departments;
create policy departments_read_authenticated on public.departments
for select to authenticated using (true);

drop policy if exists academic_terms_read_authenticated on public.academic_terms;
create policy academic_terms_read_authenticated on public.academic_terms
for select to authenticated using (true);

drop policy if exists students_read_self on public.students;
create policy students_read_self on public.students
for select to authenticated using (auth.uid() = id);

drop policy if exists students_update_self on public.students;
create policy students_update_self on public.students
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists course_catalog_read_authenticated on public.course_catalog;
create policy course_catalog_read_authenticated on public.course_catalog
for select to authenticated using (true);

drop policy if exists course_offerings_read_authenticated on public.course_offerings;
create policy course_offerings_read_authenticated on public.course_offerings
for select to authenticated using (true);

drop policy if exists schedule_slots_read_authenticated on public.schedule_slots;
create policy schedule_slots_read_authenticated on public.schedule_slots
for select to authenticated using (true);

drop policy if exists exam_sessions_read_authenticated on public.exam_sessions;
create policy exam_sessions_read_authenticated on public.exam_sessions
for select to authenticated using (true);

drop policy if exists cafeteria_menu_periods_read_authenticated on public.cafeteria_menu_periods;
create policy cafeteria_menu_periods_read_authenticated on public.cafeteria_menu_periods
for select to authenticated using (true);

drop policy if exists cafeteria_menu_days_read_authenticated on public.cafeteria_menu_days;
create policy cafeteria_menu_days_read_authenticated on public.cafeteria_menu_days
for select to authenticated using (true);

drop policy if exists cafeteria_menu_items_read_authenticated on public.cafeteria_menu_items;
create policy cafeteria_menu_items_read_authenticated on public.cafeteria_menu_items
for select to authenticated using (true);
