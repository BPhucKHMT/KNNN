// Component input tin nhắn với auto-resize, gửi khi nhấn Enter, và prefill tự động gửi
import React, { useState, useEffect, useRef } from 'react';
import { Send } from "lucide-react";

export default function MessageInput({ onSend, prefill }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Cuộn xuống cuối trang ngay sau khi gửi
  const scrollToBottomWindow = () => {
    // Đợi DOM cập nhật xong rồi mới cuộn
    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    });
  };

  // Nhận prefill và tự gửi (nếu có), sau đó cuộn xuống cuối
  useEffect(() => {
    if (prefill) {
      setValue(prefill);
      setTimeout(() => {
        onSend(prefill);
        setValue('');
        scrollToBottomWindow();
      }, 200);
    }
  }, [prefill]);

  // Auto-resize theo nội dung
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '0px';
    const scrollH = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = Math.min(scrollH, 160) + 'px';
  }, [value]);

  // Gửi khi nhấn Enter (trừ khi Shift+Enter để xuống dòng)
  function handleKey(e) {
    // Bỏ qua khi đang gõ bằng IME để không gửi nhầm
    if (e.isComposing) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend(value.trim());
        setValue('');
        scrollToBottomWindow();
      }
    }
  }

  // Click nút Gửi
  function handleClickSend() {
    if (value.trim()) {
      onSend(value.trim());
      setValue('');
      scrollToBottomWindow();
    }
  }

  return (
    <div>
      <div className="border border-white/10 bg-[#0f1218]/60 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] p-2 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Nhập nhu cầu học tập của bạn..."
          className="w-full bg-transparent text-gray-100 outline-none resize-none px-3 py-3 text-sm md:text-base"
          rows={1}
          aria-label="Nhập tin nhắn"
        />
        <div className="flex justify-end px-2 pb-1">
          {/* Button gửi tin nhắn */}
          <button
            onClick={handleClickSend}
            disabled={!value.trim()}
            className={`
              w-10 h-10 flex items-center justify-center rounded-full
              bg-white/10 border border-white/20 backdrop-blur
              transition-all duration-300
              hover:bg-white/20 hover:scale-110
              will-change-transform 
              disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed
            `}
            title="Gửi tin nhắn"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">
        ChatBot AI có thể mắc lỗi. Hãy kiểm tra kĩ các thông tin quan trọng
      </p>
    </div>
  );
}
