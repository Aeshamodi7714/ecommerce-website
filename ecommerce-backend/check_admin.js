const mongoose = require('mongoose');
const userModel = require('./models/user.model');
require('dotenv').config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    const adminUser = await userModel.findOne({ email: 'admin@hub.com' });
    console.log("Admin user:", adminUser);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}
checkAdmin();
