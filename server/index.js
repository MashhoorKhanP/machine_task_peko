import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import db from './config/db.cjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;


(async () => {
  try {
    await db.authenticate();
    console.log('Database connected!');

    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/', userRouter);
    app.use('/admin', adminRouter);

    const server = app.listen(PORT, () => {
      console.log(`Server started on port http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
    });

  } catch (err) {
    console.error('Error initializing server:', err);
  }
})();