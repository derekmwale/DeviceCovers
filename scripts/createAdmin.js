// Create Admin User Script
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Connected to MongoDB');

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@safetech.com',
      password: process.env.ADMIN_PASSWORD || 'admin_secure_password',
      phone: '+1234567890',
      country: 'USA',
      role: 'admin',
      verified: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${adminUser.email}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
