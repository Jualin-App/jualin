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
    async (otherUserId, otherUserInfo, productId = null) => {
      if (!user?.id) {
        throw new Error("User belum login");
      }

      setLoading(true);
      try {
        const currentUserInfo = {
          name: user.name || user.username || user.email,
          avatar: user.avatar || user.profile_picture || null,
          role: String(user.role || "customer").toLowerCase(),
        };

        const otherUserInfoWithRole = {
          ...otherUserInfo,
          role: otherUserInfo.role || "seller", // backward compatibility
        };

        // Tentukan siapa customer dan siapa seller berdasarkan role
        const isCurrentUserCustomer = currentUserInfo.role === "customer";

        const customerId = isCurrentUserCustomer ? user.id : otherUserId;
        const sellerId = isCurrentUserCustomer ? otherUserId : user.id;
        const customerInfo = isCurrentUserCustomer ? currentUserInfo : otherUserInfoWithRole;
        const sellerInfo = isCurrentUserCustomer ? otherUserInfoWithRole : currentUserInfo;

        const chatId = await getOrCreateChatRoom(
          customerId,
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

  const openChatWithUser = useCallback(
    async (targetUserId) => {
      if (!user?.id) {
        throw new Error("User belum login");
      }

      setLoading(true);
      try {
        console.log("🔍 Looking for chat with user:", targetUserId);
        console.log("📋 Available chats:", chats.length);
        console.log("👤 Current user ID:", user.id);

        // Konversi targetUserId ke string untuk comparison
        const targetUserIdStr = String(targetUserId);

        // Cari chat yang sudah ada dengan user ini
        const existingChat = chats.find(chat => {
          if (!chat.participants) return false;

          // Konversi semua participants ke string untuk comparison yang konsisten
          const participantsStr = chat.participants.map(p => String(p));
          const hasTarget = participantsStr.includes(targetUserIdStr);

          console.log("  Checking chat:", chat.id, "participants:", participantsStr, "has target?", hasTarget);

          return hasTarget;
        });

        if (existingChat) {
          console.log("✅ Found existing chat:", existingChat.id);
          setCurrentChat(existingChat);
          return existingChat.id;
        }

        // Jika tidak ada chat, throw error
        // Seller tidak boleh create chat baru, hanya respond
        console.log("❌ No existing chat found with user:", targetUserId);
        throw new Error("No existing conversation found with this user");
      } catch (error) {
        console.error("❌ Error opening chat:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, chats]
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
        openChatWithUser,
        sendMessage,
        selectChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
