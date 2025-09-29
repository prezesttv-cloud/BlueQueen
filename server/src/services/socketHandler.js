const jwt = require('jsonwebtoken');
const config = require('../config/config');
const aiService = require('./aiService');
const ttsService = require('./ttsService');

// Store active connections
const activeConnections = new Map();

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      socket.isGuest = decoded.isGuest || false;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { userId, username, isGuest } = socket;
    
    console.log(`🔌 User connected: ${username} (${userId}) ${isGuest ? '[Guest]' : ''}`);
    
    // Store connection
    activeConnections.set(userId, {
      socket,
      username,
      isGuest,
      connectedAt: new Date()
    });

    // Send welcome message
    socket.emit('system_message', {
      type: 'welcome',
      message: `Witaj, ${username}! Blue Queen jest gotowa do rozmowy.`,
      timestamp: new Date().toISOString()
    });

    // Handle chat messages
    socket.on('chat_message', async (data) => {
      try {
        const { message, generateAudio = false } = data;
        
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
          socket.emit('error', { message: 'Wiadomość nie może być pusta' });
          return;
        }

        console.log(`[${username}] Received message: ${message.substring(0, 100)}...`);

        // Emit typing indicator
        socket.emit('ai_typing', { isTyping: true });

        try {
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

          // Send response
          const response = {
            id: require('uuid').v4(),
            message: aiResponse,
            audioUrl,
            timestamp: new Date().toISOString(),
            sender: 'blue_queen'
          };

          socket.emit('ai_typing', { isTyping: false });
          socket.emit('chat_response', response);

          console.log(`[${username}] Response sent successfully`);

        } catch (aiError) {
          console.error('AI processing error:', aiError);
          socket.emit('ai_typing', { isTyping: false });
          socket.emit('error', { 
            message: 'Przepraszam, wystąpił problem z przetwarzaniem Twojej wiadomości.' 
          });
        }

      } catch (error) {
        console.error('Chat message handling error:', error);
        socket.emit('ai_typing', { isTyping: false });
        socket.emit('error', { 
          message: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.' 
        });
      }
    });

    // Handle audio generation requests
    socket.on('generate_audio', async (data) => {
      try {
        const { text } = data;
        
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
          socket.emit('error', { message: 'Tekst do wygenerowania audio nie może być pusty' });
          return;
        }

        console.log(`[${username}] Generating audio for: ${text.substring(0, 50)}...`);

        const audioUrl = await ttsService.generateSpeech(text, userId);
        
        socket.emit('audio_generated', {
          audioUrl,
          originalText: text,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Audio generation error:', error);
        socket.emit('error', { 
          message: 'Nie udało się wygenerować audio. Spróbuj ponownie.' 
        });
      }
    });

    // Handle conversation clear
    socket.on('clear_conversation', () => {
      try {
        aiService.clearConversation(userId);
        socket.emit('conversation_cleared', {
          message: 'Historia rozmowy została wyczyszczona.',
          timestamp: new Date().toISOString()
        });
        console.log(`[${username}] Conversation cleared`);
      } catch (error) {
        console.error('Clear conversation error:', error);
        socket.emit('error', { message: 'Nie udało się wyczyścić historii rozmowy.' });
      }
    });

    // Handle ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`🔌 User disconnected: ${username} (${userId}) - Reason: ${reason}`);
      activeConnections.delete(userId);
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${username}:`, error);
    });
  });

  // Periodic connection status broadcast (every 30 seconds)
  setInterval(() => {
    const stats = {
      activeConnections: activeConnections.size,
      aiStats: aiService.getStats(),
      timestamp: new Date().toISOString()
    };
    
    // Broadcast to all connected clients (optional)
    // io.emit('server_stats', stats);
    
    console.log(`📊 Server stats: ${activeConnections.size} active connections`);
  }, 30000);
};

module.exports = socketHandler;