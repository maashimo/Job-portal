const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateUser = require('../middlewares/auth');
const protect = require('../middlewares/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      company: role === 'recruiter' ? company : undefined
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      {expiresIn: '1h'}
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    console.error('Registration error', err);

    let message = 'Server error';

    if (err.message.includes('secretOrPrivateKey')) {
      message = 'JWT secret is not defined in .env';
    }

    if (err.code === 11000) {
      message = 'Email already exists';
    }

    return res.status(500).json({ message });
  }
});

// Login (unchanged)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      {expiresIn: '1h'}
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/info', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error('Error fetching user info', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error('Error fetching user profile', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
// PUT /api/auth/update-profile
router.put('/update-profile', protect, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.name = updates.name || user.name;

    await user.save();

    res.json({ message: 'Profile updated successfully' });

  } catch (err) {
    console.error('Update error', err);
    return res.status(500).json({ message: 'Server error while updating profile' });
  }
});


module.exports = router;