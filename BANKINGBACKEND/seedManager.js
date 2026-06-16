require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('./src/config/database');
const User = require('./src/models/User');

const seedManager = async () => {
  try {
    await connectDB();

    const existingManager = await User.findOne({
      email: 'manager@bandhan.com',
    });

    if (existingManager) {
      console.log('⚠️ Manager already exists.');
      process.exit(0);
    }

    const manager = await User.create({
      fullName: 'Main Manager',
      email: 'manager@bandhan.com',
      password: 'Manager@123',
      role: 'manager',
    });

    console.log('✅ Manager created successfully.');
    console.log('Email:', manager.email);
    console.log('Password: Manager@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding manager:', error);
    process.exit(1);
  }
};

seedManager();