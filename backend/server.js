const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: './.env' });

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const ideaRoutes = require('./routes/ideas');
const investmentRoutes = require('./routes/investments');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');

const app = express();

// Trust proxy (Cloud Run is behind Google’s proxy)
app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: '*', // change to specific frontend URL if you need credentials
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// Mongo connect (don’t block server start)
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Routes
app.get('/', (req, res) => res.send('KalaGhar API is running...'));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Start server
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});