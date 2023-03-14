import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { OAuth2Client } from 'google-auth-library';

class UserController {
    public async register(req: Request, res: Response): Promise<void> {
        const { email, password, name, phone, login } = req.body;

        const existingUser = await
            User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            phone,
            login
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            // @ts-ignore
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token, userId: newUser.id });
    }

    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            // @ts-ignore
            existingUser.password
        );

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            // @ts-ignore
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, userId: existingUser.id });
    }

    public async googleLogin(req: Request, res: Response): Promise<void> {
        const { tokenId } = req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const googleUser = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        // @ts-ignore
        const { email, name } = googleUser.getPayload();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const token = jwt.sign(
                { userId: existingUser.id, email: existingUser.email },
                // @ts-ignore
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token, userId: existingUser.id });
            return;
        }

        const newUser = new User({
            email,
            name,
            googleId: googleUser.getUserId()
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            // @ts-ignore
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token, userId: newUser.id });
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        const users = await User.find().select('-password');res.status(200).json(users);
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;const user = await User.findById(id).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { email, password, name, phone, login } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.id !== id) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const userToUpdate = await User.findByIdAndUpdate(
            id,
            {
                email,
                password: hashedPassword,
                name,
                phone,
                login
            },
            { new: true }
        );

        if (!userToUpdate) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(userToUpdate);
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(deletedUser);
    }
}

export default UserController;