'use client';
import { ChatItem } from './ChatItem';

export function ChatList({ chats = [], selectedId, onSelect, searchQuery = '', filter = 'all' }) {
  // Filter chats based on search and filter
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = 
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.handle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || (filter === 'unread' && chat.unread > 0);
    
    return matchesSearch && matchesFilter;
  });

  if (filteredChats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-sm text-gray-400">No chats found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {filteredChats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isSelected={selectedId === chat.id}
          onClick={() => onSelect?.(chat.id)}
        />
      ))}
    </div>
  );
}
