import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import todoRoute from './routes/todo.js'
const app = express();
dotenv.config();

//middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/todo', todoRoute);

//Error handling
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong';
    return res.status(500).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

const uri = process.env.MONGO_DB;
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running in port: ${port}`);
});

mongoose
    .connect(uri)
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => console.log(err));