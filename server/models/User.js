const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    default: 'student'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  college: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate']
  },
  skills: [String],
  socialLinks: {
    linkedIn: String,
    github: String,
    portfolio: String
  },
  savedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  avatar: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  coverImage: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
