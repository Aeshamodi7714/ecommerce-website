const mongoose = require("mongoose");

let OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    { productId: String, name: String, image: String, quantity: Number, price: Number, total: Number },
  ],
  totalbill: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
    default: "pending",
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentId: String,
  trackingNumber: String,
  carrier: String,
  shippingStatus: { type: String, default: 'pending' },
  returnRequest: {
    isRequested: { type: Boolean, default: false },
    reason: String,
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    requestDate: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("order", OrderSchema);
