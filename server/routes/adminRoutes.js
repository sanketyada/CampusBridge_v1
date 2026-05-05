const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes here are protected and require admin role
router.use(protect);
router.use(isAdmin);

router.get('/events/pending', adminController.getPendingEvents);
router.put('/events/:id/approve', adminController.approveEvent);
router.delete('/events/:id/reject', adminController.rejectEvent);

module.exports = router;
