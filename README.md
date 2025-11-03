# Kĩ năng nghề nghiệp

## Frontend (React + Vite + Tailwind CSS)
### Cấu trúc FE
```bash
frontend/
├── src/
│   ├── components/             # Các component sử dụng
│   │   ├── ChatMessage.jsx     # Tin nhắn chat (user/bot)
│   │   ├── MessageInput.jsx    # Ô nhập tin nhắn
│   │   ├── Modal.jsx           # Popup chi tiết công cụ
│   │   └── SuggestionCard.jsx  # Card gợi ý công cụ
│   │
│   ├── pages/                  # Các trang chính
│   │   ├── IntroPage.jsx       # Trang giới thiệu/landing
│   │   └── ChatPage.jsx        # Trang chat AI
│   │
│   ├── lib/                    # Utilities
│   │   └── api.js              # API gọi đến backend
│   │
│   ├── assets/                 # Hình ảnh, icons
│   │   ├── logo.png
│   │   └── robot-hands.png
│   │
│   ├── App.jsx                 # Root component với routing
│   ├── main.jsx                # Entry point
│   ├── styles.css              # Global styles + Tailwind
│   └── services
│       └── suggest.js          # Gọi API lấy gợi ý từ backend
│
├── postcss.config.js           # PostCSS config
├── tailwind.config.js          # Tailwind config        
└── vite.config.js              # Vite build config
```
### Chạy FE
```bash
cd chat
npm install
npm run dev
```
## Backend (Flask + FAISS + Google Gemini)
### Cấu trúc BE
```bash
backend/
├── app.py                      # Flask API server (port 5000)
├── myChat.py                   # AI chatbot với Google Gemini
├── db_storage.py               # Cache system (FAISS + SQLite)
├── requirements.txt            # Python dependencies
├── .env                        # API keys
└── query_cache.db              # SQLite cache storage (auto-generated)
```
### Chạy BE
```bash
python pip install -r requirements.txt
python app.py
```