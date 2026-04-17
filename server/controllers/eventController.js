const Event = require('../models/Event');
const { createEvent } = require('ics');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ status: 'success', results: events.length, data: { events } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // In a real app, we'd get user ID from auth middleware req.user.id
    // For MVP registration logic:
    if (event.attendees.includes(req.body.userId)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.attendees.push(req.body.userId);
    await event.save();

    res.status(200).json({ status: 'success', message: 'Registered successfully' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getCalendarFile = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const date = new Date(event.date);
    const eventDetails = {
      start: [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()],
      duration: { hours: 2, minutes: 0 },
      title: event.title,
      description: event.description,
      location: event.location,
      url: event.organizerLink,
      status: 'CONFIRMED',
      busyStatus: 'BUSY'
    };

    createEvent(eventDetails, (error, value) => {
      if (error) {
        return res.status(500).json({ message: 'Error generating calendar file' });
      }
      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', `attachment; filename=${event.title.replace(/\s+/g, '_')}.ics`);
      res.send(value);
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Helper to seed some initial events
exports.seedEvents = async (req, res) => {
  try {
    await Event.deleteMany();
    const mockEvents = [
      {
        title: 'TechHack 2026',
        description: 'A 24-hour hackathon to build innovative solutions for rural education.',
        date: new Date('2026-05-15T10:00:00'),
        location: 'Online / Mumbai',
        category: 'Hackathon',
        organizerLink: 'https://devfolio.co',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        organizer: req.user?._id || "64b5e28a9b1e2c001c8e4a1a" // Fallback ID for seeding
      },
      {
        title: 'React Professional Workshop',
        description: 'Deep dive into React Server Components and Performance Optimization.',
        date: new Date('2026-06-10T14:00:00'),
        location: 'IIT Delhi Auditorium',
        category: 'Workshop',
        organizerLink: 'https://react.dev',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        organizer: req.user?._id || "64b5e28a9b1e2c001c8e4a1a"
      },
      {
        title: 'Career in AI Seminar',
        description: 'Meet industry experts from Google and OpenAI to discuss the future of AI.',
        date: new Date('2026-04-20T11:00:00'),
        location: 'Virtual Zoom',
        category: 'Expert Talk',
        organizerLink: 'https://openai.com',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        organizer: req.user?._id || "64b5e28a9b1e2c001c8e4a1a"
      }
    ];
    await Event.insertMany(mockEvents);
    res.status(201).json({ message: 'Events seeded successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @desc    Create new event (Mentors only)
 * @route   POST /api/events
 */
exports.createNewEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, organizerLink, image, secretCode } = req.body;

    // 1. Validate Secret Code
    if (secretCode !== '12345678') {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'Invalid Secret Code. You are not authorized to organize events.' 
      });
    }

    // 2. Role Check (Mentors only)
    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'Access denied. Only Mentors can organize events.' 
      });
    }

    // 3. Category Image Mapping (if no image provided)
    const categoryImages = {
      'Hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200',
      'Workshop': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200',
      'Seminar': 'https://images.unsplash.com/photo-1591115765373-520b708e720f?auto=format&fit=crop&w=1200',
      'Tech Fest': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200',
      'Expert Talk': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200'
    };

    const finalImage = image || categoryImages[category] || categoryImages['Workshop'];

    // 4. Create Event
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      organizerLink,
      image: finalImage,
      organizer: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: { event }
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
