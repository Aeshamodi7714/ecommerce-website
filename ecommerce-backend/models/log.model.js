const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  eventType: { type: String, enum: ['security', 'inventory', 'finance', 'system'], required: true },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  ipAddress: { type: String, default: '127.0.0.1' },
  details: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
