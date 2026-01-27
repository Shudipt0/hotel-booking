import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/db.js';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import bookingRouter from './routes/bookingRoute.js';
import hotelRouter from './routes/hotelRoute.js';
import roomRouter from './routes/roomRoute.js';
import userRouter from './routes/userRoute.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

// connect to mongoose
await connectDB();
connectCloudinary();

const app = express();
app.use(cors()); // Enable corss-origin resourse sharing

// Clerk webhook MUST use raw body
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// Api to listen to stripe webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// middleware
app.use(express.json());
app.use(clerkMiddleware()); // clerk middleware

// Api to listen to clerk webhooks
// app.use("/api/clerk", clerkWebhooks);


app.get('/', (req, res) => {
    res.send("api is working")
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/hotels', hotelRouter)
app.use('/api/v1/rooms', roomRouter)
app.use('/api/v1/bookings', bookingRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on pott ${PORT}`)
})
