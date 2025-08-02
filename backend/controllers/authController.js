const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const errorHandler = require('../utils/errorHandler');

exports.register = async (req, res) => {
  try {
    const { email, password, name, role, company } = req.body;
    
    // Validate company email for recruiters
    if (role === 'recruiter') {
      const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
      const emailDomain = email.split('@')[1];

      if (!company) {
        return errorHandler(res, 400, 'Company name is required for recruiters');
      }

      if (!emailDomain || freeEmailDomains.includes(emailDomain)) {
        return errorHandler(res, 400, 'Recruiters must use a company email address');
      }
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return errorHandler(res, 400, 'Email already registered');
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      return errorHandler(res, 400, 'Password must be at least 6 characters long and contain at least one uppercase letter and one special character');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (password validation happens automatically via model)
    const user = await User.create({
      email,
      password,
      name,
      role: role || 'job_seeker',
      company: role === 'recruiter' ? company : undefined // Only include company if recruiter
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful! Redirecting to login...',
      token
    });

  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return errorHandler(res, 400, messages.join(', '));
    }
    errorHandler(res, 500, 'Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorHandler(res, 401, 'Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorHandler(res, 401, 'Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      token,
      role: user.role,
      redirectTo: `/${user.role === 'recruiter' ? 'recruiter' : 'job-seeker'}/dashboard`
    });

  } catch (err) {
    errorHandler(res, 500, 'Server error');
  }
};