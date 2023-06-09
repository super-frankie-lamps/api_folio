import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/types';

const router = express.Router();

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req: Request, res: Response) => {
        const token = jwt.sign({ sub: req.user!.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.redirect(`/dashboard?token=${token}`);
    }
);

export default router;
