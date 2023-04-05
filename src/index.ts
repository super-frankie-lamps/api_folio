/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import db from './config/database';
import passport from './config/passport';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import portfolioRoutes from './routes/portfolio';
import verifyToken from './routes/verify-token';

/**
 * App Variables
 */

if (!process.env.PORT) {
    process.exit(1);
}

const app: Express = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolios', verifyToken,  portfolioRoutes);

/**
 * Server Activation
 */

db.on('open', () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});