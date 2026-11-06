// src/config/db.js
// Resilient MongoDB connection helper with in-memory fallback and auto-seeding
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

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

    // Seed Verticals
    const verticalsCount = await Vertical.countDocuments();
    if (verticalsCount === 0) {
      const initialVerticals = [
        {
          slug: 'ipr-patents',
          name: 'Intellectual Property Rights (IPR)',
          positioningLine: 'End-to-End Patent Filing, Trademark & IP Protection',
          description: 'Comprehensive patent search, drafting, filing, opposition, and commercialization services for inventors, researchers, and enterprises.',
          services: ['Prior Art Patent Search', 'Patent Specification Drafting', 'Trademark & Copyright Filing', 'Freedom to Operate (FTO) Search', 'IP Portfolio Management'],
          icon: 'Shield',
          accentColor: 'indigo-600',
          order: 1,
          isActive: true,
        },
        {
          slug: 'ai-emerging-tech',
          name: 'AI & Emerging Technologies',
          positioningLine: 'Next-Gen Intelligence, Deep Learning & Enterprise Solutions',
          description: 'Custom AI solutions, machine learning architecture, generative AI pilots, and advanced algorithmic consulting.',
          services: ['Generative AI Implementation', 'Custom LLM Fine-Tuning', 'Computer Vision Pipelines', 'AI Governance & Compliance'],
          icon: 'Cpu',
          accentColor: 'cyan-500',
          order: 2,
          isActive: true,
        },
        {
          slug: 'corporate-training',
          name: 'Corporate & Executive Training',
          positioningLine: 'Industry-Aligned Upskilling & Leadership Programs',
          description: 'Bespoke corporate workshops, technology immersion bootcamps, and executive certifications led by verified industry veterans.',
          services: ['Executive Technology Strategy', 'Full-Stack Developer Bootcamps', 'Data Science for Leaders', 'Agile & DevOps Transformation'],
          icon: 'GraduationCap',
          accentColor: 'violet-600',
          order: 3,
          isActive: true,
        },
        {
          slug: 'research-consulting',
          name: 'Research & Innovation Consulting',
          positioningLine: 'Bridging Academic Discovery with Commercial Viability',
          description: 'Assisting research institutions and scholars with high-impact publications, grant proposals, industry technology transfer, and prototype validation.',
          services: ['Grant Proposal Writing', 'Tech Transfer & Licensing', 'Joint R&D Consortia', 'Proof-of-Concept Acceleration'],
          icon: 'FlaskConical',
          accentColor: 'amber-500',
          order: 4,
          isActive: true,
        },
        {
          slug: 'incubation-startups',
          name: 'Startup Incubation & Entrepreneurship',
          positioningLine: 'Venture Building, Mentorship & Investor Readiness',
          description: 'Dedicated incubation support for deep-tech and student startups, including pitch deck coaching, seed syndication, and MVP development.',
          services: ['MVP Architecture Sprint', 'Pitch Deck & Financial Modeling', 'Investor Matching', 'Legal & Regulatory Incorporation'],
          icon: 'Lightbulb',
          accentColor: 'emerald-600',
          order: 5,
          isActive: true,
        },
        {
          slug: 'legal-compliance',
          name: 'Legal & Institutional Compliance',
          positioningLine: 'Regulatory Assurance, MoU Structuring & Governance',
          description: 'Drafting cross-institutional MoUs, non-disclosure agreements, data privacy audits, and institutional policy frameworks.',
          services: ['Bilateral MoU Drafting', 'Data Protection & GDPR Audits', 'Contract Lifecycle Management', 'University Governance Advisory'],
          icon: 'FileText',
          accentColor: 'pink-600',
          order: 6,
          isActive: true,
        },
      ];
      await Vertical.insertMany(initialVerticals);
      console.log('✅ Default verticals seeded');
    }

    // Seed Courses
    const coursesCount = await Course.countDocuments();
    if (coursesCount === 0) {
      const initialCourses = [
        {
          title: 'Patent Drafting & Global Prosecution Mastery',
          slug: 'patent-drafting-global-prosecution',
          category: 'IPR & Law',
          duration: '8 Weeks',
          level: 'Intermediate',
          mode: 'Online',
          fee: '14,999',
          description: 'Learn professional patent drafting according to USPTO, EPO, and Indian Patent Office guidelines from registered patent attorneys.',
          syllabus: [
            { module: 'Module 1: Fundamentals of Patent Law', topics: ['Patentability criteria', 'Prior art searching', 'Novelty analysis'] },
            { module: 'Module 2: Patent Drafting & Claims', topics: ['Independent vs dependent claims', 'Specification drafting', 'Drawings & abstract'] },
            { module: 'Module 3: Prosecution & Filing', topics: ['Filing provisional & complete specs', 'First Examination Reports (FER)', 'International PCT filing'] },
          ],
          prerequisites: ['Basic scientific, engineering, or legal background'],
          outcomes: ['Draft complete patent specifications independently', 'Formulate defensible claim structures', 'Respond to patent examination reports'],
          order: 1,
          isActive: true,
        },
        {
          title: 'Generative AI Engineering & LLM Architecture',
          slug: 'generative-ai-engineering-llm-architecture',
          category: 'AI & Tech',
          duration: '10 Weeks',
          level: 'Advanced',
          mode: 'Hybrid',
          fee: '24,999',
          description: 'Hands-on deep dive into transformer architectures, RAG systems, vector embeddings, fine-tuning, and production deployment of autonomous agents.',
          syllabus: [
            { module: 'Module 1: Transformer Foundations', topics: ['Self-attention mechanics', 'Positional embeddings', 'Tokenization'] },
            { module: 'Module 2: RAG & Vector DBs', topics: ['Hybrid search', 'Chunking strategies', 'Rerankers and semantic caching'] },
            { module: 'Module 3: Fine-Tuning & Multi-Agent', topics: ['LoRA & QLoRA fine-tuning', 'Autonomous agent loops', 'Evaluations & guardrails'] },
          ],
          prerequisites: ['Proficiency in Python', 'Fundamentals of machine learning'],
          outcomes: ['Deploy production-grade RAG systems', 'Fine-tune open-weight LLMs on proprietary datasets', 'Architect autonomous multi-agent pipelines'],
          order: 2,
          isActive: true,
        },
        {
          title: 'Technology Commercialization & Venture Creation',
          slug: 'technology-commercialization-venture-creation',
          category: 'Entrepreneurship',
          duration: '6 Weeks',
          level: 'Beginner',
          mode: 'Online',
          fee: '9,999',
          description: 'A practical roadmap for translating lab research and patented prototypes into viable, venture-backed tech startups.',
          syllabus: [
            { module: 'Module 1: Lab to Market', topics: ['Technology Readiness Levels (TRL)', 'Market sizing & TAM/SAM/SOM', 'IP licensing models'] },
            { module: 'Module 2: Venture Building', topics: ['Unit economics', 'Cap table design', 'Venture capital pitching'] },
          ],
          prerequisites: ['Open to all researchers, founders, and students'],
          outcomes: ['Formulate viable commercialization strategies', 'Build financial models and investor decks', 'Navigate university spinout licensing'],
          order: 3,
          isActive: true,
        },
      ];
      await Course.insertMany(initialCourses);
      console.log('✅ Default courses seeded');
    }

    // Seed Events
    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      const initialEvents = [
        {
          title: 'AETHRIVO Global IP & Deep-Tech Summit 2026',
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
