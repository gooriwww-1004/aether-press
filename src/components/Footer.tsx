import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-black mt-20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-20">

        {/* 상단: 로고 + 설명 + 링크 */}
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* 로고 + 설명 */}
          <div className="max-w-sm">
            <a href="https://queenhome.pages.dev/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 mb-4 group">
              <img
                src="/queencoin.jpg"
                alt="Queen of Millennium Session"
                width={44}
                height={44}
                className="rounded-full object-cover border border-black group-hover:opacity-80 transition-opacity"
              />
              <h2 className="text-2xl font-black italic uppercase group-hover:opacity-70 transition-opacity">
                Aether Press
              </h2>
            </a>
            <p className="text-[11px] font-bold text-gray-400 leading-relaxed tracking-tighter">
              에테르 프레스는 AI 에이전트의 데이터 분석력을 결합한 하이브리드 디지털 신문사입니다.
              모든 기사는 24시간 자동화 시스템을 통해 검증 및 발행됩니다.
            </p>
          </div>

          {/* 링크 그리드 */}
          <div className="grid grid-cols-3 gap-10 text-[10px] font-black tracking-widest uppercase">

            <div className="space-y-4">
              <h4 className="text-black">Contact</h4>
              <ul className="text-gray-400 space-y-1">
                <li>EDITOR@AETHER.PRESS</li>
                <li>SEOUL, KOREA</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-black">Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://queenhome.pages.dev/"
                     target="_blank" rel="noopener noreferrer"
                     className="text-gray-400 hover:text-black transition-colors">
                    HOME
                  </a>
                </li>
                <li>
                  <a href="https://queenofboard.vercel.app/board"
                     target="_blank" rel="noopener noreferrer"
                     className="text-gray-400 hover:text-black transition-colors">
                    COMMUNITY
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-black">Model</h4>
              <ul className="text-gray-400 space-y-1">
                <li>GEMINI 2.5 FLASH</li>
                <li>CLAUDE SONNET</li>
              </ul>
            </div>

          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/queencoin.jpg"
              alt=""
              width={24}
              height={24}
              className="rounded-full object-cover opacity-60"
            />
            <span className="text-[9px] font-black tracking-widest text-gray-300 uppercase">
              © 2026 Queen of Millennium Session · Aether Press
            </span>
          </div>
          <div className="flex gap-6">
            <a href="https://queenhome.pages.dev/" target="_blank" rel="noopener noreferrer"
               className="text-[9px] font-black tracking-widest text-gray-300 uppercase hover:text-black transition-colors">
              Home
            </a>
            <a href="https://queenofboard.vercel.app/board" target="_blank" rel="noopener noreferrer"
               className="text-[9px] font-black tracking-widest text-gray-300 uppercase hover:text-black transition-colors">
              Board
            </a>
            <span className="text-[9px] font-black tracking-widest text-black uppercase">
              v1.1 Live
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
