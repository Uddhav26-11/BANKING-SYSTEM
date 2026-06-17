require('dotenv').config();

const connectDB = require('./src/config/database');
const User = require('./src/models/User');

const seedManager = async () => {
  try {
    await connectDB();

    const existingManager = await User.findOne({
      email: 'uddhavchourasiya123@gmail.com',
    });

    if (existingManager) {
      console.log('⚠️ Manager already exists.');
      console.log(
        'Email:',
        existingManager.email
      );

      process.exit(0);
    }

    const manager = await User.create({
      fullName: 'Main Manager',

      email:
        'uddhavchourasiya123@gmail.com',

      password: 'Uddhav@123',

      role: 'manager',
    });

    console.log(
      '✅ Manager created successfully.'
    );

    console.log(
      'Email:',
      manager.email
    );

    console.log(
      'Password: Uddhav@123'
    );

    process.exit(0);
  } catch (error) {
    console.error(
      '❌ Error seeding manager:',
      error
    );

    process.exit(1);
  }
};

seedManager();