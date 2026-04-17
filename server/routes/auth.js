const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', protect, authController.getMe);

module.exports = router;
