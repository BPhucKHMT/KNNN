// Component card gợi ý công cụ, hiển thị title, favicon và summary ngắn
import React from 'react';

export default function SuggestionCard({ title, summary, iconUrl, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="text-left bg-bubbleBot border border-gray-700/50 hover:border-gray-500/60
                 rounded-2xl px-4 py-3 shadow-soft transition
                 focus:outline-none focus:ring-2 focus:ring-white/20"
      aria-label={`Xem chi tiết: ${title}`}
      title="Xem chi tiết"
    >
      {/* Hàng tiêu đề + favicon */}
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-gray-100 truncate">{title}</div>
        {iconUrl && (
          <img
            src={iconUrl}
            alt=""
            className="w-6 h-6 rounded-md flex-shrink-0"
            loading="lazy"
          />
        )}
      </div>

      {/* Summary */}
      <div className="text-gray-400 text-sm mt-1 leading-relaxed line-clamp-3 overflow-hidden">
        {summary}
      </div>
    </button>
  );
}
