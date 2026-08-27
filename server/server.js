require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'LostLink API is running' : 'Database unavailable',
    database: dbStatus,
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LostLink API',
    version: '1.0.0',
    health: '/api/health',
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// Start server
const start = async () => {
  const dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`LostLink server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Database: ${dbConnected ? 'Connected' : 'Disconnected'}`);
  });
};

start();