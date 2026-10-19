const mongoose = require('mongoose');
const { WINGS } = require('../config/constants');

const labSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  wing: { type: String, required: true, enum: WINGS }
});

module.exports = mongoose.model('Lab', labSchema);
