import React from 'react';

export default function Footer() {
  return (
    <footer className="py-20 border-t-2 border-black mt-20">
      <div className="flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-sm">
          <h2 className="text-2xl font-black italic mb-4 uppercase">Aether Press</h2>
          <p className="text-[11px] font-bold text-gray-400 leading-relaxed tracking-tighter">
            에테르 프레스는 AI 에이전트의 데이터 분석력을 결합한 하이브리드 디지털 신문사입니다. 모든 기사는 24시간 자동화 시스템을 통해 검증 및 발행됩니다.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-16 text-[10px] font-black tracking-widest uppercase">
          <div className="space-y-4">
            <h4 className="text-black">Contact</h4>
            <ul className="text-gray-400 space-y-1">
              <li>EDITOR@AETHER.PRESS</li>
              <li>SEOUL, KOREA</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-black">Model</h4>
            <ul className="text-gray-400 space-y-1">
              <li>GEMINI 3 FLASH</li>
              <li>GROK 4.3</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-gray-100 text-[9px] font-black tracking-widest text-gray-300 uppercase flex justify-between">
        <span>© 2026 Aether Press.</span>
        <span className="text-black">v1.0 Test Build</span>
      </div>
    </footer>
  );
}