const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  equipmentId: { type: String, required: true, unique: true, uppercase: true, trim: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  status: { type: String, enum: ['available', 'maintenance'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
