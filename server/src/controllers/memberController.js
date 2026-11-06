import Member from '../models/Member.js';
import Expert from '../models/Expert.js';
import { generateMemberId } from '../utils/generateMemberId.js';
import { sendVerificationEmail } from '../utils/emailService.js';
import { logAudit } from '../utils/auditLogger.js';
import crypto from 'crypto';

export const registerMember = async (req, res) => {
  try {
    const { category, email } = req.body;
    if (!category || !email) {
      return res.status(400).json({ success: false, error: 'Category and email are required', message: 'Category and email are required' });
    }

    // Check duplicate email
    const existing = await Member.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered', message: 'Email already registered' });
    }
    
    const memberId = await generateMemberId(category);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const fullName = (req.body.fullName || req.body.name || '').trim();
    if (!fullName) {
      return res.status(400).json({ success: false, error: 'Full name is required', message: 'Full name is required' });
    }

    // Clean up highestQualification if empty or not in enum
    const validQualifications = ['SSLC/10th', 'PUC/12th', 'ITI', 'Diploma', 'Undergraduate', 'Postgraduate', 'MBA/MCA', 'M.Tech/M.E.', 'M.Sc.', 'M.Phil.', 'Ph.D.', 'Postdoctoral', 'Professional qualification', 'Other'];
    let highestQualification = req.body.highestQualification;
    if (!validQualifications.includes(highestQualification)) {
      highestQualification = undefined;
    }

    // Process category fields
    const commonKeys = ['category', 'email', 'phone', 'fullName', 'name', 'address', 'city', 'state', 'country', 'highestQualification', 'designation', 'organisation', 'bio', 'linkedInUrl', 'domainExpertise', 'areasOfInterest', 'communicationPreferences'];
    const categoryFields = { ...(req.body.categoryFields || {}) };
    for (const [k, v] of Object.entries(req.body)) {
      if (!commonKeys.includes(k) && v !== undefined && v !== '') {
        categoryFields[k] = v;
      }
    }

    // Process consent safely
    let consent = req.body.consent;
    if (typeof consent === 'boolean' || typeof consent === 'string') {
      const isAccepted = Boolean(consent);
      consent = {
        terms: { accepted: isAccepted, timestamp: new Date() },
        privacy: { accepted: isAccepted, timestamp: new Date() },
        directoryOptIn: { accepted: Boolean(req.body.directoryOptIn || false), timestamp: new Date() },
      };
    }

    const memberData = {
      ...req.body,
      memberId,
      fullName,
      email: email.toLowerCase(),
      phone: req.body.phone || 'N/A',
      organisation: req.body.organisation || req.body.institution || req.body.company || '',
      highestQualification,
      categoryFields,
      consent,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      cvPath: req.file ? req.file.path : undefined,
    };

    const member = await Member.create(memberData);

    // If Expert/Trainer/Consultant, also create Expert record
    if (['Expert', 'Trainer', 'Consultant'].includes(category)) {
      const qualificationsList = member.highestQualification
        ? [member.highestQualification]
        : (req.body.qualifications ? (Array.isArray(req.body.qualifications) ? req.body.qualifications : [req.body.qualifications]) : []);
      const expertiseList = (member.domainExpertise && member.domainExpertise.length > 0)
        ? member.domainExpertise
        : (req.body.specialization ? [req.body.specialization] : []);
      const languagesList = req.body.languages ? (Array.isArray(req.body.languages) ? req.body.languages : [req.body.languages]) : [];

      await Expert.create({
        member: member._id,
        memberId: member.memberId,
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        qualifications: qualificationsList,
        expertiseTags: expertiseList,
        languages: languagesList,
        feeExpectation: req.body.feeExpectation || '',
        availability: req.body.availability || '',
        cvPath: member.cvPath,
        experience: req.body.experience || '',
        trainingTopics: req.body.trainingTopics || [],
        mode: req.body.mode || 'Both',
        directoryOptIn: Boolean(member.consent?.directoryOptIn?.accepted ?? true),
        bio: member.bio || req.body.bio || '',
      });
    }

    try {
      await sendVerificationEmail(member.email, verificationToken, member.memberId);
    } catch (emailErr) {
      console.warn('Notice: Verification email stub or delivery note:', emailErr.message);
    }
    
    res.status(201).json({
      success: true,
      data: {
        memberId: member.memberId,
        message: 'Registration successful. Please check your email to verify your account.'
      }
    });
  } catch (err) {
    console.error('Member registration error:', err);
    res.status(400).json({ success: false, error: err.message, message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token, memberId } = req.query;
    const member = await Member.findOne({ memberId, emailVerificationToken: token, emailVerificationExpires: { $gt: new Date() } });
    if (!member) return res.status(400).json({ success: false, error: 'Invalid or expired verification link' });
    member.emailVerified = true;
    member.emailVerificationToken = undefined;
    member.emailVerificationExpires = undefined;
    await member.save();
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMemberCard = async (req, res) => {
  try {
    const member = await Member.findOne({ memberId: req.params.memberId }).select('memberId fullName category status createdAt');
    if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
    res.json({ success: true, data: { memberId: member.memberId, name: member.fullName, category: member.category, status: member.status, issueDate: member.createdAt } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const listMembers = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, status, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { memberId: { $regex: search, $options: 'i' } },
    ];
    const members = await Member.find(filter)
      .select('-emailVerificationToken -emailVerificationExpires')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Member.countDocuments(filter);
    res.json({ success: true, data: members, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateMemberStatus = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
    member.status = req.body.status;
    await member.save();
    await logAudit({ action: 'UPDATE_MEMBER_STATUS', entity: 'Member', entityId: member._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, details: { newStatus: req.body.status }, ip: req.ip });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-emailVerificationToken -emailVerificationExpires');
    if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
