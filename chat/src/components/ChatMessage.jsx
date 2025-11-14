// Component hiển thị tin nhắn chat với 2 role (user/assistant)
import React from 'react';

export default function ChatMessage({ role = 'assistant', children, time }) {
  const isUser = role === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className="flex flex-col items-end max-w-[88%] md:max-w-[70%]">
        {/* Bong bóng tin nhắn */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-soft text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? 'bg-bubbleUser text-gray-100 rounded-br-md'
              : 'bg-bubbleBot text-gray-200 rounded-bl-md'
          }`}
        >
          {children}
        </div>
        {/* Hiển thị thời gian cho User */}
        {isUser && time && (
          <span className="text-[12px] text-gray-400 mt-1">
            {time}
          </span>
        )}
      </div>
    </div>
  );
}
