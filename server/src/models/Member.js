import mongoose from 'mongoose';

const consentSchema = new mongoose.Schema({
  terms: { accepted: Boolean, timestamp: Date },
  privacy: { accepted: Boolean, timestamp: Date },
  directoryOptIn: { accepted: { type: Boolean, default: false }, timestamp: Date },
  marketing: { accepted: { type: Boolean, default: false }, timestamp: Date },
}, { _id: false });

const memberSchema = new mongoose.Schema({
  memberId: { type: String, unique: true, immutable: true, index: true },
  category: { type: String, enum: ['Student', 'Faculty', 'Industry', 'Research Scholar', 'Expert', 'Trainer', 'Consultant', 'Entrepreneur', 'Institution'], required: true },
  status: { type: String, enum: ['Submitted', 'Under Review', 'Active', 'Rejected', 'Suspended', 'Closed'], default: 'Submitted' },

  // Common fields
  fullName: { type: String, required: true, trim: true },
  dateOfBirth: Date,
  highestQualification: { type: String, enum: ['SSLC/10th', 'PUC/12th', 'ITI', 'Diploma', 'Undergraduate', 'Postgraduate', 'MBA/MCA', 'M.Tech/M.E.', 'M.Sc.', 'M.Phil.', 'Ph.D.', 'Postdoctoral', 'Professional qualification', 'Other'] },
  email: { type: String, required: true, lowercase: true, trim: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  phone: { type: String, required: true },
  countryCode: { type: String, default: '+91' },
  designation: String,
  organisation: String,
  domainExpertise: [String],
  country: String,
  nationality: String,
  state: String,
  city: String,
  bio: String,
  linkedInUrl: String,
  areasOfInterest: [String],
  communicationPreferences: { type: [String], default: ['email'] },

  // Category-specific fields
  categoryFields: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Consent
  consent: consentSchema,

  // CV upload for Expert/Trainer/Consultant
  cvPath: String,
}, { timestamps: true });

memberSchema.index({ email: 1 });
memberSchema.index({ category: 1, status: 1 });

export default mongoose.model('Member', memberSchema);
