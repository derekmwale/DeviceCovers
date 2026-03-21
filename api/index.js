require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

// Initialize Express App
const app = express();

// Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    // Don't exit on Vercel - let it try to recover
  }
};

connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Session Configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Global Middleware - User Data in Views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user?.role === 'admin' || false;
  next();
});

// Routes - API
app.use('/api/auth', require('../src/routes/authRoutes'));
app.use('/api/user', require('../src/routes/userRoutes'));
app.use('/api/laptop', require('../src/routes/laptopRoutes'));
app.use('/api/plan', require('../src/routes/planRoutes'));
app.use('/api/payment', require('../src/routes/paymentRoutes'));
app.use('/api/claim', require('../src/routes/claimRoutes'));
app.use('/admin', require('../src/routes/adminRoutes'));

// Routes - Views
app.get('/', (req, res) => {
  res.render('index', { title: 'SafeTech - Laptop Insurance' });
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  if (req.session.user.role === 'admin') return res.redirect('/admin/dashboard');
  res.render('user/dashboard', { title: 'Dashboard' });
});

app.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

app.get('/add-laptop', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/add-laptop', { title: 'Add Laptop' });
});

app.get('/plans', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/plans', { title: 'Insurance Plans' });
});

app.get('/payments', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/payments', { title: 'Payments' });
});

app.get('/claims', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/claims', { title: 'Claims' });
});

app.get('/my-laptops', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/my-laptops', { title: 'My Laptops' });
});

app.get('/select-plan', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/select-plan', { title: 'Select Plan' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export for Vercel
module.exports = app;
