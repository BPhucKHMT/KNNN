// Component popup modal hiển thị chi tiết công cụ
import React, { useEffect, useRef } from 'react';

export default function Modal({ open, title, children, link, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-xl max-h-[85vh] flex flex-col
                   bg-[#0f1218]/95 backdrop-blur border border-white/10 
                   rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header cố định */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-white/10">
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-3 right-3 w-8 h-8 rounded-full
                       bg-white/10 hover:bg-white/20 border border-white/10
                       text-gray-200 transition"
            title="Đóng"
          >
            ✕
          </button>

          <h3 className="text-lg font-semibold text-white pr-8">{title}</h3>
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
            {children}
          </div>
        </div>

        {/* Footer với link (nếu có) */}
        {link && (
          <div className="flex-shrink-0 px-5 py-4 border-t border-white/10">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-xl
                         bg-pink-500 hover:bg-pink-600 text-white 
                         transition text-sm font-semibold"
            >
              Mở trang công cụ
            </a>
          </div>
        )}
      </div>
    </div>
  );
}