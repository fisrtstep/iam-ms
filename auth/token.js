import { createHmac, timingSafeEqual } from 'node:crypto';

// Minimal HS256 JWT. Kept dependency-free on purpose.
const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');

function secret() {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
    return process.env.JWT_SECRET;
}

function signature(data) {
    return createHmac('sha256', secret()).update(data).digest();
}

export function signToken(claims, expiresInSeconds = 3600) {
    const now = Math.floor(Date.now() / 1000);
    const head = encode({ alg: 'HS256', typ: 'JWT' });
    const body = encode({ ...claims, iat: now, exp: now + expiresInSeconds });
    return `${head}.${body}.${signature(`${head}.${body}`).toString('base64url')}`;
}

export function verifyToken(token) {
    const parts = String(token).split('.');
    if (parts.length !== 3) throw new Error('malformed token');
    const expected = signature(`${parts[0]}.${parts[1]}`);
    const actual = Buffer.from(parts[2], 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
        throw new Error('bad signature');
    }
    const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (claims.exp < Math.floor(Date.now() / 1000)) throw new Error('token expired');
    return claims;
}
