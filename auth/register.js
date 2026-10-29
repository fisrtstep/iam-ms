import express from 'express';
import { findByEmail, createUser } from '../users/repository.js';
import { toUserDto } from '../users/dto.js';
import { publish } from '../lib/events.js';
import { hashPassword } from './password.js';
import { signToken } from './token.js';

const registerRouter = express.Router();

// POST /register  { email, password, fullName } -> 201 { token, user }
// Publishes `user.registered`.
registerRouter.post('', async (req, res, next) => {
    try {
        const { email, password, fullName } = req.body ?? {};
        if (typeof email !== 'string' || typeof password !== 'string' || typeof fullName !== 'string' || password.length < 8) {
            return res.status(400).json({ error: 'email, fullName and a password of at least 8 characters are required' });
        }
        if (await findByEmail(email.toLowerCase())) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        const user = await createUser({
            email: email.toLowerCase(),
            passwordHash: await hashPassword(password),
            fullName,
        });
        const dto = toUserDto(user);
        await publish('user.registered', { id: dto.id, email: dto.email, fullName: dto.fullName, role: dto.role });
        const token = signToken({ sub: String(user.id), role: user.role });
        res.status(201).json({ token, user: dto });
    } catch (err) {
        next(err);
    }
});

export default registerRouter;
