const express = require('express');
const router = express.Router();
const { getGeminiResponse } = require('../services/aiService');
const { getLangChainChatResponse } = require('../services/langchainService');
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
    // req.user.id is coming from protect middleware
    const response = await getLangChainChatResponse(req.user.id, prompt, persona);
    res.json({ response });
  } catch (err) {
    console.error("Chat Route Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
