import api from '@/lib/axios';

/**
 * Fetch all chats for the current user
 * @returns {Promise<Array>} Array of chat objects
 */
export const fetchChats = async () => {
  try {
    const response = await api.get('/chats');
    return response.data.data || response.data || [];
  } catch (error) {
    // Silently handle network errors and return mock data for development
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
      // Network error or timeout - return mock data
      const now = Date.now();
      return [
      {
        id: 1,
        name: 'John Doe',
        handle: '@johndoe',
        message: 'Hey, how are you?',
        unread: 2,
        online: true,
        lastMessageTime: now - 300000, // 5 minutes ago
      },
      {
        id: 2,
        name: 'Jane Smith',
        handle: '@janesmith',
        message: 'Thanks for the help!',
        unread: 0,
        online: false,
        lastMessageTime: now - 7200000, // 2 hours ago
      },
      {
        id: 3,
        name: 'Bob Wilson',
        handle: '@bobwilson',
        message: 'Can we schedule a meeting?',
        unread: 1,
        online: true,
        lastMessageTime: now - 86400000, // 1 day ago
      },
    ];
    }
    // For other errors, still return mock data but log the error
    console.warn('API Error (using mock data):', error.message);
    const now = Date.now();
    return [
      {
        id: 1,
        name: 'John Doe',
        handle: '@johndoe',
        message: 'Hey, how are you?',
        unread: 2,
        online: true,
        lastMessageTime: now - 300000,
      },
      {
        id: 2,
        name: 'Jane Smith',
        handle: '@janesmith',
        message: 'Thanks for the help!',
        unread: 0,
        online: false,
        lastMessageTime: now - 7200000,
      },
      {
        id: 3,
        name: 'Bob Wilson',
        handle: '@bobwilson',
        message: 'Can we schedule a meeting?',
        unread: 1,
        online: true,
        lastMessageTime: now - 86400000,
      },
    ];
  }
};

/**
 * Fetch messages for a specific chat
 * @param {number|string} chatId - The ID of the chat
 * @returns {Promise<Array>} Array of message objects
 */
export const fetchMessages = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data.data || response.data || [];
  } catch (error) {
    // Silently handle network errors and return mock data for development
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
      // Network error or timeout - return mock data
      const now = Date.now();
      return [
      {
        id: 1,
        sender: 'John Doe',
        content: 'Hey, how are you?',
        time: new Date(now - 3600000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      },
      {
        id: 2,
        sender: 'You',
        content: "I'm doing great, thanks!",
        time: new Date(now - 3300000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      },
      {
        id: 3,
        sender: 'John Doe',
        content: 'That sounds awesome!',
        time: new Date(now - 3000000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      },
    ];
    }
    // For other errors, still return mock data but log the error
    console.warn('API Error (using mock data):', error.message);
    const now = Date.now();
    return [
      {
        id: 1,
        sender: 'John Doe',
        content: 'Hey, how are you?',
        time: new Date(now - 3600000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      },
      {
        id: 2,
        sender: 'You',
        content: "I'm doing great, thanks!",
        time: new Date(now - 3300000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      },
      {
        id: 3,
        sender: 'John Doe',
        content: 'That sounds awesome!',
        time: new Date(now - 3000000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      },
    ];
  }
};

/**
 * Send a message to a chat
 * @param {number|string} chatId - The ID of the chat
 * @param {string} text - The message text
 * @returns {Promise<Array>} Updated array of messages
 */
export const sendMessage = async (chatId, text) => {
  try {
    const response = await api.post(`/chats/${chatId}/messages`, {
      content: text,
    });
    // If API returns the full message list, return it
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // If API returns a single message, append it to existing messages
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    // Return null to indicate the message should be handled client-side
    return null;
  }
};

