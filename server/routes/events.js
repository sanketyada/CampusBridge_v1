const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, isAdmin } = require('../middleware/auth');
const { uploadEventBanner } = require('../config/cloudinary');

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.post('/', protect, eventController.createNewEvent);
router.post('/seed', eventController.seedEvents);

// Image upload route
router.post('/upload-banner', protect, uploadEventBanner.single('banner'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }
    res.status(200).json({
      status: 'success',
      data: { url: req.file.path }
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// New update routes
router.put('/:id/request-update', protect, eventController.requestEventUpdate);
router.put('/:id/request-delete', protect, eventController.requestEventDelete);

router.post('/:id/register', eventController.registerForEvent);
router.get('/:id/calendar', eventController.getCalendarFile);

module.exports = router;
