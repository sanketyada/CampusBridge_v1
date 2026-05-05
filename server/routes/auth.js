const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.get('/profile', protect, authController.getMe);
router.patch('/update-profile', protect, authController.updateMe);
router.post('/upload-avatar', protect, uploadAvatar.single('avatar'), authController.uploadAvatar);

module.exports = router;
