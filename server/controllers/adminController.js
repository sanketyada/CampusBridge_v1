const Event = require('../models/Event');
const User = require('../models/User');

/**
 * @desc    Get all events pending approval (new or updates)
 * @route   GET /api/admin/events/pending
 * @access  Private/Admin
 */
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      $or: [
        { isVerified: false },
        { pendingUpdate: { $ne: null } },
        { pendingDelete: true }
      ]
    })
      .populate('organizer', 'name username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: events.length,
      data: { events }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

/**
 * @desc    Approve an event (verify new or apply update)
 * @route   PUT /api/admin/events/:id/approve
 * @access  Private/Admin
 */
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.pendingDelete) {
      // Admin approves deletion — remove the event
      await Event.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        status: 'success',
        message: 'Event deleted successfully'
      });
    } else if (event.pendingUpdate) {
      // Apply pending update
      Object.assign(event, event.pendingUpdate);
      event.pendingUpdate = null;
    } else {
      // Approve new event
      event.isVerified = true;
    }

    await event.save();

    res.status(200).json({
      status: 'success',
      message: 'Event approved successfully',
      data: { event }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

/**
 * @desc    Reject an event (delete new or discard update)
 * @route   DELETE /api/admin/events/:id/reject
 * @access  Private/Admin
 */
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.pendingDelete) {
      // Admin rejects the delete — cancel it
      event.pendingDelete = false;
      await event.save();
      res.status(200).json({
        status: 'success',
        message: 'Delete request rejected, event preserved'
      });
    } else if (event.pendingUpdate) {
      // Discard update
      event.pendingUpdate = null;
      await event.save();
      res.status(200).json({
        status: 'success',
        message: 'Event update rejected'
      });
    } else {
      // Delete unverified event
      await Event.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Event rejected and deleted successfully'
      });
    }
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
