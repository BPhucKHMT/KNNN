// Component gốc của ứng dụng
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';

// Định nghĩa các route cho ứng dụng
export default function App() { 
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang giới thiệu */}
        <Route path="/" element={<IntroPage />} />
        {/* Trang Chat */}
        <Route path="/chat" element={<ChatPage />} />
        {/* Trang About Us */}
        <Route path="/about" element={<AboutUsPage />} />
        {/* Trang Support (placeholder) */}
        <Route path="/support" element={<div className="min-h-screen bg-[#0b0f16] text-white flex items-center justify-center"><h1 className="text-4xl">Service & Support - Coming Soon</h1></div>} />
        {/* Redirect các route không tồn tại về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}