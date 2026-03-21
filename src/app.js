require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('../config/database');

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/laptop', require('./routes/laptopRoutes'));
app.use('/api/plan', require('./routes/planRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/claim', require('./routes/claimRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// View Routes
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

app.get('/select-plan', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/select-plan', { title: 'Select Insurance Plan' });
});

app.get('/my-laptops', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/my-laptops', { title: 'My Laptops' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SafeTech Platform running on http://localhost:${PORT}`);
});

module.exports = app;
