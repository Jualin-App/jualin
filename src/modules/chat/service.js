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
  // Cek apakah chat room sudah ada
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "in", [
      [customerId, sellerId],
      [sellerId, customerId],
    ])
  );

  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    // Chat room sudah ada
    const existingChat = snapshot.docs[0];
    return existingChat.id;
  }

  // Buat chat room baru
  const chatData = {
    participants: [customerId, sellerId],
    participantDetails: {
      [customerId]: {
        name: customerInfo.name,
        avatar: customerInfo.avatar || null,
        role: "customer",
      },
      [sellerId]: {
        name: sellerInfo.name,
        avatar: sellerInfo.avatar || null,
        role: "seller",
      },
    },
    productId: productId,
    lastMessage: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(chatsRef, chatData);
  return docRef.id;
}

/**
 * Mengirim pesan ke chat room
 * @param {string} chatId - ID chat room
 * @param {string} senderId - ID pengirim
 * @param {string} senderName - Nama pengirim
 * @param {string} text - Isi pesan
 */
export async function sendMessage(chatId, senderId, senderName, text) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  
  // Tambah pesan
  const messageData = {
    text: text,
    senderId: senderId,
    senderName: senderName,
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
      senderId: senderId,
    },
    updatedAt: serverTimestamp(),
  });
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
    where("participants", "array-contains", userId),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chats);
  });
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

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
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