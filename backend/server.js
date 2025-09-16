const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config({ path: './.env' });

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const ideaRoutes = require('./routes/ideas');
const investmentRoutes = require('./routes/investments');
const userRoutes = require('./routes/users');

// Initialize Express App
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for your frontend to communicate with the backend
app.use(cors()); 
// To parse JSON bodies in requests
app.use(express.json());

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

connectDB();

// --- API Routes ---
app.get('/', (req, res) => res.send('KalaGhar API is running...')); // A test route
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/users', userRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});