// src/context/ChatProvider.jsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthContext } from "./AuthProvider";
import {
  getUserChatRooms,
  getChatMessages,
  sendMessage as sendMessageService,
  getOrCreateChatRoom,
  getChatRoomInfo,
  resetUnreadCount,
} from "../modules/chat/service";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setChats([]);
      return;
    }

    const unsubscribe = getUserChatRooms(user.id, (chatsData) => {
      setChats(chatsData);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!currentChat?.id) {
      setMessages([]);
      return;
    }

    const unsubscribe = getChatMessages(currentChat.id, (messagesData) => {
      setMessages(messagesData);
    });

    if (user?.id) {
      resetUnreadCount(currentChat.id, user.id).catch((err) => {
        console.error("Failed to reset unread count:", err);
      });
    }

    return () => {
      unsubscribe();
    };
  }, [currentChat?.id, user?.id]);

  const startChat = useCallback(
    async (sellerId, sellerInfo, productId = null) => {
      if (!user?.id) {
        throw new Error("User belum login");
      }

      setLoading(true);
      try {
        const customerInfo = {
          name: user.name || user.username || user.email,
          avatar: user.avatar || user.profile_picture || null,
        };

        const chatId = await getOrCreateChatRoom(
          user.id,
          sellerId,
          customerInfo,
          sellerInfo,
          productId
        );

        const chatInfo = await getChatRoomInfo(chatId);
        setCurrentChat(chatInfo);

        return chatId;
      } catch (error) {
        console.error("❌ Error starting chat:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const sendMessage = useCallback(
    async (text) => {
      if (!currentChat?.id || !user?.id || !text.trim()) {
        console.warn("⚠️ Cannot send message: missing data");
        return;
      }

      try {
        await sendMessageService(
          currentChat.id,
          user.id,
          user.name || user.username || user.email,
          text.trim(),
          user.avatar || user.profile_picture || null
        );
      } catch (error) {
        console.error("❌ Error sending message:", error);
        throw error;
      }
    },
    [currentChat, user]
  );

  const selectChat = useCallback((chat) => {
    setCurrentChat(chat);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
