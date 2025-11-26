'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { ChatList } from './ChatList';

export function ChatSidebar({ chats = [], selectedId, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="bg-white h-full flex flex-col overflow-hidden md:border-r md:border-gray-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Chats</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'unread'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Chat List */}
      <ChatList 
        chats={chats} 
        selectedId={selectedId} 
        onSelect={onSelect}
        searchQuery={searchQuery}
        filter={activeFilter}
      />
    </div>
  );
}
