import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'AET-STU', 'AET-FAC'
  seq: { type: Number, default: 0 },
});

counterSchema.statics.getNextSequence = async function(prefix) {
  const counter = await this.findByIdAndUpdate(
    prefix,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `${prefix}-${String(counter.seq).padStart(6, '0')}`;
};

export default mongoose.model('Counter', counterSchema);
