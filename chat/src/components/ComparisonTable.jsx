import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function ComparisonTable({ tools, comparisonTexts }) {
  // Giả định comparisonTexts đã được format sẵn theo thứ tự tương ứng với tools
  const toolComparisons = comparisonTexts || [];

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] rounded-2xl border border-gray-700/50 bg-bubbleBot shadow-soft overflow-hidden">
        
        {/* Header: Các công cụ */}
        <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(180px,1fr))] gap-0 border-b border-gray-700/50">
          {/* Ô góc trái trên */}
          <div className="px-4 py-3 border-r border-gray-700/50 flex items-center">
            <h4 className="font-semibold text-white">
              Tiêu chí
            </h4>
          </div>
          
          {/* Các công cụ */}
          {tools.map((tool, idx) => (
            <div 
              key={idx}
              className="px-4 py-3 border-r border-gray-700/50 last:border-r-0 flex items-center"
            >
              <div className="flex items-center gap-3">
                {/* Logo */}
                {tool.favicon && (
                  <img
                    src={tool.favicon}
                    alt=""
                    className="w-10 h-10 rounded-lg flex-shrink-0"
                    loading="lazy"
                  />
                )}
                
                {/* Tên và Link */}
                <div className="flex flex-col gap-1 min-w-0">
                  {/* Tên công cụ */}
                  <span className="font-semibold text-white text-xm leading-tight">
                    {tool.title}
                  </span>
                  
                  {/* Link */}
                  {tool.link && (
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors w-fit"
                      title="Truy cập website"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Truy cập</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Body: Thông tin so sánh */}
        <div>
          <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(180px,1fr))] gap-0 border-t border-gray-700/50">
            {/* Label "So sánh" */}
            <div className="px-4 py-3 border-r border-gray-700/50 flex items-center">
              <h4 className="font-semibold text-white">
                Giới thiệu chung
              </h4>
            </div>
            
            {/* Nội dung so sánh cho từng công cụ */}
            {toolComparisons.map((comparison, idx) => (
              <div 
                key={idx}
                className="px-4 py-3 border-r border-gray-700/50 last:border-r-0 flex items-center"
              >
                <p className="text-gray-300 text-sm leading-relaxed">
                  {comparison || '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}