const express = require('express');
const openaiService = require('../services/openai');
const logger = require('../utils/logger');

const router = express.Router();

// Store conversation history in memory (in production, use a database)
const conversations = new Map();

// Get conversation history
router.get('/history', (req, res) => {
    try {
        const userId = req.user.userId;
        const history = conversations.get(userId) || [];
        
        res.json({
            success: true,
            messages: history
        });
    } catch (error) {
        logger.error('Error getting chat history:', error);
        res.status(500).json({ error: 'Błąd pobierania historii rozmów' });
    }
});

// Send message to AI
router.post('/message', async (req, res) => {
    try {
        const userId = req.user.userId;
        const { message, conversationId } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Wiadomość nie może być pusta' });
        }

        if (message.length > 4000) {
            return res.status(400).json({ error: 'Wiadomość jest zbyt długa (maksymalnie 4000 znaków)' });
        }

        // Get or create conversation history
        let conversation = conversations.get(userId) || [];

        // Moderate content first
        const moderation = await openaiService.moderateContent(message);
        if (moderation.flagged) {
            logger.warn(`Flagged content from user ${userId}: ${message}`);
            return res.status(400).json({ 
                error: 'Wiadomość zawiera niepozwolone treści',
                message: 'Przepraszam, ale nie mogę odpowiedzieć na tę wiadomość ze względu na jej zawartość.'
            });
        }

        // Add user message to conversation
        const userMessage = {
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        
        conversation.push(userMessage);

        // Limit conversation history to last 20 messages to prevent token overflow
        if (conversation.length > 20) {
            conversation = conversation.slice(-20);
        }

        // Generate AI response
        const aiResult = await openaiService.generateResponse(conversation, userId);
        
        if (!aiResult.success) {
            return res.status(500).json({
                error: aiResult.error,
                message: aiResult.response
            });
        }

        // Add AI response to conversation
        const aiMessage = {
            role: 'assistant',
            content: aiResult.response,
            timestamp: new Date().toISOString()
        };
        
        conversation.push(aiMessage);

        // Update conversation in memory
        conversations.set(userId, conversation);

        logger.info(`Chat exchange completed for user ${userId}`);

        res.json({
            success: true,
            message: aiResult.response,
            usage: aiResult.usage,
            conversationLength: conversation.length
        });

    } catch (error) {
        logger.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Błąd przetwarzania wiadomości',
            message: 'Przepraszam, wystąpił problem techniczny. Spróbuj ponownie.'
        });
    }
});

// Clear conversation history
router.delete('/history', (req, res) => {
    try {
        const userId = req.user.userId;
        conversations.delete(userId);
        
        logger.info(`Conversation history cleared for user ${userId}`);
        
        res.json({
            success: true,
            message: 'Historia rozmów została wyczyszczona'
        });
    } catch (error) {
        logger.error('Error clearing chat history:', error);
        res.status(500).json({ error: 'Błąd czyszczenia historii rozmów' });
    }
});

// Get conversation statistics
router.get('/stats', (req, res) => {
    try {
        const userId = req.user.userId;
        const conversation = conversations.get(userId) || [];
        
        const userMessages = conversation.filter(msg => msg.role === 'user').length;
        const aiMessages = conversation.filter(msg => msg.role === 'assistant').length;
        
        res.json({
            success: true,
            stats: {
                totalMessages: conversation.length,
                userMessages,
                aiMessages,
                firstMessage: conversation.length > 0 ? conversation[0].timestamp : null,
                lastMessage: conversation.length > 0 ? conversation[conversation.length - 1].timestamp : null
            }
        });
    } catch (error) {
        logger.error('Error getting chat stats:', error);
        res.status(500).json({ error: 'Błąd pobierania statystyk rozmów' });
    }
});

module.exports = router;