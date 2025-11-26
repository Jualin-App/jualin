'use client';
import { useEffect, useState } from 'react';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatWindow } from '@/components/chat/chat-window';
import { fetchChats, fetchMessages, sendMessage } from '@/modules/chat/services';
import { Menu, X } from 'lucide-react';

export function ChatInterface() {
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selectedChat = chats.find((c) => c.id === selectedId) || null;

  useEffect(() => {
    const init = async () => {
      const list = await fetchChats();
      setChats(list);
      const firstId = list[0]?.id || null;
      setSelectedId(firstId);
      if (firstId) {
        const msgs = await fetchMessages(firstId);
        setMessages(msgs);
      }
    };
    init();
  }, []);

  const handleSelect = async (id) => {
    setSelectedId(id);
    const msgs = await fetchMessages(id);
    setMessages(msgs);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSend = async (text) => {
    if (!selectedId || !text.trim()) return;
    const sent = await sendMessage(selectedId, text.trim());
    const next = Array.isArray(sent)
      ? sent
      : [
          ...messages,
          {
            id: Date.now(),
            sender: 'You',
            content: text.trim(),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
          },
        ];
    setMessages(next);
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] md:h-[800px] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-2 left-2 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar - 30% width */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 absolute md:relative top-0 left-0 bottom-0 md:inset-y-0 z-30 md:z-auto w-80 md:w-[30%] bg-white transition-transform duration-300 ease-in-out`}
      >
        <ChatSidebar chats={chats} selectedId={selectedId} onSelect={handleSelect} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat window - 70% width */}
      <div className="flex-1 md:w-[70%] flex flex-col min-w-0 relative z-10 md:z-auto">
        <ChatWindow chat={selectedChat} messages={messages} onSend={handleSend} />
      </div>
    </div>
  );
}
