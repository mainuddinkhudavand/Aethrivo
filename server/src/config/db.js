// src/config/db.js
// Resilient MongoDB connection helper with in-memory fallback and auto-seeding
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let mongod = null;

async function seedDefaultData() {
  try {
    const User = (await import('../models/User.js')).default;
    const Vertical = (await import('../models/Vertical.js')).default;
    const Course = (await import('../models/Course.js')).default;
    const Event = (await import('../models/Event.js')).default;
    const Expert = (await import('../models/Expert.js')).default;
    const Counter = (await import('../models/Counter.js')).default;

    // Seed Counters
    const categories = [
      'Student', 'Faculty', 'Industry', 'Research Scholar',
      'Expert', 'Trainer', 'Consultant', 'Entrepreneur', 'Institution',
      'AET-STU', 'AET-FAC', 'AET-IND', 'AET-RES', 'AET-EXP', 'AET-TRN', 'AET-INS', 'AET-GEN'
    ];
    for (const cat of categories) {
      const exists = await Counter.findById(cat);
      if (!exists) await Counter.create({ _id: cat, seq: 1000 });
    }

    // Seed Admin & Manager
    const adminExists = await User.findOne({ email: 'admin@aethrivo.com' });
    if (!adminExists) {
      await User.create({
        name: 'Aethrivo Admin',
        email: 'admin@aethrivo.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
        mustChangePassword: false,
      });
      console.log('✅ Admin user created (admin@aethrivo.com)');
    }

    const managerExists = await User.findOne({ email: 'manager@aethrivo.com' });
    if (!managerExists) {
      await User.create({
        name: 'Operations Manager',
        email: 'manager@aethrivo.com',
        password: process.env.MANAGER_PASSWORD || 'Manager@123',
        role: 'manager',
        mustChangePassword: false,
      });
      console.log('✅ Manager user created (manager@aethrivo.com)');
    }

    // Seed Verticals (Sync all 7 core business verticals from revised blueprint)
    const { default: verticalsData } = await import('../seed/data/verticals.js');
    const legacySlugs = ['ipr-patents', 'ai-emerging-tech', 'corporate-training', 'research-consulting', 'incubation-startups', 'legal-compliance', 'research', 'conferences'];
    await Vertical.deleteMany({ slug: { $in: legacySlugs } });
    for (const vert of verticalsData) {
      await Vertical.findOneAndUpdate(
        { slug: vert.slug },
        vert,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✅ All 7 core business verticals synced (${verticalsData.length} total)`);

    // Seed Courses (Sync all 20 flagship starter courses from blueprint)
    const { default: coursesData } = await import('../seed/data/courses.js');
    for (const crs of coursesData) {
      await Course.findOneAndUpdate(
        { slug: crs.slug },
        crs,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✅ All 20 flagship courses synced (${coursesData.length} total)`);

    // Seed Events
    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      const initialEvents = [
        {
          title: 'Aethrivo Global IP & Deep-Tech Summit 2026',
          slug: 'aethrivo-global-ip-deep-tech-summit-2026',
          type: 'Conference',
          startDate: new Date('2026-12-15'),
          endDate: new Date('2026-12-17'),
          venue: 'Grand Convention Centre, Bengaluru & Online',
          description: 'The premier international conference uniting 500+ patent examiners, deep-tech researchers, VC partners, and university deans.',
          registrationDeadline: new Date('2026-12-05'),
          maxParticipants: 1000,
          fee: 2500,
          isActive: true,
        },
        {
          title: 'Hands-on Workshop: Building Enterprise RAG Systems',
          slug: 'workshop-building-enterprise-rag-systems',
          type: 'Workshop',
          startDate: new Date('2026-11-28'),
          endDate: new Date('2026-11-29'),
          venue: 'Virtual Interactive Classroom (Zoom)',
          description: 'An intensive two-day code-along session building hybrid vector-keyword retrieval architectures with rerankers.',
          registrationDeadline: new Date('2026-11-25'),
          maxParticipants: 150,
          fee: 1499,
          isActive: true,
        },
        {
          title: 'National Innovation & Patent Hackathon 2026',
          slug: 'national-innovation-patent-hackathon-2026',
          type: 'Hackathon',
          startDate: new Date('2026-12-01'),
          endDate: new Date('2026-12-03'),
          venue: 'Aethrivo Innovation Labs & Virtual',
          description: '36-hour challenge for student and faculty innovators to build patentable hardware & software prototypes with prizes worth ₹5,00,000.',
          registrationDeadline: new Date('2026-11-26'),
          maxParticipants: 400,
          fee: 0,
          isActive: true,
        },
      ];
      await Event.insertMany(initialEvents);
      console.log('✅ Default events seeded');
    }

    // Seed Experts
    const expertsCount = await Expert.countDocuments();
    if (expertsCount === 0) {
      const initialExperts = [
        {
          fullName: 'Dr. Rajesh V. Narayanan',
          email: 'rajesh.narayanan@aethrivo.com',
          expertiseTags: ['Patent Prosecution', 'Bio-Medical Devices', 'FTO Search'],
          languages: ['English', 'Hindi', 'Tamil'],
          mode: 'Both',
          verificationStatus: 'Verified',
          directoryOptIn: true,
          bio: 'Former USPTO patent attorney and senior IP consultant with 18+ years of experience prosecuting 300+ life sciences and medical device patents globally.',
        },
        {
          fullName: 'Prof. Ananya Sen',
          email: 'ananya.sen@aethrivo.com',
          expertiseTags: ['Generative AI', 'Deep Learning', 'Computer Vision'],
          languages: ['English', 'Bengali', 'Hindi'],
          mode: 'Online',
          verificationStatus: 'Verified',
          directoryOptIn: true,
          bio: 'AI Research Director and author of 40+ IEEE/ACM papers on neural attention models and trustworthy machine learning systems.',
        },
        {
          fullName: 'Vikramaditya Kulkarni',
          email: 'vikram.kulkarni@aethrivo.com',
          expertiseTags: ['Deep-Tech Startups', 'Venture Syndication', 'TRL Acceleration'],
          languages: ['English', 'Marathi', 'Hindi'],
          mode: 'Both',
          verificationStatus: 'Verified',
          directoryOptIn: true,
          bio: 'Serial entrepreneur and angel investor with 3 successful exits; advisor to state incubation centers and seed fund committees.',
        },
        {
          fullName: 'Adv. Meenakshi Sundaram',
          email: 'meenakshi.s@aethrivo.com',
          expertiseTags: ['IP Litigation', 'Corporate MoUs', 'Data Privacy Law'],
          languages: ['English', 'Kannada', 'Hindi'],
          mode: 'Offline',
          verificationStatus: 'Verified',
          directoryOptIn: true,
          bio: 'High Court advocate specializing in technology transfer disputes, international arbitration, and university-corporate licensing pacts.',
        },
      ];
      await Expert.insertMany(initialExperts);
      console.log('✅ Default experts seeded');
    }
  } catch (err) {
    console.warn('⚠️ Seed check error (continuing):', err.message);
  }
}

export const connectDB = async () => {
  // First, attempt to connect to the configured MONGODB_URI (e.g. Atlas)
  if (process.env.MONGODB_URI) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`🌐 MongoDB Atlas Connected: ${conn.connection.host}`);
      await seedDefaultData();
      return;
    } catch (err) {
      console.warn(`⚠️ Atlas connection failed: ${err.message}`);
      console.log('🔄 Initializing high-performance in-memory MongoDB fallback...');
    }
  }

  // Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'aethrivo',
      },
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`🚀 In-Memory MongoDB running & connected at ${uri}`);
    await seedDefaultData();
  } catch (err) {
    console.error('❌ Failed to start in-memory MongoDB:', err.message);
  }
};
