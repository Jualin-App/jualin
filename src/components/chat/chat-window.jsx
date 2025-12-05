'use client';
import { useEffect, useRef, useContext } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { AuthContext } from '@/context/AuthProvider';

export function ChatWindow({ chat, messages = [], onSend }) {
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // No chat selected
  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">Select a chat to start messaging</p>
          <p className="text-gray-400 text-sm mt-2">Choose a conversation from the sidebar</p>
        </div>
      </div>
    );
  }

  // Get other participant info dari chat
  // GUNAKAN participantDetails (bukan participantsInfo)
  const otherParticipantId = chat.participants?.find(
    (id) => id !== user?.id?.toString()
  );
  const otherParticipant = otherParticipantId 
    ? chat.participantDetails?.[otherParticipantId]
    : null;

  // Transform messages ke format ChatBubble
  const transformedMessages = messages.map((msg) => {
    // Handle Firebase Timestamp
    const timestamp = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp);
    
    return {
      id: msg.id,
      content: msg.text,
      time: timestamp.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isMe: msg.senderId === user?.id?.toString(),
      sender: msg.senderId === user?.id?.toString() ? 'You' : msg.senderName,
      avatar: msg.senderAvatar,
    };
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <ChatHeader 
        name={otherParticipant?.name || 'Unknown User'}
        handle={otherParticipant?.name 
          ? `@${otherParticipant.name.toLowerCase().replace(/\s+/g, '')}` 
          : '@user'}
        avatar={otherParticipant?.avatar}
        role={otherParticipant?.role}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 py-6">
        {transformedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {transformedMessages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} disabled={!chat} />
    </div>
  );
}
