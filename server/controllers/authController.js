const User = require('../models/User');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');
const { generateToken } = require('../middleware/auth');

// @desc  Send OTP for registration
// @route POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Remove existing OTP for this email if any
  await Otp.deleteMany({ email });

  await Otp.create({ email, otp });

  const html = `
    <h1>Verify Your Email</h1>
    <p>Your OTP for Supreme Pickles registration is <strong>${otp}</strong>.</p>
    <p>This OTP is valid for 5 minutes.</p>
  `;

  await sendEmail({
    email,
    subject: 'Supreme Pickles - Email Verification OTP',
    html
  });

  res.status(200).json({ success: true, message: 'OTP sent successfully' });
};

// @desc  Register user
// @route POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, phone, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: 'OTP is required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  const user = await User.create({ name, email, password, phone });
  
  // Delete the OTP as it's been successfully used
  await Otp.deleteMany({ email });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
};

// @desc  Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
};

// @desc  Get current user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
