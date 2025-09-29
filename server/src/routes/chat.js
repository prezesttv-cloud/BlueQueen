const express = require('express');
const aiService = require('../services/aiService');
const ttsService = require('../services/ttsService');

const router = express.Router();

// Chat completion endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, generateAudio = false } = req.body;
    const userId = req.user.userId;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    console.log(`[${userId}] Processing message: ${message.substring(0, 100)}...`);

    // Get AI response
    const aiResponse = await aiService.getChatCompletion(message, userId);

    let audioUrl = null;
    if (generateAudio && aiResponse) {
      try {
        audioUrl = await ttsService.generateSpeech(aiResponse, userId);
      } catch (audioError) {
        console.error('TTS generation failed:', audioError);
        // Continue without audio
      }
    }

    const response = {
      message: aiResponse,
      audioUrl,
      timestamp: new Date().toISOString(),
      messageId: require('uuid').v4()
    };

    console.log(`[${userId}] Response generated successfully`);
    res.json(response);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Audio generation endpoint
router.post('/audio', async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for audio generation' });
    }

    console.log(`[${userId}] Generating audio for text: ${text.substring(0, 50)}...`);

    const audioUrl = await ttsService.generateSpeech(text, userId);
    
    res.json({
      audioUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Audio generation error:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

// Conversation history endpoint (placeholder for future implementation)
router.get('/history', (req, res) => {
  try {
    const userId = req.user.userId;
    
    // This would typically fetch from a database
    // For now, return empty history
    res.json({
      conversations: [],
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('History endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

module.exports = router;