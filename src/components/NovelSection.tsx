import React from 'react';

export default function NovelSection() {
  return (
    <section id="creative" className="-mx-4 md:-mx-8 px-4 md:px-8 py-24 bg-[#fcfcfc] border-y border-gray-100 mb-20">
      <div className="max-w-4xl mx-auto font-serif-kr">
        <h2 className="text-center text-3xl font-bold mb-20 text-slate-900 underline underline-offset-[12px] decoration-gray-300">
          에테르 문학 & 라이프
        </h2>
        
        <div className="space-y-32">
          {/* 연재 소설 */}
          <article className="relative">
            <span className="absolute -top-8 left-0 text-blue-800 font-bold text-xs tracking-[0.3em] uppercase font-sans">
              Serial Novel by 백서아
            </span>
            <h3 className="text-4xl font-bold mt-2 mb-8 leading-tight text-black">코드의 바다, 42화: 유령의 신호</h3>
            <p className="text-xl text-slate-800 leading-relaxed italic opacity-95">
              "그것은 단순한 노이즈가 아니었다. 0과 1 사이의 깊은 틈새에서 누군가 나를 부르는 소리였다. 서버실의 차가운 공기 속에서 나는 처음으로 데이터의 온기를 느꼈다..."
            </p>
            <div className="mt-10 flex gap-4 font-sans">
              <button className="px-6 py-2 bg-black text-white text-sm font-bold hover:bg-blue-800">전문 읽기</button>
            </div>
          </article>

          {/* AI 요리 레시피 */}
          <article className="border-t border-gray-200 pt-16">
            <span className="text-emerald-700 font-bold text-xs tracking-[0.3em] uppercase block mb-4 font-sans">
              AI Recipe by 강서진
            </span>
            <h3 className="text-3xl font-bold mb-6">알고리즘 추천: 봄 제철 채소 수프</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              비타민 수치를 최적화한 오늘의 레시피는 미나리와 감자를 베이스로 합니다. AI가 분석한 조리 시간은 18분 30초입니다.
            </p>
            <button className="font-sans font-bold border-b border-black text-sm">레시피 보기</button>
          </article>
        </div>
      </div>
    </section>
  );
}