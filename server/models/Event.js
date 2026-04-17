const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required']
  },
  category: {
    type: String,
    enum: ['Hackathon', 'Workshop', 'Seminar', 'Tech Fest', 'Expert Talk'],
    default: 'Workshop'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575861501-7ad0582371f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  organizerLink: {
    type: String,
    required: [true, 'Organizer link is required']
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
