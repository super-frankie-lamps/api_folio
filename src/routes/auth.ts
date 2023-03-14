import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/types';

const router = express.Router();

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign({ sub: req.user!.id }, JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.redirect(`/dashboard?token=${token}`);
    }
);

export default router;
