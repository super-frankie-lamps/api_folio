import mongoose from 'mongoose';

const { DB_URL = '' } = process.env;

mongoose.connect(DB_URL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export default db;
