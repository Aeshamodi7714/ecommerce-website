/**
 * Run this script ONCE to create the admin user in MongoDB:
 * node create-admin.js
 */

const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('✅ Connected to MongoDB');

  const userModel = require('./models/user.model');

  // Remove old admin if exists
  await userModel.deleteOne({ email: 'admin@hub.com' });

  const hashed = await bcrypt.hash('1414', 10);
  const admin = await userModel.create({
    username: 'Super Admin',
    email: 'admin@hub.com',
    password: hashed,
    role: 'admin',
  });

  console.log('🎉 Admin created successfully!');
  console.log('   Email   :', admin.email);
  console.log('   Password: 1414');
  console.log('   Role    :', admin.role);
  mongoose.disconnect();
};

run().catch(err => { console.error(err); mongoose.disconnect(); });
