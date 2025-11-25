'use client';
import { Badge } from '@/components/ui/Badge';

export function ChatItem({ chat, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`mx-4 my-2 p-4 rounded-2xl cursor-pointer transition-all ${
        isSelected
          ? 'bg-gray-50 shadow-md shadow-red-500/20 border border-red-200 ring-2 ring-red-500/30'
          : 'hover:bg-gray-50/50 border border-transparent hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-sm" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Handle */}
          <div className="mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{chat.name}</h3>
            <p className="text-xs text-gray-500 truncate">{chat.handle || `@${chat.name.toLowerCase().replace(/\s+/g, '')}`}</p>
          </div>

          {/* Message Preview and Badge */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-xs text-gray-600 truncate flex-1 leading-relaxed">
              {chat.message || 'No messages'}
            </p>
            {chat.unread > 0 && (
              <Badge className="h-5 min-w-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center px-1.5 text-[10px] font-medium shrink-0 text-white">
                {chat.unread}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
