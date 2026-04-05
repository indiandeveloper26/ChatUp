'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [{ "data": "asahilindia" }],
  currentChatId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.messages.push(message);
        chat.lastMessage = message;
      }
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
  },
});

export const { setChats, addMessage, setCurrentChatId } = chatSlice.actions;
export default chatSlice.reducer;
