import Counter from '../models/Counter.js';

const CATEGORY_PREFIX_MAP = {
  'Student': 'AET-STU',
  'Faculty': 'AET-FAC',
  'Industry': 'AET-IND',
  'Research Scholar': 'AET-RES',
  'Expert': 'AET-EXP',
  'Trainer': 'AET-TRN',
  'Consultant': 'AET-EXP',
  'Entrepreneur': 'AET-IND',
  'Institution': 'AET-INS',
};

export const generateMemberId = async (category) => {
  const prefix = CATEGORY_PREFIX_MAP[category] || 'AET-GEN';
  try {
    return await Counter.getNextSequence(prefix);
  } catch {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  }
};
