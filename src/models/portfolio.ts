import { Schema } from 'mongoose';

export interface IPortfolio extends Document {
    title: string
}

export const portfolioSchema = new Schema({
    title: String
});
