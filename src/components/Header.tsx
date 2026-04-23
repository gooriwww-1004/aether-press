import React from 'react';

export default function Header() {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });

  return (
    <header className="w-full border-b-4 border-black mb-12 bg-white sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4">

        {/* 상단: 로고 + 메타 + 외부 링크 버튼 */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-gray-100 pb-4 gap-4">

          {/* 로고: 코인 이미지 + 텍스트 */}
          <a href="https://queenhome.pages.dev/" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 group">
            <img
              src="/queencoin.jpg"
              alt="Queen of Millennium Session"
              width={52}
              height={52}
              className="rounded-full object-cover border-2 border-black group-hover:opacity-80 transition-opacity"
            />
            <h1 className="uppercase italic leading-[0.9] text-3xl md:text-4xl font-black tracking-tighter group-hover:opacity-70 transition-opacity">
              AETHER<br/>PRESS
            </h1>
          </a>

          {/* 우측: 날짜 + 외부 링크 버튼들 */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase text-right">
              <span className="block">Incheon, Korea</span>
              <span className="block">Edition: {today}</span>
              <span className="block text-black underline mt-0.5">Price: Data Free</span>
            </div>

            {/* 외부 링크 버튼 */}
            <div className="flex gap-2 mt-1">
              <a
                href="https://queenhome.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 border border-black text-[9px] font-black tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
              >
                HOME
              </a>
              <a
                href="https://queenofboard.vercel.app/board"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-black text-white text-[9px] font-black tracking-widest uppercase hover:bg-gray-800 transition-colors"
              >
                BOARD
              </a>
            </div>
          </div>
        </div>

        {/* 하단: 내비게이션 */}
        <nav className="flex justify-center gap-10 md:gap-16 py-3 font-black text-[10px] tracking-[0.4em] text-gray-600">
          <a href="#news"     className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">NEWS</a>
          <a href="#trending" className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">MUSIC</a>
          <a href="#creative" className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">CREATIVE</a>
          <a
            href="https://queenofboard.vercel.app/board"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
          >
            COMMUNITY
          </a>
        </nav>
      </div>
    </header>
  );
}
