insert into public.departments (id, faculty_name, department_name, code, is_active)
values
    ('11111111-1111-1111-1111-111111111111', 'Muhendislik Fakultesi', 'Bilgisayar Muhendisligi', 'CENG', true),
    ('11111111-1111-1111-1111-111111111112', 'Muhendislik Fakultesi', 'Endustri Muhendisligi', 'IE', true)
on conflict (id) do update
set faculty_name = excluded.faculty_name,
    department_name = excluded.department_name,
    code = excluded.code,
    is_active = excluded.is_active;

insert into public.academic_terms (id, year, term_name, starts_at, ends_at, is_active)
values ('22222222-2222-2222-2222-222222222221', 2026, 'Bahar', '2026-02-10', '2026-06-20', true)
on conflict (id) do update
set year = excluded.year,
    term_name = excluded.term_name,
    starts_at = excluded.starts_at,
    ends_at = excluded.ends_at,
    is_active = excluded.is_active;

insert into public.course_catalog (id, course_code, course_name, credits, is_active)
values
    ('33333333-3333-3333-3333-333333333331', 'CENG101', 'Programlamaya Giris', 4, true),
    ('33333333-3333-3333-3333-333333333332', 'MAT101', 'Lineer Cebir', 3, true),
    ('33333333-3333-3333-3333-333333333333', 'ATA101', 'Ataturk Ilkeleri ve Inkilap Tarihi', 2, true)
on conflict (id) do update
set course_code = excluded.course_code,
    course_name = excluded.course_name,
    credits = excluded.credits,
    is_active = excluded.is_active;

insert into public.course_offerings (
    id,
    course_id,
    term_id,
    department_id,
    class_level,
    section,
    instructor_name,
    weekly_hours,
    allowed_absence_hours,
    is_active
)
values
    ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 1, 'A', 'Dr. Elif Kaya', 4, 12, true),
    ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 1, 'A', 'Dr. Murat Demir', 3, 9, true),
    ('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 1, 'A', 'Dr. Ayse Yildiz', 2, 6, true)
on conflict (id) do update
set course_id = excluded.course_id,
    term_id = excluded.term_id,
    department_id = excluded.department_id,
    class_level = excluded.class_level,
    section = excluded.section,
    instructor_name = excluded.instructor_name,
    weekly_hours = excluded.weekly_hours,
    allowed_absence_hours = excluded.allowed_absence_hours,
    is_active = excluded.is_active;

insert into public.schedule_slots (id, offering_id, day_of_week, start_time, end_time, room, building, delivery_type)
values
    ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 0, '09:00', '10:50', 'D-101', 'Merkez Derslik', 'in_person'),
    ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444441', 2, '09:00', '10:50', 'D-101', 'Merkez Derslik', 'in_person'),
    ('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444442', 1, '11:00', '12:50', 'A-204', 'Muhendislik Blogu', 'in_person'),
    ('55555555-5555-5555-5555-555555555554', '44444444-4444-4444-4444-444444444443', 4, '13:00', '14:50', 'Online', 'Sanal Kampus', 'online')
on conflict (id) do update
set offering_id = excluded.offering_id,
    day_of_week = excluded.day_of_week,
    start_time = excluded.start_time,
    end_time = excluded.end_time,
    room = excluded.room,
    building = excluded.building,
    delivery_type = excluded.delivery_type;

insert into public.exam_sessions (id, offering_id, exam_type, exam_date, start_time, end_time, building, room, notes, is_published)
values
    ('66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444441', 'vize', '2026-04-20', '10:00', '11:30', 'Merkez Derslik', 'D-101', 'Demo vize', true),
    ('66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444442', 'final', '2026-06-10', '14:00', '15:30', 'Muhendislik Blogu', 'A-204', 'Demo final', true),
    ('66666666-6666-6666-6666-666666666663', '44444444-4444-4444-4444-444444444443', 'quiz', '2026-04-22', '09:30', '10:15', 'Sanal Kampus', 'Zoom', 'Kisa quiz', true)
on conflict (id) do update
set offering_id = excluded.offering_id,
    exam_type = excluded.exam_type,
    exam_date = excluded.exam_date,
    start_time = excluded.start_time,
    end_time = excluded.end_time,
    building = excluded.building,
    room = excluded.room,
    notes = excluded.notes,
    is_published = excluded.is_published;

insert into public.cafeteria_menu_periods (id, year, month, valid_from, valid_to, version, is_published)
values ('77777777-7777-7777-7777-777777777771', 2026, 4, '2026-04-01', '2026-04-30', 1, true)
on conflict (id) do update
set year = excluded.year,
    month = excluded.month,
    valid_from = excluded.valid_from,
    valid_to = excluded.valid_to,
    version = excluded.version,
    is_published = excluded.is_published;

insert into public.cafeteria_menu_days (id, period_id, service_date, meal_session)
values
    ('88888888-8888-8888-8888-888888888881', '77777777-7777-7777-7777-777777777771', '2026-04-02', 'lunch'),
    ('88888888-8888-8888-8888-888888888882', '77777777-7777-7777-7777-777777777771', '2026-04-03', 'lunch')
on conflict (id) do update
set period_id = excluded.period_id,
    service_date = excluded.service_date,
    meal_session = excluded.meal_session;

insert into public.cafeteria_menu_items (id, menu_day_id, item_name, item_type, sort_order, calories)
values
    ('99999999-9999-9999-9999-999999999991', '88888888-8888-8888-8888-888888888881', 'Mercimek Corbasi', 'corba', 1, 120),
    ('99999999-9999-9999-9999-999999999992', '88888888-8888-8888-8888-888888888881', 'Tavuk Sote', 'ana_yemek', 2, 420),
    ('99999999-9999-9999-9999-999999999993', '88888888-8888-8888-8888-888888888881', 'Pirinç Pilavi', 'yardimci', 3, 260),
    ('99999999-9999-9999-9999-999999999994', '88888888-8888-8888-8888-888888888881', 'Cacik', 'ek', 4, 90),
    ('99999999-9999-9999-9999-999999999995', '88888888-8888-8888-8888-888888888882', 'Ezogelin Corbasi', 'corba', 1, 110),
    ('99999999-9999-9999-9999-999999999996', '88888888-8888-8888-8888-888888888882', 'Kuru Fasulye', 'ana_yemek', 2, 380),
    ('99999999-9999-9999-9999-999999999997', '88888888-8888-8888-8888-888888888882', 'Bulgur Pilavi', 'yardimci', 3, 240),
    ('99999999-9999-9999-9999-999999999998', '88888888-8888-8888-8888-888888888882', 'Ayran', 'icecek', 4, 80)
on conflict (id) do update
set menu_day_id = excluded.menu_day_id,
    item_name = excluded.item_name,
    item_type = excluded.item_type,
    sort_order = excluded.sort_order,
    calories = excluded.calories;
