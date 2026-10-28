import pool from '../db/pool.js';

export async function findByEmail(email) {
    const { rows } = await pool.query(
        'SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1',
        [email],
    );
    return rows[0] ?? null;
}

export async function findById(id) {
    const { rows } = await pool.query(
        'SELECT id, email, password_hash, full_name, role FROM users WHERE id = $1',
        [id],
    );
    return rows[0] ?? null;
}

export async function createUser({ email, passwordHash, fullName, role = 'customer' }) {
    const { rows } = await pool.query(
        'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, password_hash, full_name, role',
        [email, passwordHash, fullName, role],
    );
    return rows[0];
}
