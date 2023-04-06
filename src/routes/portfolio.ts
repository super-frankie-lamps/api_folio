import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/types';
import User from "../models/user";

const router = express.Router();

/**
 * @swagger
 * /api/portfolios:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Get a list of portfolios.
 *     description: Retrieve a list of portfolios belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of portfolios belonging to the authenticated user.
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: object
 *               properties:
 *                 portfolios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       stocks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             ticker:
 *                               type: string
 *                             shares:
 *                               type: number
 *                             avgPrice:
 *                               type: number
 *       401:
 *         description: Unauthorized request.
 *       500:
 *         description: Internal server error.
 */

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

/**
 * @swagger
 * /api/portfolios/portfolio:
 *   post:
 *     tags:
 *       - Portfolio
 *     summary: Add a new portfolio.
 *     description: Add a new portfolio for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: portfolio
 *         in: body
 *         description: Portfolio object to be added.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             stocks:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ticker:
 *                     type: string
 *                   shares:
 *                     type: number
 *                   avgPrice:
 *                     type: number
 *     responses:
 *       200:
 *         description: Portfolio added successfully.
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     n:
 *                       type: number
 *                     nModified:
 *                       type: number
 *                     ok:
 *                       type: number
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized request.
 *       500:
 *         description: Internal server error.
 */

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

/**
 * @swagger
 *
 * /api/portfolios/{id}:
 *   put:
 *     tags:
 *       - Portfolio
 *     summary: Update a portfolio
 *     description: Update a portfolio by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the portfolio to update
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: An authorization token in the format `Bearer <token>`
 *     requestBody:
 *       description: The updated portfolio object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated portfolio object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     portfolio:
 *                       $ref: '#/components/schemas/Portfolio'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Portfolio not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.put('/:portfolioId', async (req: Request, res: Response) => {
    console.log('HERE!!!')
    try {
        const { portfolioId: id } = req.params;
        // @ts-ignore
        const { email } = req.user;
        const { title, description, image } = req.body;

        if (!id || !title) {
            return res.status(400).json({ message: 'Portfolio ID and title are required' });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const portfolio = user.portfolios.find((p: any) => {
            console.log('HERE', p._id.toString())
            return p._id.toString() === id
        });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        if (title) {
            portfolio.title = title;
        }

        if (description) {
            portfolio.description = description;
        }

        if (image) {
            portfolio.image = image;
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                portfolio,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;