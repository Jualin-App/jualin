'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

export function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');

  const submit = () => {
    const text = input.trim();
    if (!text || disabled) return;
    onSend?.(text);
    setInput('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-white">
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="w-full pl-5 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        />
        <button
          onClick={submit}
          disabled={disabled || !input.trim()}
          className="absolute right-3 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          type="button"
          aria-label="Send message"
        >
          <Send className="h-5 w-5 -rotate-45" />
        </button>
      </div>
    </div>
  );
}
