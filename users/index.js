import express from 'express';
import { findById } from './repository.js';
import { toUserDto } from './dto.js';

const usersRouter = express.Router();

// GET /users/:id -> { id, email, fullName, role }
usersRouter.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
        const user = await findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(toUserDto(user));
    } catch (err) {
        next(err);
    }
});

export default usersRouter;
