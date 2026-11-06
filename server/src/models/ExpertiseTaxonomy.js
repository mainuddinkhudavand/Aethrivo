import mongoose from 'mongoose';

const expertiseTaxonomySchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true },
  skills: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('ExpertiseTaxonomy', expertiseTaxonomySchema);
