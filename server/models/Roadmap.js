const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Full-stack', 'Frontend', 'Backend', 'Data Science', 'Mobile', 'DevOps', 'Other']
  },
  nodes: [
    {
      id: String,
      data: { label: String },
      position: { x: Number, y: Number },
      type: { type: String, default: 'default' }
    }
  ],
  edges: [
    {
      id: String,
      source: String,
      target: String,
      label: String
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
module.exports = Roadmap;
