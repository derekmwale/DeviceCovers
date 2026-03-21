const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check if user is authenticated
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.session.user) {
    token = req.session.user.token;
  }

  if (!token && !req.session.user) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
    } catch (error) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } else if (req.session.user) {
    req.userId = req.session.user.id;
  }

  next();
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check if user exists
exports.checkUserExists = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
