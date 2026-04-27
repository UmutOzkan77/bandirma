#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

function loadEnvFile(filePath) {
    if (!existsSync(filePath)) {
        return;
    }

    const content = readFileSync(filePath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) {
            continue;
        }

        const separatorIndex = line.indexOf('=');
        if (separatorIndex === -1) {
            continue;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, '');
        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

function parseBoolean(value, fallback = true) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    return ['true', '1', 't', 'yes', 'y'].includes(String(value).trim().toLowerCase());
}

function splitCsvLine(line) {
    const cells = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const nextChar = line[index + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === ',' && !inQuotes) {
            cells.push(current.trim());
            current = '';
            continue;
        }

        current += char;
    }

    cells.push(current.trim());
    return cells;
}

function parseCsv(content) {
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length < 2) {
        return [];
    }

    const headers = splitCsvLine(lines[0]).map((header) => header.trim());
    return lines.slice(1).map((line) => {
        const cells = splitCsvLine(line);
        const record = {};
        headers.forEach((header, index) => {
            record[header] = cells[index] ?? '';
        });
        return record;
    });
}

function normalizeString(value) {
    return String(value ?? '').trim();
}

function pick(record, keys) {
    for (const key of keys) {
        const value = normalizeString(record[key]);
        if (value) {
            return value;
        }
    }
    return '';
}

function normalizeStudent(record) {
    const schoolEmail = pick(record, ['school_email', 'email', 'schoolEmail']).toLowerCase();
    const fullName = pick(record, ['full_name', 'name', 'fullName']);
    const tcKimlik = pick(record, ['tc_kimlik', 'tc', 'tcKimlik']);
    const departmentCode = pick(record, ['department_code', 'department', 'departmentCode']).toUpperCase();
    const classLevel = Number(pick(record, ['class_level', 'class', 'classLevel']) || '0');

    return {
        schoolEmail,
        fullName,
        tcKimlik,
        departmentCode,
        classLevel,
        phone: pick(record, ['phone', 'telefon']),
        studentNumber: pick(record, ['student_number', 'number', 'studentNumber']),
        facultyName: pick(record, ['faculty_name', 'faculty', 'facultyName']),
        isActive: parseBoolean(pick(record, ['is_active', 'active', 'isActive']), true),
    };
}

async function readDataset(filePath) {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const content = await readFile(absolutePath, 'utf8');
    if (absolutePath.endsWith('.json')) {
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : [];
    }
    return parseCsv(content);
}

async function listAllUsers(admin) {
    const users = [];
    let page = 1;
    const perPage = 200;

    for (;;) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
        if (error) {
            throw error;
        }

        const batch = data?.users ?? [];
        users.push(...batch);
        if (batch.length < perPage) {
            break;
        }
        page += 1;
    }

    return users;
}

function validateStudent(student) {
    if (!student.schoolEmail) {
        return 'school_email zorunlu';
    }
    if (!student.fullName) {
        return 'full_name zorunlu';
    }
    if (!student.tcKimlik || student.tcKimlik.length < 6) {
        return 'tc_kimlik gecersiz';
    }
    if (!student.departmentCode) {
        return 'department_code zorunlu';
    }
    if (!Number.isInteger(student.classLevel) || student.classLevel < 1) {
        return 'class_level gecersiz';
    }
    return null;
}

async function main() {
    loadEnvFile(path.join(process.cwd(), '.env.local'));
    loadEnvFile(path.join(process.cwd(), '.env'));

    const sourcePath = process.argv[2];
    const shouldResetPasswords = process.argv.includes('--reset-passwords');
    const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!sourcePath) {
        console.error('Usage: node scripts/import-students.mjs <students.csv|students.json> [--reset-passwords]');
        process.exit(1);
    }

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Missing SUPABASE_URL/EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
        process.exit(1);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    const dataset = await readDataset(sourcePath);
    const students = dataset.map(normalizeStudent);
    const existingUsers = await listAllUsers(admin);
    const existingUserByEmail = new Map(
        existingUsers
            .filter((user) => user.email)
            .map((user) => [String(user.email).toLowerCase(), user])
    );

    const summary = {
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
    };

    for (const student of students) {
        const validationError = validateStudent(student);
        if (validationError) {
            summary.failed += 1;
            console.error('[invalid]', student.schoolEmail || '<empty>', validationError);
            continue;
        }

        const existingUser = existingUserByEmail.get(student.schoolEmail);
        const metadata = {
            full_name: student.fullName,
            phone: student.phone,
            department_code: student.departmentCode,
            class_level: String(student.classLevel),
            faculty_name: student.facultyName,
            student_number: student.studentNumber,
            tc_last4: student.tcKimlik.slice(-4),
            is_active: String(student.isActive),
            source: 'imported',
        };

        if (existingUser) {
            const updatePayload = {
                email: student.schoolEmail,
                email_confirm: true,
                user_metadata: shouldResetPasswords
                    ? { ...metadata, must_change_password: 'true', password_changed_at: '' }
                    : metadata,
            };

            if (shouldResetPasswords) {
                updatePayload.password = student.tcKimlik;
            }

            const { error } = await admin.auth.admin.updateUserById(existingUser.id, updatePayload);
            if (error) {
                summary.failed += 1;
                console.error('[update-failed]', student.schoolEmail, error.message);
                continue;
            }

            summary.updated += 1;
            console.log('[updated]', student.schoolEmail, shouldResetPasswords ? 'password reset to TC' : 'metadata synced');
            continue;
        }

        const { data, error } = await admin.auth.admin.createUser({
            email: student.schoolEmail,
            password: student.tcKimlik,
            email_confirm: true,
            user_metadata: {
                ...metadata,
                must_change_password: 'true',
                password_changed_at: '',
            },
        });

        if (error) {
            summary.failed += 1;
            console.error('[create-failed]', student.schoolEmail, error.message);
            continue;
        }

        existingUserByEmail.set(student.schoolEmail, data.user);
        summary.created += 1;
        console.log('[created]', student.schoolEmail);
    }

    console.log('\nImport summary');
    console.log(`created=${summary.created} updated=${summary.updated} skipped=${summary.skipped} failed=${summary.failed}`);

    if (summary.failed > 0) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
