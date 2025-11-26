'use client';
import { CheckCircle2 } from 'lucide-react';

export function ChatHeader({ chat }) {
  if (!chat) {
    return (
      <div className="relative px-6 py-4 border-b border-gray-100 bg-white z-50 md:sticky md:top-0 md:z-40 md:shadow-sm">
        <p className="text-sm text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="relative px-6 py-4 border-b border-gray-100 bg-white z-50 md:sticky md:top-0 md:z-40 md:shadow-sm">
      <div className="flex items-center gap-4">
        {/* Large Avatar */}
        <div className="relative shrink-0">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-sm" />
          {chat.online && (
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-gray-900 truncate">{chat.name}</h2>
          </div>
          <p className="text-sm text-gray-500 truncate mb-1">
            {chat.handle || `@${chat.name.toLowerCase().replace(/\s+/g, '')}`}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>Bergabung 6 tahun lalu</span>
            <span className="flex items-center gap-1 text-blue-500">
              <CheckCircle2 className="h-3 w-3 fill-blue-500 text-white" />
              Terverifikasi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
