import { Schema } from 'mongoose';

export interface IPortfolio extends Document {
    title: string,
    description?: string,
    image?: string
}

export const portfolioSchema = new Schema({
    title: String,
    description: String,
    image: String
});
