// src/context/ChatProvider.jsx
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getUserChatRooms,
  getChatMessages,
  sendMessage as sendMessageService,
  getOrCreateChatRoom,
  getChatRoomInfo,
} from "../modules/chat/service";
import { AuthContext } from "./AuthProvider";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unsubscribeChats, setUnsubscribeChats] = useState(null);
  const [unsubscribeMessages, setUnsubscribeMessages] = useState(null);

  // Subscribe ke chat rooms user
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = getUserChatRooms(user.id, (chatsData) => {
      setChats(chatsData);
    });

    setUnsubscribeChats(() => unsubscribe);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id]);

  // Subscribe ke messages saat chat dipilih
  useEffect(() => {
    if (!currentChat?.id) {
      setMessages([]);
      return;
    }

    if (unsubscribeMessages) {
      unsubscribeMessages();
    }

    const unsubscribe = getChatMessages(currentChat.id, (messagesData) => {
      setMessages(messagesData);
    });

    setUnsubscribeMessages(() => unsubscribe);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentChat?.id]);

  // Fungsi untuk mulai chat dengan seller
  const startChat = useCallback(
    async (sellerId, sellerInfo, productId = null) => {
      if (!user?.id) return null;

      setLoading(true);
      try {
        const customerInfo = {
          name: user.name || user.username,
          avatar: user.avatar || null,
        };

        const chatId = await getOrCreateChatRoom(
          user.id,
          sellerId,
          customerInfo,
          sellerInfo,
          productId
        );

        // Set current chat
        const chatInfo = await getChatRoomInfo(chatId);
        setCurrentChat(chatInfo);
        
        return chatId;
      } catch (error) {
        console.error("Error starting chat:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Fungsi untuk mengirim pesan
  const sendMessage = useCallback(
    async (text) => {
      if (!currentChat?.id || !user?.id || !text.trim()) return;

      try {
        await sendMessageService(
          currentChat.id,
          user.id,
          user.name || user.username,
          text
        );
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [currentChat, user]
  );

  // Fungsi untuk select chat
  const selectChat = useCallback((chat) => {
    setCurrentChat(chat);
    setMessages([]);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (unsubscribeChats) unsubscribeChats();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        loading,
        startChat,
        sendMessage,
        selectChat,
        setCurrentChat: selectChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}