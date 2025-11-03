// Trang Chat
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ChatMessage from "../components/ChatMessage.jsx";
import MessageInput from "../components/MessageInput.jsx";
import Modal from "../components/Modal.jsx";
import SuggestionCard from "../components/SuggestionCard.jsx";
import { askTools } from "../lib/api.js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LS_KEY = "chat_messages_v1";

/* Header */
function Header({ onBackToIntro, onReset }) {
  return (
    <header className="sticky top-0 z-20">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 py-5">
        <div className="relative flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl px-5 py-3">
          
          {/* Nút Back */}
          <button
            onClick={onBackToIntro}
            className="absolute left-5 text-sm font-semibold text-white hover:text-pink-400 transition"
            title="Trở về trang giới thiệu"
          >
            ← QUAY LẠI
          </button>

          {/* Tiêu đề ở giữa */}
          <span className="font-semibold tracking-wide text-white text-center">
            ChatBot AI gợi ý công cụ học tập
          </span>

          {/* Nút Reset */}
          <button
            onClick={onReset}
            className="absolute right-5 text-sm font-semibold text-white hover:text-pink-400 transition"
            title="Tạo cuộc hội thoại mới"
          >
            CHAT MỚI +
          </button>
        </div>
      </div>
    </header>
  );
}

/* Khối Welcome */
function Welcome({ onExampleClick }) {
  // Mẫu gợi ý
  const examples = [
    "Tôi muốn lên kế hoạch nội dung và đăng bài tự động",
    "Có app nào kết hợp lịch, việc và ghi chú không?",
    "Công cụ nào giúp tôi quản lý thời gian hiệu quả?",
  ];
  return (
    // Khung welcome
    <div className="rounded-2xl border border-white/10 bg-[#0f1218]/90 backdrop-blur p-5 sm:p-6">
      <h2 className="text-2xl font-semibold mb-2 text-white">Xin chào bạn!</h2>
      <p className="text-sm text-white/80">
        Hãy hỏi bất cứ điều gì về công cụ học tập trên Internet. Mình sẽ đề xuất
        3 lựa chọn phù hợp nhất, kèm các bước hướng dẫn sử dụng công cụ đó.
      </p>

      {/* Chức năng cho các button gợi ý */}
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => onExampleClick(ex)}
            className="text-left text-sm px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/90"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Trang chat chính */
export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => { // load từ localStorage
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [prefillText, setPrefillText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  
  const scrollRef = useRef(null);
  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  // Cuộn xuống cuối vùng chat
  function scrollToBottom() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }

  // Lưu messages vào localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(messages));
  }, [messages]);

  // Cuộn xuống dưới cùng khi mới vào trang
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll khi có tin nhắn mới hoặc đang loading
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  function handleReset() {
    setMessages([]);
    setActiveSuggestion(null);
    setErrorText("");
    setPrefillText("");
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* noop */
    }
    // Cuộn về cuối
    requestAnimationFrame(scrollToBottom);
  }

  /* Map dữ liệu tool từ backend */
  function mapToolsForUI(tools = []) {
    return tools.slice(0, 3).map((t) => ({
      title: t?.name || "Công cụ",
      summary:
        t?.description ||
        (Array.isArray(t?.advantages)
          ? t.advantages.join(" · ")
          : "Gợi ý công cụ phù hợp"),
      link: t?.url || null,    
      details: [
        t?.category ? `• Nhóm: ${t.category}` : null,
        t?.pricing ? `• Chi phí: ${t.pricing}` : null,
        t?.setup_time ? `• Thời gian thiết lập: ${t.setup_time}` : null,
        t?.difficulty_level ? `• Độ khó: ${t.difficulty_level}` : null,
        Array.isArray(t?.advantages) && t.advantages.length
          ? `✓ Ưu điểm:\n- ${t.advantages.join("\n- ")}`
          : null,
        Array.isArray(t?.disadvantages) && t.disadvantages.length
          ? `✗ Nhược điểm:\n- ${t.disadvantages.join("\n- ")}`
          : null,
        Array.isArray(t?.quick_guide) && t.quick_guide.length
          ? `Bắt đầu nhanh:\n${t.quick_guide
              .map((s, i) => `${i + 1}. ${s}`)
              .join("\n")}`
          : null,
        t?.best_for ? `Phù hợp nhất cho: ${t.best_for}` : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
    }));
  }

  /* Gửi câu hỏi, gọi BE và render */
  function addUserMessage(text) {
    if (!text || !text.trim()) return;

    // Thêm tin nhắn user và cuộn ngay
    setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
    requestAnimationFrame(scrollToBottom);

    // Gọi backend
    setErrorText("");
    setLoading(true);

    askTools(text.trim())
      .then((data) => {
        const tools = Array.isArray(data?.recommended_tools)
          ? data.recommended_tools
          : [];
        const mapped = mapToolsForUI(tools);

        const extra = [];

        if (Array.isArray(data?.comparison) && data.comparison.length) {
          extra.push({
            role: "assistant",
            type: "preface",
            content: "So sánh nhanh giữa các lựa chọn:",
          });
          extra.push({
            role: "assistant",
            content: data.comparison.map((x) => `• ${x}`).join("\n"),
          });
        }

        if (
          Array.isArray(data?.final_recommendation) &&
          data.final_recommendation.length
        ) {
          extra.push({
            role: "assistant",
            type: "preface",
            content: "Kết luận nhanh:",
          });
          extra.push({
            role: "assistant",
            content: data.final_recommendation.join("\n\n"),
          });
        }

        if (Array.isArray(data?.next_steps) && data.next_steps.length) {
          extra.push({
            role: "assistant",
            type: "preface",
            content: "Các bước tiếp theo bạn có thể làm:",
          });
          extra.push({
            role: "assistant",
            content: data.next_steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
          });
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "preface",
            content: "Dưới đây là 3 công cụ phù hợp nhất cho nhu cầu của bạn:",
          },
          { role: "assistant", type: "suggestionRow", payload: mapped },
          ...extra,
        ]);

        // Cuộn sau khi nhận phản hồi từ chatbot
        requestAnimationFrame(scrollToBottom);
      })
      .catch((err) => {
        setErrorText(err?.message || "Không thể gọi API.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Xin lỗi, hiện không thể lấy gợi ý từ máy chủ. Hãy thử lại sau.",
          },
        ]);
        requestAnimationFrame(scrollToBottom);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#0b0f16] text-white">
      {/* Nền radial nhẹ giống IntroPage */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(120%_120%_at_0%_100%,rgba(236,72,153,0.18)_0%,transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(124,58,237,0.12)_0%,transparent_55%)]"
      />

      <Header onBackToIntro={() => navigate('/')} onReset={handleReset} />

      {/* Khung chính căn giữa */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="relative z-10 flex-1 overflow-y-auto pb-40"
        ref={scrollRef}
      >
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 py-6">
          {/* Vùng chat căn giữa */}
          <div className="mx-auto w-full max-w-3xl">
            {!hasMessages && (
              <div className="mb-6">
                <Welcome onExampleClick={(text) => setPrefillText(text)} />
              </div>
            )}

            {messages.map((m, idx) => {
              if (m.type === "preface") {
                return (
                  <ChatMessage key={idx} role="assistant">
                    {m.content}
                  </ChatMessage>
                );
              }
              if (m.type === "suggestionRow") {
                const items = m.payload || [];
                return (
                  <div key={idx} className="w-full my-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {items.map((s, i) => (
                        <SuggestionCard
                          key={i}
                          title={s.title}
                          summary={s.summary}
                          onOpen={() => setActiveSuggestion(s)}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <ChatMessage key={idx} role={m.role}>
                  {m.content}
                </ChatMessage>
              );
            })}

            {loading && (
              <ChatMessage role="assistant">
                Đang tìm công cụ phù hợp cho bạn…
              </ChatMessage>
            )}

            {!!errorText && (
              <ChatMessage role="assistant">Lỗi: {errorText}</ChatMessage>
            )}
          </div>
        </div>
      </motion.main>

      {/* Input cố định dưới */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-20 pb-4"
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <MessageInput onSend={addUserMessage} prefill={prefillText} />
        </div>
      </motion.div>

      {/* Modal chi tiết tool */}
      <Modal
        open={!!activeSuggestion}
        title={activeSuggestion?.title}
        link={activeSuggestion?.link}
        onClose={() => setActiveSuggestion(null)}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {activeSuggestion?.details}
        </div>
      </Modal>
    </div>
  );
}
