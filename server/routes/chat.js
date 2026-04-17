const express = require('express');
const router = express.Router();
const { getGeminiResponse, getGroqResponse } = require('../services/aiService');
const { protect } = require('../middleware/auth');

router.post('/gemini', protect, async (req, res) => {
  try {
    const { prompt, persona } = req.body;
    const response = await getGeminiResponse(prompt, persona);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/groq', protect, async (req, res) => {
  try {
    const { prompt, persona } = req.body;
    const response = await getGroqResponse(prompt, persona);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
