const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.get('/data', communityController.getCommunityData);
router.get('/mentors', communityController.getAllMentors);

module.exports = router;
