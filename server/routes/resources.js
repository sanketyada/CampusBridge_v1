const express = require('express');
const router = express.Router();
const { 
  getResources, 
  createResource, 
  uploadMiddleware, 
  getResourceById, 
  chatWithResource,
  reprocessResourceAI
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

router.use(protect); // All resource routes now require login

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/:id/chat', chatWithResource);
router.post('/:id/refresh-ai', reprocessResourceAI);
router.post('/', uploadMiddleware, createResource);

module.exports = router;
