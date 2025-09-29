import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'ice',
  sidebarOpen: false,
  isMobile: window.innerWidth <= 768,
  isListening: false,
  isSpeaking: false,
  volume: 1.0,
  speechRate: 1.0,
  autoSpeak: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsListening: (state, action) => {
      state.isListening = action.payload;
    },
    setIsSpeaking: (state, action) => {
      state.isSpeaking = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setSpeechRate: (state, action) => {
      state.speechRate = action.payload;
    },
    setAutoSpeak: (state, action) => {
      state.autoSpeak = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setTheme,
  setSidebarOpen,
  setIsMobile,
  setIsListening,
  setIsSpeaking,
  setVolume,
  setSpeechRate,
  setAutoSpeak,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;