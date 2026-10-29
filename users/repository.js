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
        'SELECT id, email, password_hash, full_name, role, orders_count, last_order_at FROM users WHERE id = $1',
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

// Bumps the user's order stats once per event id.
export async function recordOrder({ eventId, userId, placedAt }) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rowCount } = await client.query(
            'INSERT INTO processed_events (event_id) VALUES ($1) ON CONFLICT DO NOTHING',
            [eventId],
        );
        if (rowCount > 0) {
            await client.query(
                'UPDATE users SET orders_count = orders_count + 1, last_order_at = GREATEST(last_order_at, $2) WHERE id = $1',
                [userId, placedAt],
            );
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}
