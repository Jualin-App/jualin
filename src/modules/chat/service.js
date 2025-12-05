// src/modules/chat/service.js
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

/**
 * Membuat atau mendapatkan chat room antara customer dan seller
 * @param {string} customerId - ID customer
 * @param {string} sellerId - ID seller
 * @param {object} customerInfo - { name, avatar }
 * @param {object} sellerInfo - { name, avatar }
 * @param {string} productId - ID produk (opsional)
 * @returns {Promise<string>} - Chat ID
 */
export async function getOrCreateChatRoom(
  customerId,
  sellerId,
  customerInfo,
  sellerInfo,
  productId = null
) {
  // Convert ke string untuk konsistensi
  const customerIdStr = customerId.toString();
  const sellerIdStr = sellerId.toString();

  // Cek apakah chat room sudah ada
  // PERBAIKAN: Query yang lebih reliable
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "array-contains", customerIdStr)
  );

  const snapshot = await getDocs(q);
  
  // Cari chat room yang memiliki kedua participant
  const existingChat = snapshot.docs.find((doc) => {
    const participants = doc.data().participants;
    return participants.includes(customerIdStr) && participants.includes(sellerIdStr);
  });

  if (existingChat) {
    console.log('✅ Chat room already exists:', existingChat.id);
    return existingChat.id;
  }

  // Buat chat room baru
  const chatData = {
    participants: [customerIdStr, sellerIdStr].sort(), // Sort untuk konsistensi
    participantDetails: {
      [customerIdStr]: {
        name: customerInfo.name,
        avatar: customerInfo.avatar || null,
        role: "customer",
      },
      [sellerIdStr]: {
        name: sellerInfo.name,
        avatar: sellerInfo.avatar || null,
        role: "seller",
      },
    },
    productId: productId || null,
    lastMessage: null,
    unreadCount: {
      [customerIdStr]: 0,
      [sellerIdStr]: 0,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(chatsRef, chatData);
  console.log('✅ New chat room created:', docRef.id);
  return docRef.id;
}

/**
 * Mengirim pesan ke chat room
 * @param {string} chatId - ID chat room
 * @param {string} senderId - ID pengirim
 * @param {string} senderName - Nama pengirim
 * @param {string} text - Isi pesan
 */
export async function sendMessage(chatId, senderId, senderName, text, senderAvatar = null) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  
  // Tambah pesan
  const messageData = {
    text: text,
    senderId: senderId.toString(),
    senderName: senderName,
    senderAvatar: senderAvatar,
    timestamp: serverTimestamp(),
    read: false,
  };

  await addDoc(messagesRef, messageData);

  // Update last message di chat room
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: {
      text: text,
      timestamp: serverTimestamp(),
      senderId: senderId.toString(),
    },
    updatedAt: serverTimestamp(),
  });

  console.log('✅ Message sent successfully');
}

/**
 * Mendapatkan semua chat rooms untuk user tertentu
 * @param {string} userId - ID user
 * @param {function} callback - Callback function untuk real-time updates
 * @returns {function} - Unsubscribe function
 */
export function getUserChatRooms(userId, callback) {
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "array-contains", userId.toString()),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('📩 Chat rooms updated:', chats.length, 'chats');
      callback(chats);
    },
    (error) => {
      console.error('❌ Error fetching chat rooms:', error);
      callback([]);
    }
  );
}

/**
 * Mendapatkan semua pesan dalam chat room dengan real-time updates
 * @param {string} chatId - ID chat room
 * @param {function} callback - Callback function untuk real-time updates
 * @returns {function} - Unsubscribe function
 */
export function getChatMessages(chatId, callback) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('💬 Messages updated:', messages.length, 'messages');
      callback(messages);
    },
    (error) => {
      console.error('❌ Error fetching messages:', error);
      callback([]);
    }
  );
}

/**
 * Mark pesan sebagai sudah dibaca
 * @param {string} chatId - ID chat room
 * @param {string} messageId - ID pesan
 */
export async function markMessageAsRead(chatId, messageId) {
  const messageRef = doc(db, "chats", chatId, "messages", messageId);
  await updateDoc(messageRef, {
    read: true,
    readAt: serverTimestamp(),
  });
}

/**
 * Mendapatkan info chat room
 * @param {string} chatId - ID chat room
 * @returns {Promise<object>} - Chat room data
 */
export async function getChatRoomInfo(chatId) {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);
  
  if (chatSnap.exists()) {
    return {
      id: chatSnap.id,
      ...chatSnap.data(),
    };
  }
  return null;
}

export async function incrementUnreadCount(chatId, receiverId) {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);
  
  if (chatSnap.exists()) {
    const currentUnread = chatSnap.data().unreadCount || {};
    const newCount = (currentUnread[receiverId.toString()] || 0) + 1;
    
    await updateDoc(chatRef, {
      [`unreadCount.${receiverId.toString()}`]: newCount,
    });
  }
}

export async function resetUnreadCount(chatId, userId) {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    [`unreadCount.${userId.toString()}`]: 0,
  });
}