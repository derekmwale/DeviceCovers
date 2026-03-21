const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, country } = req.body;

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists with timeout
    let userExists;
    try {
      userExists = await User.findOne({ email }).maxTimeMS(5000);
    } catch (dbError) {
      console.error('Database query error:', dbError.message);
      // If database error, try to proceed anyway
      userExists = null;
    }

    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.getFullName(),
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({ message: error.message });
  }
};
// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists and get password field with timeout
    let user;
    try {
      user = await User.findOne({ email }).select('+password').maxTimeMS(5000);
    } catch (dbError) {
      console.error('Database query error:', dbError.message);
      return res.status(503).json({ message: 'Database temporarily unavailable, please try again' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Store in session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.getFullName(),
      role: user.role,
    };

    res.json({
      message: 'Login successful',
      token,
      user: req.session.user,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.redirect('/');
  });
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, country } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, phone, country, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId).select('+password');

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
