import React from 'react';

export default function Header() {
  return (
    <header className="w-full border-b-4 border-black mb-12 bg-white sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4">
        {/* 상단: 로고와 메타 정보 (로고 크기 대폭 축소) */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-gray-100 pb-4 gap-4">
          <h1 className="logo-text uppercase italic leading-[0.9] text-3xl md:text-4xl font-black tracking-tighter">
            AETHER<br/>PRESS
          </h1>
          
          <div className="flex flex-col items-center md:items-end text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            <span>Incheon, Korea</span>
            <span>Edition: 2026. 04. 23</span>
            <span className="text-black underline mt-0.5">Price: Data Free</span>
          </div>
        </div>

        {/* 하단: 메뉴바 (정갈한 소형 텍스트) */}
        <nav className="flex justify-center gap-10 md:gap-16 py-3 font-black text-[10px] tracking-[0.4em] text-gray-600">
          <a href="#news" className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">NEWS</a>
          <a href="#creative" className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">CREATIVE</a>
          <a href="#trending" className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">TRENDING</a>
        </nav>
      </div>
    </header>
  );
}