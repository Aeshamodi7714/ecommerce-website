const mongoose = require('mongoose');
const orderModel = require('./models/order.model');
require('dotenv').config();

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    const orders = await orderModel.find({});
    console.log("Found orders:", orders.length);
    if(orders.length > 0) {
      console.log(orders);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}
checkOrders();
