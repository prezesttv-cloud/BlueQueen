import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isTyping: false,
  isConnected: false,
  error: null,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    updateLastMessage: (state, action) => {
      if (state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        Object.assign(lastMessage, action.payload);
      }
    },
  },
});

export const {
  addMessage,
  setMessages,
  setTyping,
  setConnected,
  setError,
  clearError,
  setLoading,
  clearMessages,
  updateLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;