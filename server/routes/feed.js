const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost, addComment } = require('../controllers/feedController');
const { protect } = require('../middleware/auth');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;
