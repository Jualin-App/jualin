'use client';
import { ChatHeader } from './ChatHeader';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';

export function ChatWindow({ chat, messages = [], onSend }) {
  return (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      <ChatHeader chat={chat} />
      <div className="flex-1 overflow-y-auto bg-gray-50 py-6 pt-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}
      </div>
      <ChatInput onSend={onSend} disabled={!chat} />
    </div>
  );
}
