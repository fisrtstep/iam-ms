import express from 'express';
import { findByEmail } from '../users/repository.js';
import { toUserDto } from '../users/dto.js';
import { verifyPassword } from './password.js';
import { signToken } from './token.js';

const loginRouter = express.Router();

// POST /login  { email, password } -> { token, user }
loginRouter.post('', async (req, res, next) => {
    try {
        const { email, password } = req.body ?? {};
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'email and password are required' });
        }
        const user = await findByEmail(email.toLowerCase());
        if (!user || !(await verifyPassword(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = signToken({ sub: String(user.id), role: user.role });
        res.json({ token, user: toUserDto(user) });
    } catch (err) {
        next(err);
    }
});

export default loginRouter;
