const jwt = require('jsonwebtoken');
const openaiService = require('./openai');
const logger = require('../utils/logger');

// Store active connections
const activeConnections = new Map();
const conversations = new Map();

const wsHandler = (wss) => {
    wss.on('connection', (ws, req) => {
        logger.info('New WebSocket connection attempt');

        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                
                switch (message.type) {
                    case 'auth':
                        await handleAuth(ws, message);
                        break;
                    case 'chat':
                        await handleChat(ws, message);
                        break;
                    case 'ping':
                        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
                        break;
                    default:
                        ws.send(JSON.stringify({ 
                            type: 'error', 
                            error: 'Nieznany typ wiadomości' 
                        }));
                }
            } catch (error) {
                logger.error('WebSocket message error:', error);
                ws.send(JSON.stringify({ 
                    type: 'error', 
                    error: 'Błąd przetwarzania wiadomości' 
                }));
            }
        });

        ws.on('close', () => {
            // Find and remove connection
            for (const [userId, connection] of activeConnections.entries()) {
                if (connection.ws === ws) {
                    activeConnections.delete(userId);
                    logger.info(`WebSocket connection closed for user ${userId}`);
                    break;
                }
            }
        });

        ws.on('error', (error) => {
            logger.error('WebSocket error:', error);
        });

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'welcome',
            message: 'Połączono z Blue Queen WebSocket'
        }));
    });

    // Heartbeat to keep connections alive
    const heartbeat = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.readyState === 1) { // OPEN
                ws.ping();
            }
        });
    }, 30000);

    wss.on('close', () => {
        clearInterval(heartbeat);
    });
};

const handleAuth = async (ws, message) => {
    try {
        const { token } = message;
        
        if (!token) {
            ws.send(JSON.stringify({ 
                type: 'auth_error', 
                error: 'Brak tokenu autoryzacji' 
            }));
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Store connection
        activeConnections.set(userId, {
            ws,
            userId,
            username: decoded.username,
            connectedAt: new Date()
        });

        logger.info(`User ${decoded.username} authenticated via WebSocket`);

        ws.send(JSON.stringify({
            type: 'auth_success',
            user: {
                id: userId,
                username: decoded.username
            }
        }));

    } catch (error) {
        logger.error('WebSocket auth error:', error);
        ws.send(JSON.stringify({ 
            type: 'auth_error', 
            error: 'Nieprawidłowy token autoryzacji' 
        }));
    }
};

const handleChat = async (ws, message) => {
    try {
        // Find user connection
        let userConnection = null;
        for (const [userId, connection] of activeConnections.entries()) {
            if (connection.ws === ws) {
                userConnection = connection;
                break;
            }
        }

        if (!userConnection) {
            ws.send(JSON.stringify({ 
                type: 'error', 
                error: 'Nie jesteś zalogowany' 
            }));
            return;
        }

        const { text } = message;
        const userId = userConnection.userId;

        if (!text || text.trim().length === 0) {
            ws.send(JSON.stringify({ 
                type: 'error', 
                error: 'Wiadomość nie może być pusta' 
            }));
            return;
        }

        // Send typing indicator
        ws.send(JSON.stringify({
            type: 'typing',
            message: 'Blue Queen pisze...'
        }));

        // Get or create conversation
        let conversation = conversations.get(userId) || [];

        // Moderate content
        const moderation = await openaiService.moderateContent(text);
        if (moderation.flagged) {
            ws.send(JSON.stringify({
                type: 'error',
                error: 'Wiadomość zawiera niepozwolone treści'
            }));
            return;
        }

        // Add user message
        const userMessage = {
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
        };
        conversation.push(userMessage);

        // Limit conversation length
        if (conversation.length > 20) {
            conversation = conversation.slice(-20);
        }

        // Generate AI response
        const aiResult = await openaiService.generateResponse(conversation, userId);

        if (!aiResult.success) {
            ws.send(JSON.stringify({
                type: 'chat_error',
                error: aiResult.error,
                message: aiResult.response
            }));
            return;
        }

        // Add AI message
        const aiMessage = {
            role: 'assistant',
            content: aiResult.response,
            timestamp: new Date().toISOString()
        };
        conversation.push(aiMessage);

        // Update conversation
        conversations.set(userId, conversation);

        // Send response
        ws.send(JSON.stringify({
            type: 'chat_response',
            message: aiResult.response,
            timestamp: aiMessage.timestamp,
            usage: aiResult.usage
        }));

        logger.info(`WebSocket chat exchange completed for user ${userId}`);

    } catch (error) {
        logger.error('WebSocket chat error:', error);
        ws.send(JSON.stringify({
            type: 'error',
            error: 'Błąd przetwarzania wiadomości'
        }));
    }
};

// Function to broadcast to all connected users
const broadcast = (message) => {
    activeConnections.forEach((connection) => {
        if (connection.ws.readyState === 1) { // OPEN
            connection.ws.send(JSON.stringify(message));
        }
    });
};

// Function to send message to specific user
const sendToUser = (userId, message) => {
    const connection = activeConnections.get(userId);
    if (connection && connection.ws.readyState === 1) {
        connection.ws.send(JSON.stringify(message));
        return true;
    }
    return false;
};

module.exports = wsHandler;
module.exports.broadcast = broadcast;
module.exports.sendToUser = sendToUser;
module.exports.getActiveConnections = () => activeConnections;