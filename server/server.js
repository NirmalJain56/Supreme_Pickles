require('dotenv').config();
require('express-async-errors');

const cron = require('node-cron');
const https = require('https');
const http = require('http');

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payment');
const contactRoutes = require('./routes/contact');

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, clientUrl + '/'], // Allow both with and without trailing slash just in case
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api', limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (product images)
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Supreme Pickles API is running 🥒', env: process.env.NODE_ENV });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Supreme Pickles Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: ${process.env.MONGO_URI}\n`);

  // ─── Keep-Alive Cron Job (Render Free Tier) ───────────────────────────────
  // Render ke free tier mein backend 15 min inactivity ke baad pause ho jata hai.
  // Yeh cron job har 14 minutes pe apne health endpoint ko ping karta hai taaki
  // backend hamesha active rahe.
  const RENDER_URL = process.env.RENDER_URL;

  if (RENDER_URL) {
    // Every 14 minutes  →  cron: '*/14 * * * *'
    cron.schedule('*/14 * * * *', () => {
      const pingUrl = `${RENDER_URL}/api/health`;
      const client = pingUrl.startsWith('https') ? https : http;

      const req = client.get(pingUrl, (res) => {
        console.log(`[Keep-Alive] ✅ Pinged ${pingUrl} — Status: ${res.statusCode}`);
      });

      req.on('error', (err) => {
        console.error(`[Keep-Alive] ❌ Ping failed: ${err.message}`);
      });

      req.end();
    });

    console.log(`⏰ Keep-Alive cron job started — pinging every 14 minutes`);
    console.log(`🌐 Render URL: ${RENDER_URL}\n`);
  } else {
    console.log(`ℹ️  RENDER_URL not set — Keep-Alive cron job skipped (local dev mode)\n`);
  }
  // ─────────────────────────────────────────────────────────────────────────
});
