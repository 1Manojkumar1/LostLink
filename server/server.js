require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const authLimiter = require('./middleware/rateLimiter');
const globalErrorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: isProduction ? 'none' : 'lax',
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);

app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'LostLink API is running' : 'Database unavailable',
    database: dbStatus,
  });
});

if (isProduction) {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'LostLink API',
      version: '1.0.0',
      health: '/api/health',
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });
}

app.use(globalErrorHandler);

const start = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.error('Failed to connect to MongoDB. Exiting.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`LostLink server running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

start();