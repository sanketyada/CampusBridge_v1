const express = require('express');
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.post('/', protect, eventController.createNewEvent);
router.post('/seed', eventController.seedEvents);
router.post('/:id/register', eventController.registerForEvent);
router.get('/:id/calendar', eventController.getCalendarFile);

module.exports = router;
