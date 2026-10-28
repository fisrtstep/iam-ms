import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);

export async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const key = await scrypt(password, salt, 64);
    return `${salt}:${key.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
    const [salt, hash] = stored.split(':');
    const expected = Buffer.from(hash, 'hex');
    const key = await scrypt(password, salt, expected.length);
    return timingSafeEqual(key, expected);
}
