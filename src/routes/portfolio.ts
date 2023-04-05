import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/types';
import User from "../models/user";

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    // @ts-ignore
    const { email } = req.user;
    // @ts-ignore
    const { portfolios } = await User.findOne({ email });
    // @ts-ignore
    res.status(200).json({
        success: true,
        data:{
            portfolios
        }
    });
});

router.post('/portfolio', async (req: Request, res: Response) => {
    const { portfolio } = req.body;
    // @ts-ignore
    const { email } = req.user;
    // @ts-ignore
    const user = await User.updateOne({ email }, { $push: { portfolios: portfolio } });
    // @ts-ignore
    res.status(200).json({
        success: true,
        data:{
            user
        }
    });
});

export default router;