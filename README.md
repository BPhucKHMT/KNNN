# Kĩ năng nghề nghiệp
## Feedback
- Góp ý về trang Intro
- Góp ý về trang About
- Góp ý về trang Support
- Góp ý về trang Chat
- Bug report
## Frontend (React + Vite + Tailwind CSS)
### Cấu trúc FE
```bash
frontend/
├── src/
│   ├── components/                     # Các component dùng chung
│   │   ├── ChatMessage.jsx             # Hiển thị bong bóng chat (user/bot)
│   │   ├── Header.jsx                  # Header chung cho Intro + About + Support
│   │   ├── MessageInput.jsx            # Ô nhập tin nhắn + nút gửi
│   │   ├── Modal.jsx                   # Popup chi tiết công cụ
│   │   └── SuggestionCard.jsx          # Card gợi ý công cụ
│   │
│   ├── pages/                          # Các trang chính của ứng dụng
│   │   ├── IntroPage.jsx               # Trang bắt đầu
│   │   ├── ChatPage.jsx                # Trang chatbot AI (logic chính)
│   │   ├── AboutPage.jsx               # Trang giới thiệu
│   │   └── SupportPage.jsx             # Trang hỗ trợ người dùng
│   │
│   ├── lib/
│   │   └── api.js                      # Hàm gọi API tới backend
│   │
│   ├── services/
│   │   └── suggest.js                  # Service xử lý gợi ý từ backend
│   │
│   ├── assets/                         # Hình ảnh, logo
│   │   └── .png
│   │
│   ├── App.jsx                         # Root component quản lý routes
│   ├── main.jsx                        # Entry point cho Vite
│   └── styles.css                      # Global styles + Tailwind
│
├── postcss.config.js                   # PostCSS config
├── tailwind.config.js                  # Tailwind config    
└── vite.config.js                      # Vite build config

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