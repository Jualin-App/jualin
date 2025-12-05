"use client";
import { useEffect, useState, useContext } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import {
  Menu, X } from "lucide-react";
import { AuthContext } from "@/context/AuthProvider";
import { ChatContext } from "@/context/ChatProvider";

export function ChatInterface() {
  const { user, loading: authLoading } = useContext(AuthContext); // ✅ Gunakan useContext
  const { chats, currentChat, messages, selectChat, sendMessage, loading } =
    useContext(ChatContext); // ✅ Gunakan ChatProvider
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (chats.length > 0 && !currentChat) {
      selectChat(chats[0]);
    }
  }, [chats, currentChat, selectChat]);

  const handleSelect = (id) => {
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      selectChat(chat);
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    try {
      await sendMessage(text.trim());
      console.log("✅ Message sent successfully");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="relative flex h-[calc(100vh-4rem)] md:h-[800px] bg-white overflow-hidden shadow-lg border border-gray-100">
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent mb-4"></div>
            <p className="text-gray-500">Loading chats...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex h-[calc(100vh-4rem)] md:h-[800px] bg-white overflow-hidden shadow-lg border border-gray-100">
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-4 font-medium">
              Please login to access chat
            </p>
            <a
              href="/login"
              className="inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className="relative flex h-[calc(100vh-4rem)] md:h-[800px] bg-white overflow-hidden shadow-lg border border-gray-100">
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
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 absolute md:relative top-0 left-0 bottom-0 md:inset-y-0 z-30 md:z-auto w-80 md:w-[30%] bg-white transition-transform duration-300 ease-in-out`}
      >
        <ChatSidebar
          chats={chats}
          selectedId={currentChat?.id}
          onSelect={handleSelect}
        />
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
        <ChatWindow
          chat={currentChat}
          messages={messages}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
