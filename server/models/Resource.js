const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    required: true,
    enum: ['Development', 'Design', 'CS Fundamentals', 'Career', 'Soft Skills', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['PDF', 'Link', 'Video', 'Article']
  },
  fileUrl: {
    type: String,
    required: [true, 'Resource URL or local path is required']
  },
  publicId: {
    type: String
  },
  tags: [String],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiSummary: {
    type: String
  },
  keyInsights: [String],
  contentText: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
