import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import memberRoutes from './routes/memberRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(json());

// Connect to Database
connectDB();

// Routes
app.use('/api', memberRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});