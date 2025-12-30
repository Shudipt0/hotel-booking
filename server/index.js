import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';

// connect to mongoose
connectDB();

const app = express();
app.use(cors()); // Enable corss-origin resourse sharing

// middleware
app.use(express.json());
app.use(clerkMiddleware()); // clerk middleware

// Api to listen to clerk webhooks
app.use("/api/clerk", clerkMiddleware);

app.get('/', (req, res) => {
    res.send("api is working")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on pott ${PORT}`)
})

