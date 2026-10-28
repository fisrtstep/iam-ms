import express from 'express';
import { verifyToken } from './token.js';

const verifyRouter = express.Router();

// POST /auth/verify  { token } -> { valid, userId, role }
// Called by other services to check a bearer token.
verifyRouter.post('/verify', (req, res) => {
    const { token } = req.body ?? {};
    try {
        const payload = verifyToken(token);
        res.json({ valid: true, userId: Number(payload.sub), role: payload.role });
    } catch {
        res.status(401).json({ valid: false });
    }
});

export default verifyRouter;
