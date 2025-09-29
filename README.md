# Blue Queen - AI Assistant

![Blue Queen Logo](https://img.shields.io/badge/Blue%20Queen-AI%20Assistant-blue?style=for-the-badge&logo=crown)

Blue Queen to zaawansowany asystent AI z obsługą języka polskiego, zaprojektowany jako zawsze dostępna aplikacja PWA (Progressive Web App) z funkcjami komunikacji w czasie rzeczywistym.

## ✨ Funkcje

### 🤖 Sztuczna Inteligencja
- **Obsługa języka polskiego** - Native'owa obsługa polskiego języka
- **Integracja z OpenAI GPT** - Zaawansowane rozmowy oparte na GPT-3.5-turbo
- **Pamięć kontekstu** - Zapamiętywanie kontekstu rozmowy
- **Lodowa osobowość** - Unikalna, chłodna i elegancka osobowość AI

### 🎤 Audio & Głos
- **Text-to-Speech (TTS)** - Generowanie polskich odpowiedzi głosowych
- **Speech-to-Text (STT)** - Rozpoznawanie mowy polskiej w przeglądarce
- **Audio Player** - Zaawansowany odtwarzacz z kontrolkami
- **Automatyczne odtwarzanie** - Opcjonalne automatyczne odtwarzanie odpowiedzi

### 💬 Komunikacja Real-time
- **WebSocket** - Komunikacja w czasie rzeczywistym
- **Wskaźnik pisania** - Pokazuje gdy AI pisze odpowiedź
- **Status połączenia** - Monitoring stanu połączenia
- **Automatyczne ponowne łączenie** - Inteligentne zarządzanie połączeniem

### 🎨 Interfejs Użytkownika
- **Icy Theme** - Nowoczesny, zimny design w odcieniach niebieskiego
- **Responsive Design** - Pełne wsparcie desktop i mobile
- **PWA Ready** - Instalowalna aplikacja webowa
- **Dark Mode** - Ciemny motyw dla wygody oczu

### 🔐 Bezpieczeństwo
- **Token-based Authentication** - Bezpieczna autentykacja JWT
- **Rate Limiting** - Ochrona przed spam'em
- **CORS Protection** - Konfigurowane źródła
- **Input Validation** - Walidacja wszystkich danych wejściowych

## 🏗️ Architektura

### Backend (Node.js + Express)
```
server/
├── src/
│   ├── config/          # Konfiguracja aplikacji
│   ├── middleware/      # Middleware (auth, rate limiting)
│   ├── routes/          # Endpointy API (auth, chat)
│   ├── services/        # Logika biznesowa (AI, TTS, WebSocket)
│   └── index.js         # Główny plik serwera
└── package.json
```

### Frontend (React PWA)
```
client/
├── src/
│   ├── components/      # Komponenty React
│   │   ├── Auth/        # Logowanie i rejestracja
│   │   ├── Chat/        # Interfejs czatu
│   │   └── Layout/      # Layout aplikacji
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API i WebSocket services
│   ├── styles/          # Style CSS
│   └── App.js           # Główny komponent
└── package.json
```

## 🚀 Instalacja i Uruchomienie

### Wymagania
- **Node.js** v18 lub nowszy
- **npm** v8 lub nowszy
- **Klucz API OpenAI** (opcjonalny, ale zalecany)

### 1. Klonowanie repozytorium
```bash
git clone https://github.com/prezesttv-cloud/BlueQueen.git
cd BlueQueen
```

### 2. Instalacja zależności
```bash
# Instalacja dla całego projektu
npm run install:all

# Lub osobno:
npm install                    # Root dependencies
cd server && npm install       # Backend dependencies
cd ../client && npm install    # Frontend dependencies
```

### 3. Konfiguracja środowiska
```bash
# Skopiuj plik przykładowy
cp .env.example .env

# Edytuj plik .env
nano .env
```

Wypełnij następujące zmienne:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret for authentication
JWT_SECRET=your_strong_jwt_secret_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Audio Configuration
TTS_VOICE=pl
TTS_SPEED=1.0

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Uruchomienie aplikacji

#### Tryb Development (zalecany)
```bash
# Uruchom backend i frontend jednocześnie
npm run dev
```

Aplikacja będzie dostępna na:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

#### Tryb Production
```bash
# Build aplikacji
npm run build

# Uruchom serwer produkcyjny
npm start
```

### 5. Pierwsze kroki
1. Otwórz http://localhost:3000 w przeglądarce
2. Zarejestruj się lub skorzystaj z dostępu gościa
3. Rozpocznij rozmowę z Blue Queen!

## 🔧 Konfiguracja

### Klucz API OpenAI
Aby w pełni korzystać z funkcji AI, potrzebujesz klucza API OpenAI:

1. Przejdź na https://platform.openai.com/account/api-keys
2. Utwórz nowy klucz API
3. Dodaj go do pliku `.env` jako `OPENAI_API_KEY`

**Uwaga**: Bez klucza API, Blue Queen będzie działać w trybie demo z predefiniowanymi odpowiedziami.

### Audio (TTS)
Funkcje TTS są obsługiwane przez `node-gtts` i działają bez dodatkowej konfiguracji dla języka polskiego.

### Speech-to-Text (STT)
STT wykorzystuje Web Speech API przeglądarki i działa bez dodatkowej konfiguracji w obsługiwanych przeglądarkach (Chrome, Edge, Safari).

## 📱 PWA (Progressive Web App)

Blue Queen jest w pełni funkcjonalną aplikacją PWA:

### Instalacja na urządzeniu
1. Otwórz aplikację w przeglądarce
2. W menu przeglądarki wybierz "Zainstaluj aplikację" lub "Dodaj do ekranu głównego"
3. Blue Queen zostanie zainstalowana jako natywna aplikacja

### Funkcje PWA
- ✅ Instalowalna na desktop i mobile
- ✅ Offline cache (manifest)
- ✅ Service worker ready
- ✅ Responsive design
- ✅ Native look & feel

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register    # Rejestracja użytkownika
POST /api/auth/login       # Logowanie
POST /api/auth/guest       # Dostęp gościa
POST /api/auth/verify      # Weryfikacja tokenu
```

### Chat
```
POST /api/chat/message     # Wysłanie wiadomości do AI
POST /api/chat/audio       # Generowanie audio
GET  /api/chat/history     # Historia rozmów
```

### System
```
GET  /api/health           # Status zdrowia serwera
GET  /api/audio/file/:id   # Pobieranie plików audio
```

### WebSocket Events
```
# Client -> Server
chat_message               # Wysłanie wiadomości
generate_audio             # Żądanie generowania audio
clear_conversation         # Wyczyszczenie historii
ping                       # Test połączenia

# Server -> Client
chat_response              # Odpowiedź AI
ai_typing                  # Status pisania AI
audio_generated            # Audio wygenerowane
system_message             # Wiadomości systemowe
conversation_cleared       # Potwierdzenie wyczyszczenia
pong                       # Odpowiedź na ping
```

## 🎛️ Customizacja

### Zmiana osobowości AI
Edytuj plik `server/src/services/aiService.js` i zmodyfikuj system message:

```javascript
const systemMessage = {
  role: 'system',
  content: `Twoja nowa osobowość AI...`
};
```

### Dostosowanie motywu
Edytuj zmienne CSS w `client/src/styles/global.css`:

```css
:root {
  --primary-blue: #your-color;
  --background-primary: #your-bg;
  /* ... */
}
```

### Konfiguracja WebSocket
Dostosuj ustawienia w `server/src/services/socketHandler.js`:

```javascript
// Maksymalna długość wiadomości, timeout itp.
```

## 🧪 Testowanie

### Testy jednostkowe
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Testy end-to-end
```bash
# Uruchom e2e testy
npm run test:e2e
```

### Testy manualne
1. Testuj różne typy wiadomości
2. Sprawdź funkcje audio
3. Testuj na różnych urządzeniach
4. Sprawdź działanie offline

## 🚀 Deployment

### Heroku
```bash
# Zainstaluj Heroku CLI
# Utwórz aplikację
heroku create your-blue-queen-app

# Ustaw zmienne środowiskowe
heroku config:set OPENAI_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Docker
```dockerfile
# Przykładowy Dockerfile w przygotowaniu
```

### Netlify/Vercel (Frontend tylko)
Skonfiguruj build command: `npm run client:build`

## 🔍 Troubleshooting

### Częste problemy

**Problem**: WebSocket nie działa
```bash
# Sprawdź porty i firewall
netstat -an | grep 5000
```

**Problem**: Audio nie działa
```bash
# Sprawdź uprawnienia mikrofonu w przeglądarce
# Chrome: Settings -> Privacy -> Site Settings -> Microphone
```

**Problem**: OpenAI API nie działa
```bash
# Sprawdź klucz API i limity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

**Problem**: Build fails
```bash
# Wyczyść cache i reinstaluj
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

### Logi debug
```bash
# Backend logs
cd server && npm run dev

# Frontend logs
# Otwórz Developer Tools w przeglądarce (F12)
```

## 🤝 Contributing

1. Fork repozytorium
2. Utwórz branch dla feature (`git checkout -b feature/AmazingFeature`)
3. Commit zmiany (`git commit -m 'Add AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

### Wytyczne dla developerów
- Używaj ESLint i Prettier
- Pisz testy dla nowych funkcji
- Aktualizuj dokumentację
- Przestrzegaj konwencji nazewnictwa

## 📄 Licencja

Ten projekt jest licencjonowany pod licencją MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## 👥 Autorzy

- **prezesttv-cloud** - *Initial work* - [GitHub](https://github.com/prezesttv-cloud)

## 🙏 Podziękowania

- OpenAI za API GPT
- React team za framework
- Node.js community
- Wszyscy beta testerzy

## 📈 Roadmap

### v1.1 (Planowane)
- [ ] Obsługa plików i obrazów
- [ ] Integracja z bazą danych
- [ ] Ulepszone STT z Azure/Google
- [ ] Tryb offline z local LLM

### v1.2 (Przyszłość)
- [ ] Multi-user support
- [ ] Chat rooms
- [ ] Voice cloning
- [ ] Mobile native apps

## 📞 Wsparcie

Jeśli masz pytania lub problemy:

1. Sprawdź [FAQ](#-troubleshooting)
2. Otwórz [Issue](https://github.com/prezesttv-cloud/BlueQueen/issues)
3. Kontakt: [email lub discord]

---

**Blue Queen** - Twój inteligentny asystent AI 🤖👑

Made with ❄️ by prezesttv-cloud