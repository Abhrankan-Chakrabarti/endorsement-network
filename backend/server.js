import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import memberRoutes from './routes/memberRoutes.js';

dotenv.config();

const app = express();

/* ---------- Middleware ---------- */
app.use(cors({
  origin: '*', // OK for hackathon / prototype
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

/* ---------- Database ---------- */
connectDB();

/* ---------- Routes ---------- */
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Jedi Endorsement Network API running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/api', memberRoutes);

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
