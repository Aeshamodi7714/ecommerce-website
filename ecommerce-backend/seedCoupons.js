const mongoose = require('mongoose');
const Coupon = require('./models/coupon.model');
require('dotenv').config();

const coupons = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 50,
    expiry: new Date('2024-12-31'),
    isActive: true
  },
  {
    code: 'FLAT50',
    type: 'fixed',
    value: 50,
    minOrder: 500,
    expiry: new Date('2024-12-31'),
    isActive: true
  },
  {
    code: 'SUMMER24',
    type: 'percentage',
    value: 20,
    minOrder: 100,
    expiry: new Date('2024-12-31'),
    isActive: true
  }
];

const seedCoupons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/electrohub");
    console.log('Connected to MongoDB');

    await Coupon.deleteMany();
    await Coupon.insertMany(coupons);

    console.log('Coupons seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
};

seedCoupons();
