const mongoose = require('mongoose');
const User = require('../models/User');
const Soil = require('../models/Soil');
const Recommendation = require('../models/Recommendation');

const seedDatabase = async () => {
  try {
    // Seed Admin users
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('🌱 Seeding admin users...');
      await User.create([
        {
          name: 'shiv',
          email: 'shiv@admin.local',
          password: 'shiv@123',
          role: 'admin'
        },
        {
          name: 'ujjawal',
          email: 'ujjawal@admin.local',
          password: 'ujjawal@123',
          role: 'admin'
        }
      ]);
      console.log('✅ Admin users seeded successfully.');
    }

    // Repair historical users that do not have a role (e.g. registered before role was added)
    console.log('🔧 Repairing missing roles for pre-existing database accounts...');
    await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user', isActive: true } }
    );

    // Seed missing sample farmer users
    const sampleUsers = [
      {
        name: 'Rajesh Patel',
        email: 'rajesh@farms.com',
        password: 'password123',
        location: 'Gujarat',
        phone: '+91 98765 43210',
        farmSize: '12 Acres',
        role: 'user',
        isActive: true
      },
      {
        name: 'Srinivas Rao',
        email: 'srinivas@fields.org',
        password: 'password123',
        location: 'Andhra Pradesh',
        phone: '+91 99887 76655',
        farmSize: '8 Acres',
        role: 'user',
        isActive: true
      },
      {
        name: 'Gurpreet Singh',
        email: 'gurpreet@agro.net',
        password: 'password123',
        location: 'Punjab',
        phone: '+91 91234 56789',
        farmSize: '24 Acres',
        role: 'user',
        isActive: true
      },
      {
        name: 'Ananya Sharma',
        email: 'ananya@sharma.in',
        password: 'password123',
        location: 'Uttar Pradesh',
        phone: '+91 90123 45678',
        farmSize: '5 Acres',
        role: 'user',
        isActive: true
      },
      {
        name: 'Devendra Verma',
        email: 'devendra@crops.com',
        password: 'password123',
        location: 'Madhya Pradesh',
        phone: '+91 98989 89898',
        farmSize: '15 Acres',
        role: 'user',
        isActive: true
      }
    ];

    for (const sample of sampleUsers) {
      const exists = await User.findOne({ email: sample.email });
      if (!exists) {
        console.log(`🌱 Seeding sample user: ${sample.name}...`);
        await User.create(sample);
      }
    }

    // Seed Sample Soil and Recommendation Data per farmer
    const farmers = await User.find({ role: 'user' });
    for (const farmer of farmers) {
      const hasSoil = await Soil.findOne({ userId: farmer._id });
      if (!hasSoil) {
        console.log(`🌱 Seeding sample soil and recommendations for ${farmer.name}...`);
        const soil = await Soil.create({
          userId: farmer._id,
          soilType: farmer.name === 'Rajesh Patel' ? 'Alluvial' : 'Loamy',
          ph: 6.5,
          nitrogen: 65,
          phosphorus: 45,
          potassium: 120,
          moisture: 50,
          landArea: parseFloat(farmer.farmSize) || 10,
          season: 'Kharif'
        });

        await Recommendation.create({
          userId: farmer._id,
          soilId: soil._id,
          crops: [
            {
              cropName: 'Maize',
              cropImage: '🌽',
              score: 85,
              fertilizer: 'Add nitrogen-rich fertilizer (Urea) - deficit: 55mg/kg',
              waterRequirement: 'Moderate (500-800 mm)',
              expectedYield: '5-8 tonnes/hectare',
              growingDuration: '90-120 days',
              reason: 'Alluvial soil is compatible. Optimal pH range matches. NPK levels are moderate.'
            },
            {
              cropName: 'Rice',
              cropImage: '🌾',
              score: 75,
              fertilizer: 'Add nitrogen-rich fertilizer (Urea) - deficit: 15mg/kg',
              waterRequirement: 'High (1200-1600 mm)',
              expectedYield: '4-6 tonnes/hectare',
              growingDuration: '120-150 days',
              reason: 'Alluvial soil is ideal. Optimal pH matches. Moisture levels are acceptable.'
            }
          ],
          city: farmer.location || 'Mumbai',
          weatherData: {
            temp: 28,
            humidity: 75,
            rainfall: 12,
            windSpeed: 4.5
          }
        });
      }
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};

/**
 * Connect to MongoDB using Mongoose.
 * Uses MONGO_URI from environment variables.
 * Exits process on connection failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
