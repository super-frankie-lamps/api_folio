import { Schema, model } from 'mongoose';
import { IPortfolio, portfolioSchema } from './portfolio';

interface IUser extends Document {
    email: string;
    googleId: string;
    password: string;
    portfolios: IPortfolio[]
}

const userSchema = new Schema({
    email: String,
    password: String,
    googleId: String,
    portfolios: [portfolioSchema]
});

export default model<IUser>('User', userSchema);
