/**
 * Required External Modules
 */

import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import db from './config/database';
import passport from './config/passport';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import portfolioRoutes from './routes/portfolio';
import verifyToken from './routes/verify-token';
import setupSwagger from './swaggerOptions';

/**
 * App Variables
 */

if (!process.env.PORT) {
    process.exit(1);
}

const app: Express = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolios', verifyToken,  portfolioRoutes);

setupSwagger(app);

/**
 * Server Activation
 */

db.on('open', () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});