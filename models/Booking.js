const mongoose = require('mongoose');
const { SLOTS } = require('../config/constants');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  slot: { type: String, required: true, enum: SLOTS },
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

bookingSchema.index(
  { equipment: 1, date: 1, slot: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

module.exports = mongoose.model('Booking', bookingSchema);
