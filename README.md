# Blue Queen - AI Assistant

Blue Queen is a full-stack AI assistant application featuring a Node.js backend and React PWA frontend with Polish language support, real-time communication, and speech capabilities.

![Login Page](https://github.com/user-attachments/assets/5b1af9a3-1d24-444c-82b3-e82b2dc73675)
![Chat Interface](https://github.com/user-attachments/assets/d4d9dd14-9927-4d3d-94a4-3f52f75d3fea)

## Features

### 🧠 AI Assistant
- **OpenAI GPT Integration**: Powered by GPT-3.5-turbo with Polish language optimization
- **Intelligent Conversations**: Natural Polish language interactions
- **Content Moderation**: Built-in safety checks for user messages
- **Context Awareness**: Maintains conversation history for coherent responses

### 🎨 Modern UI
- **Icy Theme**: Beautiful blue/white color scheme with glassmorphism effects
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **PWA Support**: Install as a native app on any device
- **Real-time Updates**: Live typing indicators and instant message delivery

### 🗣️ Speech Features
- **Speech-to-Text**: Voice input using browser Web Speech API
- **Text-to-Speech**: AI responses can be spoken aloud
- **Polish Language**: Full support for Polish speech recognition and synthesis
- **Fallback TTS**: Server-side Google TTS when browser TTS unavailable

### 🔄 Real-time Communication
- **WebSocket Connection**: Instant bidirectional communication
- **Auto-reconnection**: Automatic reconnection with exponential backoff
- **Connection Status**: Visual indicators for connection state
- **Message Persistence**: Chat history maintained during session

### 🔐 Security
- **JWT Authentication**: Secure token-based authentication
- **Simple Auth System**: Demo account for easy testing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive message validation

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for full functionality)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the backend:**
   ```bash
   npm run dev
   ```
   Backend will run on http://localhost:5001

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000

### Access the Application

1. Open http://localhost:3000 in your browser
2. Click "Użyj konta demo" to fill demo credentials
3. Click "Zaloguj się" to login
4. Start chatting with Blue Queen!

## Demo Account

- **Username:** `demo`
- **Password:** `password`

## Architecture

### Backend (Node.js + Express)

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication & validation
│   ├── routes/          # API endpoints
│   │   ├── auth.js      # Authentication routes
│   │   ├── chat.js      # Chat functionality
│   │   └── tts.js       # Text-to-speech
│   ├── services/        # Business logic
│   │   ├── openai.js    # OpenAI integration
│   │   └── websocket.js # WebSocket handling
│   ├── utils/           # Utilities
│   │   └── logger.js    # Winston logging
│   └── index.js         # Express server
├── .env.example         # Environment template
└── package.json
```

### Frontend (React + Vite PWA)

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── VoiceControls.jsx
│   │   └── LoadingScreen.jsx
│   ├── pages/           # Page components
│   │   ├── LoginPage.jsx
│   │   └── ChatPage.jsx
│   ├── hooks/           # Custom React hooks
│   │   └── useSpeechRecognition.js
│   ├── services/        # External services
│   │   ├── api.js       # REST API client
│   │   ├── websocket.js # WebSocket client
│   │   └── tts.js       # Text-to-speech service
│   ├── store/           # Redux store
│   │   ├── authSlice.js
│   │   ├── chatSlice.js
│   │   ├── uiSlice.js
│   │   └── index.js
│   ├── styles/          # Theme & styled components
│   │   ├── theme.js
│   │   └── components.js
│   └── App.jsx
├── public/
│   └── manifest.json    # PWA manifest
├── vite.config.js       # Vite + PWA config
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/validate` - Token validation

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history` - Get conversation history
- `DELETE /api/chat/history` - Clear conversation history
- `GET /api/chat/stats` - Get conversation statistics

### Text-to-Speech
- `POST /api/tts/synthesize` - Generate speech audio
- `GET /api/tts/languages` - Get supported languages
- `GET /api/tts/settings` - Get TTS configuration

### Health
- `GET /api/health` - Health check

## WebSocket Events

### Client → Server
- `auth` - Authenticate WebSocket connection
- `chat` - Send chat message
- `ping` - Keep-alive ping

### Server → Client
- `welcome` - Connection established
- `auth_success` - Authentication successful
- `auth_error` - Authentication failed
- `chat_response` - AI response message
- `chat_error` - Chat processing error
- `typing` - AI is typing indicator
- `pong` - Ping response

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **WebSocket (ws)** - Real-time communication
- **OpenAI API** - GPT language model
- **Google TTS** - Text-to-speech synthesis
- **JWT** - Authentication tokens
- **Winston** - Logging framework
- **bcryptjs** - Password hashing
- **CORS & Helmet** - Security middleware

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **styled-components** - CSS-in-JS styling
- **Axios** - HTTP client
- **Web Speech API** - Speech recognition/synthesis
- **PWA** - Progressive Web App features
- **Workbox** - Service worker management

## Browser Compatibility

- **Chrome 80+** (Recommended)
- **Firefox 75+**
- **Safari 14+**
- **Edge 80+**

### Speech Features
- **Speech Recognition**: Chrome, Edge, Safari (limited)
- **Speech Synthesis**: All modern browsers
- **Fallback TTS**: Server-side Google TTS for all browsers

## Deployment

### Production Environment Variables

**Backend (.env):**
```bash
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
OPENAI_API_KEY=your_production_openai_key
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=24h
TTS_LANGUAGE=pl
TTS_SPEED=1.0
```

**Frontend (.env.production):**
```bash
VITE_API_URL=https://your-backend-domain.com/api
VITE_WS_URL=wss://your-backend-domain.com
VITE_APP_NAME=Blue Queen
VITE_APP_VERSION=1.0.0
```

### Build Commands

**Backend:**
```bash
npm start  # Production server
```

**Frontend:**
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

## Development

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Modular architecture with clear separation of concerns

### Environment Setup
1. Clone the repository
2. Follow setup instructions for backend and frontend
3. Ensure both servers are running for full functionality
4. Use browser developer tools to monitor WebSocket connections

### Testing
- Backend: Health check endpoint at `/api/health`
- Frontend: PWA manifest validation
- WebSocket: Connection status indicators in UI
- Speech: Browser compatibility detection

## Troubleshooting

### Common Issues

**WebSocket Connection Failed:**
- Ensure backend is running on correct port
- Check CORS configuration
- Verify WebSocket URL in frontend env

**Speech Recognition Not Working:**
- Microphone permissions required
- HTTPS required for production
- Check browser compatibility

**OpenAI API Errors:**
- Verify API key is correct
- Check account has sufficient credits
- Monitor rate limits

**PWA Installation Issues:**
- Ensure HTTPS in production
- Check manifest.json validity
- Verify service worker registration

## License

MIT License - feel free to use this project for your own AI assistant applications!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❄️ by the Blue Queen development team**
