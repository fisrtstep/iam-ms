import { fileURLToPath } from 'node:url';
import pool from './pool.js';
import { hashPassword } from '../auth/password.js';
import { findByEmail, createUser } from '../users/repository.js';

const SEED_USERS = [
    { email: 'alice@example.com', password: 'password123', fullName: 'Alice Customer', role: 'customer' },
    { email: 'admin@example.com', password: 'admin123', fullName: 'Ada Admin', role: 'admin' },
];

export async function seed() {
    for (const u of SEED_USERS) {
        if (await findByEmail(u.email)) continue;
        await createUser({
            email: u.email,
            passwordHash: await hashPassword(u.password),
            fullName: u.fullName,
            role: u.role,
        });
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    await seed();
    await pool.end();
    console.log('seeded');
}
