// Seed Database with Sample Data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Laptop = require('../src/models/Laptop');
const InsurancePlan = require('../src/models/InsurancePlan');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Laptop.deleteMany({});
    await InsurancePlan.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const user1 = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+260123456789',
      country: 'Zambia',
      verified: true,
    });

    const user2 = new User({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+260987654321',
      country: 'Zambia',
      verified: true,
    });

    await User.create([user1, user2]);
    console.log('✅ Created sample users');

    // Create sample laptops
    const laptop1 = new Laptop({
      user: user1._id,
      brand: 'Dell',
      model: 'XPS 13',
      serialNumber: 'DL123456',
      purchaseValue: 1200,
      purchaseDate: new Date('2024-01-15'),
      condition: 'excellent',
      specs: {
        processor: 'Intel i7',
        ram: '16GB',
        storage: '512GB SSD',
        screen: '13.4" FHD',
      },
    });

    const laptop2 = new Laptop({
      user: user2._id,
      brand: 'MacBook',
      model: 'Pro 14',
      serialNumber: 'MB234567',
      purchaseValue: 1999,
      purchaseDate: new Date('2023-06-20'),
      condition: 'excellent',
      specs: {
        processor: 'Apple M2',
        ram: '16GB',
        storage: '512GB SSD',
        screen: '14" Liquid Retina',
      },
    });

    const [l1, l2] = await Laptop.create([laptop1, laptop2]);
    console.log('✅ Created sample laptops');

    // Create sample insurance plans
    const plan1 = new InsurancePlan({
      user: user1._id,
      laptop: l1._id,
      planType: 'premium',
      deviceValue: 1200,
      status: 'active',
      approvedBy: null,
      approvalDate: new Date(),
    });

    const plan2 = new InsurancePlan({
      user: user2._id,
      laptop: l2._id,
      planType: 'pro',
      deviceValue: 1999,
      status: 'pending',
    });

    await InsurancePlan.create([plan1, plan2]);
    console.log('✅ Created sample insurance plans');

    console.log('✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
