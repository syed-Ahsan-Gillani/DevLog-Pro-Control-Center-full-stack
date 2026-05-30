import express from 'express';
import dotenv from 'dotenv';
import logRoutes from './routes/logRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Standard CORS Setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Heavy-Duty Custom CORS Overrides (Fixes Chrome Blocks)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Link your API route doors
app.use('/api/logs', logRoutes);

// Base health check route
app.get('/', (req, res) => {
    res.send('Server is alive!');
});

// Start listening
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is officially LIVE and running on http://localhost:${PORT}`);
    console.log('⏳ Keeping process alive. Listening for requests...');
});