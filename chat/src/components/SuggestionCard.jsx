// Component card gợi ý công cụ, hiển thị title và summary ngắn
import React from 'react';

export default function SuggestionCard({ title, summary, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="text-left bg-bubbleBot border border-gray-700/50 hover:border-gray-500/60
                 rounded-2xl px-4 py-3 shadow-soft transition
                 focus:outline-none focus:ring-2 focus:ring-white/20"
      aria-label={`Xem chi tiết: ${title}`}>

      <div className="font-semibold text-gray-100">{title}</div>
      <div className="text-gray-400 text-sm mt-1 leading-relaxed line-clamp-2 overflow-hidden">
        {summary}
      </div>
    </button>
  );
}
