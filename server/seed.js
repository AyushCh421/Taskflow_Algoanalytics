// Run with: node seed.js
// Creates the two required test accounts (idempotent).
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const accounts = [
    { name: 'Test User', email: 'testuser@example.com', password: 'Test@1234', role: 'user' },
    { name: 'Admin User', email: 'admin@example.com', password: 'Admin@1234', role: 'admin' },
  ];

  for (const acc of accounts) {
    const exists = await User.findOne({ email: acc.email });
    if (exists) {
      console.log(`Already exists: ${acc.email}`);
    } else {
      await User.create(acc);
      console.log(`Created: ${acc.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
