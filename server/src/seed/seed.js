import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js'; // corrected path
import User from '../models/User.js';
import Counter from '../models/Counter.js';
import Vertical from '../models/Vertical.js';
import Course from '../models/Course.js';
import Event from '../models/Event.js';
import Member from '../models/Member.js';
import Enquiry from '../models/Enquiry.js';
import MoU from '../models/MoU.js';
import MoUActivity from '../models/MoUActivity.js';
import Task from '../models/Task.js';
import bcrypt from 'bcryptjs';
import usersData from './data/users.js';
import verticalsData from './data/verticals.js';
import coursesData from './data/courses.js';
import eventsData from './data/events.js';
import membersData from './data/members.js';
import enquiriesData from './data/enquiries.js';
import mousData from './data/mous.js';
import tasksData from './data/tasks.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    await connectDB();
    console.log('🌐 DB connected');

    // Users (admin & manager)
    await User.deleteMany({});
    for (const u of usersData) {
      const hashed = await bcrypt.hash(u.password, 12);
      await User.create({ email: u.email, password: hashed, role: u.role, mustChangePassword: true });
    }
    console.log('✅ Users seeded');

    // Counters for member IDs
    await Counter.deleteMany({});
    const categories = [
      'Student', 'Faculty', 'Industry', 'Research Scholar', 'Expert', 'Trainer', 'Consultant', 'Entrepreneur', 'Institution',
    ];
    for (const cat of categories) await Counter.create({ name: cat });
    console.log('✅ Counters seeded');

    // Core data
    await Promise.all([
      Vertical.deleteMany({}).then(() => Vertical.insertMany(verticalsData)),
      Course.deleteMany({}).then(() => Course.insertMany(coursesData)),
      Event.deleteMany({}).then(() => Event.insertMany(eventsData)),
      Member.deleteMany({}).then(() => Member.insertMany(membersData)),
      Enquiry.deleteMany({}).then(() => Enquiry.insertMany(enquiriesData)),
      MoU.deleteMany({}).then(() => MoU.insertMany(mousData.map(m => ({ ...m, owner: null })))),
      MoUActivity.deleteMany({}),
      Task.deleteMany({}).then(() => Task.insertMany(tasksData)),
    ]);
    console.log('✅ Core data seeded');

    // MoU activities linking (placeholder)
    const allMous = await MoU.find();
    // If there are activities defined inside mousData, insert them; else skip.
    if (Array.isArray(mousData.activities)) {
      for (const act of mousData.activities) {
        const mou = allMous.find(m => m.title === act.mouTitle);
        if (mou) {
          await MoUActivity.create({
            mou: mou._id,
            activity: act.activity,
            date: act.date,
            participants: act.participants,
            coordinator: null,
            outputs: act.outputs,
            evidenceLink: act.evidenceLink,
            funding: act.funding,
          });
        }
      }
    }
    console.log('✅ MoU activities seeded');

    console.log('🎉 Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error', err);
    process.exit(1);
  }
})();
