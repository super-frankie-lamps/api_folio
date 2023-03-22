import {Schema, model} from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    googleId: string;
    password: string;
    phone: string;
    login: string;
}

const userSchema = new Schema({
    email: String,
    password: String,
    googleId: String,
    name: String,
    phone: String,
    username: String
});

export default model<IUser>('User', userSchema);
