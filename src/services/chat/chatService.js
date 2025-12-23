import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getOrCreateChatRoom(
  customerId,
  sellerId,
  customerInfo,
  sellerInfo,
  productId = null
) {
  const customerIdStr = customerId.toString();
  const sellerIdStr = sellerId.toString();

  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "array-contains", customerIdStr)
  );
  const snapshot = await getDocs(q);

  const existingChat = snapshot.docs.find((docu) => {
    const participants = docu.data().participants;
    return (
      participants.includes(customerIdStr) && participants.includes(sellerIdStr)
    );
  });

  if (existingChat) return existingChat.id;

  const chatData = {
    participants: [customerIdStr, sellerIdStr].sort(),
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
    unreadCount: { [customerIdStr]: 0, [sellerIdStr]: 0 },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(chatsRef, chatData);
  return docRef.id;
}

export async function sendMessage(
  chatId,
  senderId,
  senderName,
  text,
  senderAvatar = null
) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const messageData = {
    text,
    senderId: senderId.toString(),
    senderName,
    senderAvatar,
    timestamp: serverTimestamp(),
    read: false,
  };
  await addDoc(messagesRef, messageData);

  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: {
      text,
      timestamp: serverTimestamp(),
      senderId: senderId.toString(),
    },
    updatedAt: serverTimestamp(),
  });
}

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
      const chats = snapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
      }));
      callback(chats);
    },
    (error) => {
      console.error("❌ Error fetching chat rooms:", error);
      callback([]);
    }
  );
}

export function getChatMessages(chatId, callback) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
      }));
      callback(messages);
    },
    (error) => {
      console.error("❌ Error fetching messages:", error);
      callback([]);
    }
  );
}

export async function markMessageAsRead(chatId, messageId) {
  const messageRef = doc(db, "chats", chatId, "messages", messageId);
  await updateDoc(messageRef, { read: true, readAt: serverTimestamp() });
}

export async function getChatRoomInfo(chatId) {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);
  if (chatSnap.exists()) return { id: chatSnap.id, ...chatSnap.data() };
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
  await updateDoc(chatRef, { [`unreadCount.${userId.toString()}`]: 0 });
}
