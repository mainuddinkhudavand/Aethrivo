import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logAudit } from '../utils/auditLogger.js';

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '8h' });

const sendTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = signToken(user._id, user.role);
    sendTokenCookie(res, token);
    user.lastLogin = new Date();
    await user.save();
    await logAudit({ action: 'LOGIN', entity: 'User', entityId: user._id.toString(), actor: user._id, actorEmail: user.email, actorRole: user.role, ip: req.ip, userAgent: req.get('User-Agent') });
    res.json({ success: true, data: { id: user._id, email: user.email, name: user.name, role: user.role, mustChangePassword: user.mustChangePassword } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out' });
};

export const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }
    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();
    await logAudit({ action: 'CHANGE_PASSWORD', entity: 'User', entityId: user._id.toString(), actor: user._id, actorEmail: user.email, actorRole: user.role, ip: req.ip });
    res.json({ success: true, message: 'Password changed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
