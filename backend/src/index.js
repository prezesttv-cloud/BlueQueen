const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const logger = require('./utils/logger');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const ttsRoutes = require('./routes/tts');
const authMiddleware = require('./middleware/auth');
const wsHandler = require('./services/websocket');

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ 
    server,
    path: '/ws'
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/tts', authMiddleware, ttsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', service: 'Blue Queen Backend' });
});

// WebSocket handler
wsHandler(wss);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Coś poszło nie tak na serwerze',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint nie został znaleziony' });
});

// Start server
server.listen(port, () => {
    logger.info(`Blue Queen backend serwer uruchomiony na porcie ${port}`);
    console.log(`🔥 Blue Queen backend serwer uruchomiony na porcie ${port}`);
});

module.exports = app;