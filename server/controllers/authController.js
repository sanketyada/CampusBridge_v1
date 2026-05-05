const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, college, department } = req.body;
    console.log(name, email, password, role, college, department)

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      college,
      department
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          department: user.department
        }
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    console.log(req.body)
    console.log(email, password)
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          department: user.department
        }
      }
    });
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
/**
 * @desc    Update user profile
 * @route   PATCH /api/auth/updateMe
 */
exports.updateMe = async (req, res) => {
  try {
    const { name, bio, college, department, year, skills, socialLinks } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, college, department, year, skills, socialLinks },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
/**
 * @desc    Upload user avatar
 * @route   POST /api/auth/upload-avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        avatar: { 
          url: req.file.path,
          publicId: req.file.filename
        } 
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

/**
 * @desc    Google OAuth Login/Register
 * @route   POST /api/auth/google
 */
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential token is required' });
    }

    // Verify Google token
    const googleRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    const { sub: googleId, email, name, picture } = googleRes.data;

    if (!email) {
      return res.status(400).json({ message: 'Unable to get email from Google account' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Existing user — link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.avatar?.url) {
          user.avatar = { url: picture, publicId: '' };
        }
        await user.save();
      }
    } else {
      // New user — create account
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        role: 'student',
        avatar: { url: picture || '', publicId: '' }
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          department: user.department
        }
      }
    });
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    res.status(400).json({ status: 'fail', message: 'Google authentication failed' });
  }
};
