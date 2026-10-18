const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Lab = require('../models/Lab');
const Equipment = require('../models/Equipment');

const labsData = [
  { name: 'Lab 102', wing: 'SOET Wing' },
  { name: 'Lab 201', wing: 'SOET Wing' },
  { name: 'Lab 204', wing: 'MakerSpace' },
  { name: 'Lab 105', wing: 'Robotics' },
  { name: 'Lab 108', wing: 'IoT Lab' }
];

const equipmentData = [
  { name: 'Digital Oscilloscope 50MHz', equipmentId: 'EQ-OSC-102', labName: 'Lab 102', status: 'available' },
  { name: 'Ender 3 V2 3D Printer', equipmentId: 'EQ-3D-204', labName: 'Lab 204', status: 'available' },
  { name: 'Arduino Mega Starter Kit', equipmentId: 'EQ-ARD-105', labName: 'Lab 105', status: 'maintenance' },
  { name: 'Function Generator 10MHz', equipmentId: 'EQ-FGEN-102', labName: 'Lab 102', status: 'available' },
  { name: 'Raspberry Pi 4 Model B', equipmentId: 'EQ-RPI-108', labName: 'Lab 108', status: 'available' },
  { name: 'Digital Soldering Station', equipmentId: 'EQ-SLD-201', labName: 'Lab 201', status: 'available' }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bmu-labspace';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Admin creation
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await User.findOneAndUpdate(
      { email: 'admin@bmu.edu.in' },
      {
        name: 'Lab Admin',
        email: 'admin@bmu.edu.in',
        passwordHash: adminPasswordHash,
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    console.log('Admin user seeded');

    // Labs creation
    const labDocs = {};
    for (const lab of labsData) {
      const createdLab = await Lab.findOneAndUpdate(
        { name: lab.name },
        { name: lab.name, wing: lab.wing },
        { upsert: true, new: true }
      );
      labDocs[lab.name] = createdLab._id;
    }
    console.log('Labs seeded');

    // Equipment creation
    for (const eq of equipmentData) {
      await Equipment.findOneAndUpdate(
        { equipmentId: eq.equipmentId },
        {
          name: eq.name,
          equipmentId: eq.equipmentId,
          lab: labDocs[eq.labName],
          status: eq.status
        },
        { upsert: true, new: true }
      );
    }
    console.log('Equipment seeded');

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
